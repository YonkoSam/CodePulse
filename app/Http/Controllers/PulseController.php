<?php

namespace App\Http\Controllers;

use App\Enums\XpAction;
use App\Http\Requests\PulseRequest;
use App\Jobs\AiAnswerPulseJob;
use App\Models\Pulse;
use App\Services\ProfanityFilterService;
use App\Services\XpService;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PulseController extends Controller
{


    public function index()
    {
        return Inertia::render('Pulses/index', [
            'pulses' => Pulse::where('team_id', auth()->user()->current_team_id)->select(['id', 'title', 'text', 'user_id', 'created_at', DB::raw("code->>'$.language' as language")])
                ->with(['likes'=>function($query){
                    $query->select(['id', 'user_id', 'pulse_id'])
                        ->whereNotNull('pulse_id');
                }, 'user'])
                ->withCount('comments')
                ->visibleToUser(auth()->id())
                ->latest()
                ->paginate(6),
            'teams' => auth()->user()->teams()->get(), ]);


    }

    public function tags(string $tag)
    {

        return Inertia::render('Pulses/index', [
            'pulses' => Pulse::where('code->language', $tag)
                ->select(['id', 'title', 'text', 'user_id', 'created_at', DB::raw("code->>'$.language' as language")])
                ->with(['likes'=>function($query){
                    $query->select(['id', 'user_id', 'pulse_id'])
                        ->whereNotNull('pulse_id');
                }, 'user'])
                ->withCount('comments')
                ->visibleToUser(auth()->id())
                ->latest()
                ->paginate(6),
            'teams' => auth()->user()->teams()->get(),
        ]);
    }

    public function show(Pulse $pulse)
    {

        $notificationResponse = $this->handleNotifications($pulse);
        if ($notificationResponse) {
            return $notificationResponse;
        }
        $pulse->load([
            'user',
            'likes'=>function($query){
            $query->select(['id', 'user_id', 'pulse_id'])
            ->whereNotNull('pulse_id');
            },
        ]);
        $userId = auth()->id();


        $comments = $pulse->comments()
            ->with(['user','replies','user.profile'=>fn($query) => $query->select(['id', 'xp','user_id']),'likes'=>function($query){
                $query->select(['id', 'user_id', 'comment_id'])
                    ->whereNotNull('comment_id');
            }])
            ->whereNull('comment_id')
            ->when(auth()->id(), function ($query) use ($userId) {
                return $query->visibleToUser($userId);
            })
            ->orderBy('is_best_answer', 'desc')
            ->paginate(5);

        $likes = $pulse->likes;


        $pulse->unsetRelation('likes');

        return Inertia::render('Pulses/show',
            ['pulse' => $pulse,
                'comments' => $comments,
                'likes' => $likes,
            ]
        );
    }

    protected function handleNotifications(Pulse $pulse)
    {
        if (request()->has('markAsRead')) {
            auth()->user()->notifications()->where('id', request()->markAsRead)->first()?->markAsRead();
            return redirect()->route('pulses.show', $pulse->id);
        }

        return null;
    }

    public function store(PulseRequest $request,ProfanityFilterService $profanityFilterService,XPService $xpService)
    {

        $pulseData = $request->validated();

        $pulseData =$this->handleCodeField($pulseData);

        $pulseData = $profanityFilterService->filter($pulseData,['title','text']);
        $pulse = auth()->user()->pulses()->create($pulseData);

        if($pulse)
        AiAnswerPulseJob::dispatch($pulse);
        $xpService->assignPoints(auth()->user()?->profile, XpAction::CREATE_PULSE);




        return to_route('pulses.index');
    }

    protected function handleCodeField($pulseData, $pulse = null)
    {
        if (!isset($pulseData['code']['sourceCode']) && $pulse) {
            $pulseData['code'] = $pulse->code;
        }

        return $pulseData;
    }

    public function create()
    {
        return Inertia::render('Pulses/CreateAndUpdate', ['teams' => auth()->user()->teams()->with(['users', 'invites'])->get()]);
    }

    public function edit(Pulse $pulse)
    {
        return Inertia::render('Pulses/CreateAndUpdate', [
            'teams' => auth()->user()->teams()->with(['users', 'invites'])->get(),
            'pulse' => $pulse,
        ]);
    }

    public function update(Pulse $pulse,PulseRequest $request,ProfanityFilterService $profanityFilterService)
    {

        $pulseData= $request->validated();
        $pulseData =$this->handleCodeField($pulseData,$pulse);

        $pulseData = $profanityFilterService->filter($pulseData,['title','text']);


        $pulse->update($pulseData);

        return to_route('pulses.index');
    }

    public function destroy(Pulse $pulse)
    {
        $pulse->delete();
        return to_route('pulses.index');
    }

}
