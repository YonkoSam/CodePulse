<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\EducationController;
use App\Http\Controllers\ExperienceController;
use App\Http\Controllers\FriendController;
use App\Http\Controllers\FriendRequestController;
use App\Http\Controllers\isTypingController;
use App\Http\Controllers\isUserBlockedController;
use App\Http\Controllers\LeaderBoardController;
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
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('welcome');

Route::middleware('auth')->group(function () {
    // Search routes
    Route::prefix('search')->group(function () {
        Route::get('/{query}', SearchController::class)->name('search');
    });
    // Profile routes
    Route::prefix('profiles')->group(function () {
        Route::get('/', [ProfilesController::class, 'index'])->name('profiles.index');
        Route::get('/create', [ProfilesController::class, 'create'])->name('profiles.create');
        Route::get('/update', [ProfilesController::class, 'edit'])->name('profiles.edit');
        Route::get('/{profile}', [ProfilesController::class, 'show'])->middleware(['auth', 'verified'])->can('view', 'profile')->name('profiles.show');
        Route::post('/', [ProfilesController::class, 'store'])->name('profiles.store');
        Route::post('/cover', UploadProfileCoverController::class)->name('cover.upload');
        Route::post('/experience', [ExperienceController::class, 'store'])->name('experience.store');
        Route::post('/education', [EducationController::class, 'store'])->name('education.store');
        Route::patch('/experience/{experience}', [ExperienceController::class, 'update'])->name('experience.update');
        Route::patch('/education/{education}', [EducationController::class, 'update'])->name('education.update');
        Route::delete('/experience/{experience}', [ExperienceController::class, 'destroy'])->name('experience.destroy');
        Route::delete('/education/{education}', [EducationController::class, 'destroy'])->name('education.destroy');
    });

    // Home route
    Route::get('/my-profile', [ProfilesController::class, 'show'])->middleware(['auth', 'verified'])->name('home');

    // User profile routes
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });
    // Pulse routes
    Route::prefix('pulses')->group(function () {
        Route::get('/', [PulseController::class, 'index'])->name('pulses.index');
        Route::get('/create', [PulseController::class, 'create'])->name('pulses.create');
        Route::post('/create', [PulseController::class, 'store'])->name('pulses.store');
        Route::get('/edit/{pulse}', [PulseController::class, 'edit'])->name('pulses.edit')->middleware('can:edit,pulse');
        Route::patch('/edit/{pulse}', [PulseController::class, 'update'])->name('pulses.update')->middleware('can:edit,pulse');
        Route::delete('/{pulse}', [PulseController::class, 'destroy'])->name('pulses.destroy')->middleware('can:delete,pulse');
        Route::post('/', [LikeController::class, 'store'])->name('like.store');
        Route::post('/comment', [CommentController::class, 'store'])->name('comment.store');
        Route::post('/comment/reply', ReplyController::class)->name('reply');
        Route::patch('/comment/{comment}', [CommentController::class, 'update'])->name('comment.update')->can('update', 'comment');
        Route::delete('/comment/{comment}', [CommentController::class, 'destroy'])->name('comment.destroy')->can('delete', 'comment');
        Route::put('/{pulse}/best-answer/{comment}', [CommentController::class, 'markBestAnswer'])->name('pulses.best-answer')->can('edit', 'pulse');
        Route::get('/{pulse}', [PulseController::class, 'show'])->name('pulses.show')->middleware('can:view,pulse');
        Route::get('/tags/{tag}', [PulseController::class, 'tags'])->name('pulses.tags');

    });

    // Friend routes
    Route::get('/code-mates', [FriendController::class, 'index'])->name('friends.index');
    Route::prefix('friend')->group(function () {
        Route::delete('/delete/{friend}', [FriendController::class, 'destroy'])->name('friend.delete');
        Route::delete('/block/{friend}', [FriendController::class, 'block'])->name('friend.block');
        Route::patch('/unblock/{friend}', [FriendController::class, 'unblock'])->name('friend.unblock');
        Route::get('/is-blocked/{id}', isUserBlockedController::class)->name('friend.is-blocked');
    });

    // Friend request routes
    Route::prefix('friend-request')->group(function () {
        Route::post('/send', [FriendRequestController::class, 'sendRequest'])->name('friend.request.send');
        Route::post('/accept', [FriendRequestController::class, 'acceptRequest'])->name('friend.request.accept');
        Route::post('/reject', [FriendRequestController::class, 'rejectRequest'])->name('friend.request.reject');
        Route::post('/cancel', [FriendRequestController::class, 'cancelRequest'])->name('friend.request.cancel');
    });

    // Chat routes
    Route::prefix('chat')->group(function () {
        Route::post('/', [ChatController::class, 'store'])->name('chat.store');
        Route::get('/', [ChatController::class, 'index'])->name('chat.index');
        Route::get('/user/{receiver}', [ChatController::class, 'userChat'])->name('chat.user');
        Route::get('/team/{team}', [ChatController::class, 'teamChat'])->name('chat.team')->can('teamMember', 'team');
        Route::get('/{receiver}', [ChatController::class, 'show'])->name('chat.show');
        Route::post('/is-typing', isTypingController::class)->name('is-typing');

    });

    Route::get('/test', function () {
        defer(function () {
            \Illuminate\Log\log('this is a test');
            sleep(4);
        });

        return 'test';

    });
    // Message routes
    Route::prefix('message')->group(function () {
        Route::delete('/{message}', [ChatController::class, 'destroy'])->name('message.destroy');
        Route::post('/seen', UserSeenMessageController::class)->name('message.seen');
        Route::get('/users-seen/{message}', UserSeenListController::class)->name('message.users-seen');
        Route::get('/unread-count', UnreadMessagesCountController::class)->name('message.unread-count');

    });

    // Notification routes
    Route::prefix('notifications')->group(function () {
        Route::get('/', NotificationController::class)->name('my-notifications');
        Route::patch('/read', [NotificationController::class, 'markAsRead'])->name('notifications.markAsRead');
        Route::delete('/delete', [NotificationController::class, 'destroy'])->name('notifications.destroy');
    });

    // Team routes
    Route::prefix('teams')->namespace('Teamwork')->group(function () {
        Route::get('/', [TeamController::class, 'index'])->name('teams.index');
        Route::post('/', [TeamController::class, 'store'])->name('teams.store');
        Route::get('switch/{team?}', [TeamController::class, 'switchTeam'])->name('teams.switch');
        Route::get('accept/{token}', [AuthController::class, 'acceptInvite'])->name('teams.accept_invite');
        Route::get('deny/{token}', [AuthController::class, 'denyInvite'])->name('teams.deny_invite');
        Route::get('members/resend/{invite_id}', [TeamMemberController::class, 'resendInvite'])->name('teams.members.resend_invite');
        Route::middleware('can:teamOwner,team')->group(function () {
            Route::get('members/{team}', [TeamMemberController::class, 'show'])->name('teams.members.show');
            Route::post('members/{team}', [TeamMemberController::class, 'invite'])->name('teams.members.invite');
            Route::put('edit/{team}', [TeamController::class, 'update'])->name('teams.update');
            Route::delete('destroy/{team}', [TeamController::class, 'destroy'])->name('teams.destroy');
            Route::delete('members/{team}/{user}', [TeamMemberController::class, 'destroy'])->name('teams.members.destroy');
        });

    });

    // Leaderboard route
    Route::get('/leader-board', LeaderBoardController::class)->name('leader-board');

    // Testing ground routes
    Route::prefix('testing-ground')->group(function () {
        Route::post('/', TestingGroundController::class)->name('testing-ground-with-code');
        Route::get('/', TestingGroundController::class)->name('testing-ground');
    });

    // Report route
    Route::post('/report', ReportController::class)->name('report');

});

require __DIR__.'/auth.php';
