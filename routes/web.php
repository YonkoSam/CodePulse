<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\EducationController;
use App\Http\Controllers\ExperienceController;
use App\Http\Controllers\FriendController;
use App\Http\Controllers\FriendRequestController;
use App\Http\Controllers\isTypingController;
use App\Http\Controllers\isUserBlockedController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProfilesController;
use App\Http\Controllers\PulseController;
use App\Http\Controllers\ReplyController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\Teamwork\AuthController;
use App\Http\Controllers\Teamwork\TeamController;
use App\Http\Controllers\Teamwork\TeamMemberController;
use App\Http\Controllers\TestingGroundController;
use App\Http\Controllers\UnreadMessagesCountController;
use App\Http\Controllers\UploadProfileCoverController;
use App\Http\Controllers\UserSeenListController;
use App\Http\Controllers\UserSeenMessageController;
use App\Http\Middleware\isFriendMiddleware;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('welcome');
Route::get('/robots.txt', function () {
    return response()->file(public_path('robots.txt'));
});

Route::middleware('auth')->group(function () {
    //Search
    Route::get('/search/{query}', SearchController::class)->name('search');
    //Profiles

    Route::get('/profiles/{profile}', [ProfilesController::class, 'show'])
        ->middleware(['auth', 'verified'])->can('view', 'profile')->name('profiles.show');
    Route::get('/my-profile', [ProfilesController::class, 'show'])
        ->middleware(['auth', 'verified'])->name('home');
    Route::get('/create-profile', [ProfilesController::class, 'create'])->name('profiles.create');
    Route::get('/update-profile', [ProfilesController::class, 'edit'])->name('profiles.edit');
    Route::get('/profiles', [ProfilesController::class, 'index'])->name('profiles.index');
    Route::Post('/profiles', [ProfilesController::class, 'store'])->name('profiles.store');
    Route::Post('/profiles/cover', UploadProfileCoverController::class)->name('cover.upload');
    Route::Post('/profiles/experience', [ExperienceController::class, 'store'])->name('experience.store');
    Route::Post('/profiles/education', [EducationController::class, 'store'])->name('education.store');
    Route::patch('/profiles/experience/{experience}', [ExperienceController::class, 'update'])->name('experience.update');
    Route::patch('/profiles/education/{education}', [EducationController::class, 'update'])->name('education.update');
    Route::delete('/profiles/experience/{experience}', [ExperienceController::class, 'destroy'])->name('experience.destroy');
    Route::delete('/profiles/education/{education}', [EducationController::class, 'destroy'])->name('education.destroy');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/leader-board', [ProfilesController::class, 'leaderBoard'])->name('leader-board');

    //Pulses

    Route::get('/pulses/', [PulseController::class, 'index'])->name('pulses.index');
    Route::get('tags/{tag}', [PulseController::class, 'tags'])->name('pulses.tags');
    Route::get('/pulses/create', [PulseController::class, 'create'])->name('pulses.create');
    Route::Post('/pulses/create', [PulseController::class, 'store'])->name('pulses.store');
    Route::get('/pulses/edit/{pulse}', [PulseController::class, 'edit'])->name('pulses.edit')->middleware('can:edit,pulse');
    Route::patch('/pulses/edit/{pulse}', [PulseController::class, 'update'])->name('pulses.update')->middleware('can:edit,pulse');
    Route::delete('/pulses/{pulse}', [PulseController::class, 'destroy'])->name('pulses.destroy')->middleware('can:delete,pulse');
    Route::Post('/pulses', [LikeController::class, 'store'])->name('like.store');
    Route::Post('/pulses/comment', [CommentController::class, 'store'])->name('comment.store');
    Route::Post('/pulses/comment/reply', ReplyController::class)->name('reply');
    Route::patch('/pulses/comment/{comment}', [CommentController::class, 'update'])->name('comment.update')->can('update','comment');
    Route::delete('/pulses/comment/{comment}', [CommentController::class, 'destroy'])->name('comment.destroy')->can('delete','comment');
    Route::put('/pulses/{pulse}/best-answer/{comment}', [CommentController::class, 'markBestAnswer'])->name('pulses.best-answer')->can('edit','pulse');
    Route::get('/pulses/{pulse}', [PulseController::class, 'show'])->name('pulses.show')->middleware('can:view,pulse');

    //Friends

    Route::get('/code-mates', [FriendController::class, 'index'])->name('friends.index');
    Route::Post('/friend-request/send', [FriendRequestController::class, 'sendRequest'])->name('friend.request.send');
    Route::Post('/friend-request/accept', [FriendRequestController::class, 'acceptRequest'])->name('friend.request.accept');
    Route::Post('/friend-request/reject', [FriendRequestController::class, 'rejectRequest'])->name('friend.request.reject');
    Route::delete('/friend/delete/{friend}', [FriendController::class, 'destroy'])->name('friend.delete');
    Route::delete('/friend/block/{friend}', [FriendController::class, 'block'])->name('friend.block');
    Route::patch('/friend/unblock/{friend}', [FriendController::class, 'unblock'])->name('friend.unblock');
    Route::get('/friend/is-blocked/{id}', isUserBlockedController::class)->name('friend.is-blocked');

    //Chat

    Route::Post('/chat', [ChatController::class, 'store'])->name('chat.store');
    Route::get('/chat/', [ChatController::class, 'index'])->name('chat.index');
    Route::get('/chat/user/{receiverId?}', [ChatController::class, 'userChat'])->name('chat.user')->middleware(isFriendMiddleware::class);
    Route::get('/chat/team/{teamId}', [ChatController::class, 'teamChat'])->name('chat.team');
    Route::Post('/is-typing', isTypingController::class)->name('is-typing');
    Route::get('/my-chat/{receiverId}', [ChatController::class, 'show'])->name('chat.show');
    Route::delete('/message/{message}', [ChatController::class, 'destroy'])->name('message.destroy');
    Route::get('/unread-count', UnreadMessagesCountController::class)->name('message.unread-count');
    Route::Post('/message-seen/', UserSeenMessageController::class)->name('message.seen');
    Route::get('/users-seen/{message}', UserSeenListController::class)->name('message.users-seen');

    //Notification

    Route::get('/notifications', NotificationController::class)->name('my-notifications');
    Route::patch('/notifications/read', [NotificationController::class, 'markAsRead'])->name('notifications.markAsRead');
    Route::delete('/notifications/delete', [NotificationController::class, 'destroy'])->name('notifications.destroy');

    //TestingGround

    Route::post('/testing-ground', TestingGroundController::class)->name('testing-ground');
    Route::get('/testing-ground', TestingGroundController::class)->name('testing-ground-get');

     //Teamwork routes

    Route::prefix('teams')->namespace('Teamwork')->group(function () {
        Route::get('/', [TeamController::class, 'index'])->name('teams.index');
        Route::post('/', [TeamController::class, 'store'])->name('teams.store');
        Route::get('switch/{team?}', [TeamController::class, 'switchTeam'])->name('teams.switch');
        Route::get('accept/{token}', [AuthController::class, 'acceptInvite'])->name('teams.accept_invite');
        Route::get('deny/{token}', [AuthController::class, 'denyInvite'])->name('teams.deny_invite');
        Route::get('members/resend/{invite_id}', [TeamMemberController::class, 'resendInvite'])->name('teams.members.resend_invite');
        Route::delete('members/{team}/{user}', [TeamMemberController::class, 'destroy'])->name('teams.members.destroy');
        Route::middleware('can:teamOwner,team')->group(function () {
            Route::put('edit/{team}', [TeamController::class, 'update'])->name('teams.update');
            Route::delete('destroy/{team}', [TeamController::class, 'destroy'])->name('teams.destroy');
            Route::get('members/{team}', [TeamMemberController::class, 'show'])->name('teams.members.show');
            Route::post('members/{team}', [TeamMemberController::class, 'invite'])->name('teams.members.invite');
        });
    });




    //Report
    Route::post('/report', ReportController::class)->name('report');


});




require __DIR__.'/auth.php';
