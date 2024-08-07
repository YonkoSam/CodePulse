<?php

namespace App\Http\Controllers;

use App\Models\Pulse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PulseController extends Controller
{
    public function index()
    {
        return Inertia::render('Pulses/index', [
            'pulses' => Pulse::where('team_id', auth()->user()->current_team_id)->select('id', 'title', 'text', 'user_id', 'created_at', DB::raw("code->>'$.language' as language"))
                ->with('likes:id,user_id,pulse_id','user')
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
                ->select('id', 'title', 'text', 'user_id', 'created_at', DB::raw("code->>'$.language' as language"))
                ->with('likes:id,user_id,pulse_id','user')
                ->withCount('comments')
                ->visibleToUser(auth()->id())
                ->latest()
                ->paginate(6),
            'teams' => auth()->user()->teams()->get(),
        ]);
    }

    public function store()
    {

        $pulse = request()->validate([
            'title' => ['required', 'string', 'min:1'],
            'text' => ['required', 'string', 'min:1'],
            'code' => ['nullable'],
            'team_id' => 'nullable',
        ]);

        if (! isset(request()->code['sourceCode'])) {
            $pulse['code'] = null;
        }

        auth()->user()->pulses()->create($pulse);

        return to_route('pulses.index');

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

    public function update(Pulse $pulse)
    {

        $pulseObject= request()->validate([
            'title' => ['required', 'string', 'min:1'],
            'text' => ['required', 'string', 'min:1'],
            'code' => ['nullable'],
            'team_id' => 'nullable',
        ]);

        if (! isset(request()->code['sourceCode'])) {
            $pulseObject['code'] = null;
        }

        $pulse->update($pulseObject);

        return to_route('pulses.index');
    }
    public function show(Pulse $pulse)
    {


        $pulse->load([
            'user',
            'comments' => function ($query) {
                $userId = auth()->id();
                if($userId)
                $query->visibleToUser($userId)
                ->whereNull('comment_id');
            },
            'comments.user',
            'comments.replies',
            'likes:id,user_id,pulse_id',
        ]);

        $comments = $pulse->comments;
        $likes = $pulse->likes;

        $pulse->unsetRelation('comments');
        $pulse->unsetRelation('likes');

        if (request()->has('markAsRead')) {
            auth()->user()->notifications()->where('id', request()->markAsRead)->first()?->markAsRead();
            return redirect()->route('pulses.show', $pulse->id);
        }
        return Inertia::render('Pulses/show',
            ['pulse' => $pulse,
                'comments' => $comments,
                'likes' => $likes,
            ]
        );
    }
}
