<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\EducationController;
use App\Http\Controllers\ExperienceController;
use App\Http\Controllers\FriendController;
use App\Http\Controllers\FriendRequestController;
use App\Http\Controllers\isTypingController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProfilesController;
use App\Http\Controllers\PulseController;
use App\Http\Controllers\ReplyController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\TestingGroundController;
use App\Http\Controllers\UploadProfileCoverController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('welcome');


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

    //Pulses

    Route::get('/pulses/', [PulseController::class, 'index'])->name('pulses.index');
    Route::get('/pulses/{pulse}', [PulseController::class, 'show'])->name('pulses.show')->middleware('can:view,pulse');

    Route::get('tags/{tag}', [PulseController::class, 'tags'])->name('pulses.tags');
    Route::get('/pulses/create', [PulseController::class, 'create'])->name('pulses.create');
    Route::Post('/pulses/create', [PulseController::class, 'store'])->name('pulses.store');
    Route::get('/pulses/edit/{pulse}', [PulseController::class, 'edit'])->name('pulses.edit')->middleware('can:edit,pulse');
    Route::patch('/pulses/edit/{pulse}', [PulseController::class, 'update'])->name('pulses.update')->middleware('can:edit,pulse');
    Route::Post('/pulses', [LikeController::class, 'store'])->name('like.store');
    Route::Post('/pulses/comment', [CommentController::class, 'store'])->name('comment.store');
    Route::Post('/pulses/comment/reply', ReplyController::class)->name('reply');
    Route::delete('/pulses/comment/{comment}', [CommentController::class, 'destroy'])->name('comment.destroy');

    //Friends

    Route::get('/code-mates', [FriendController::class, 'index'])->name('friends.index');
    Route::Post('/friend-request/send', [FriendRequestController::class, 'sendRequest'])->name('friend.request.send');
    Route::Post('/friend-request/accept', [FriendRequestController::class, 'acceptRequest'])->name('friend.request.accept');
    Route::Post('/friend-request/reject', [FriendRequestController::class, 'rejectRequest'])->name('friend.request.reject');
    Route::delete('/friend/delete/{friend}', [FriendController::class, 'destroy'])->name('friend.delete');
    Route::delete('/friend/block/{friend}', [FriendController::class, 'block'])->name('friend.block');
    Route::patch('/friend/unblock/{friend}', [FriendController::class, 'unblock'])->name('friend.unblock');

    //Chat

    Route::Post('/chat', [ChatController::class, 'store'])->name('chat.store');
    Route::get('/chat/', [ChatController::class, 'index'])->name('chat.index');
    Route::get('/chat/user/{receiverId?}', [ChatController::class, 'userChat'])->name('chat.user');
    Route::get('/chat/team/{teamId}', [ChatController::class, 'teamChat'])->name('chat.team');
    Route::Post('/is-typing', isTypingController::class)->name('is-typing');
    Route::get('/my-chat/{receiverId}', [ChatController::class, 'show'])->name('chat.show');
    Route::delete('/message/{message}', [ChatController::class, 'destroy'])->name('message.destroy');

    //Notification

    Route::get('/notifications', NotificationController::class)->name('my-notifications');
    Route::patch('/notifications/read', [NotificationController::class, 'markAsRead'])->name('notifications.markAsRead');
    Route::delete('/notifications/delete', [NotificationController::class, 'destroy'])->name('notifications.destroy');

    //TestingGround

    Route::post('/testing-ground', TestingGroundController::class)->name('testing-ground');
    Route::get('/testing-ground', TestingGroundController::class)->name('testing-ground');

     //Teamwork routes

    Route::group(['prefix' => 'teams', 'namespace' => 'Teamwork'], function () {
        Route::get('/', [App\Http\Controllers\Teamwork\TeamController::class, 'index'])->name('teams.index');
        Route::post('teams', [App\Http\Controllers\Teamwork\TeamController::class, 'store'])->name('teams.store');
        Route::put('edit/{id}', [App\Http\Controllers\Teamwork\TeamController::class, 'update'])->name('teams.update');
        Route::delete('destroy/{id}', [App\Http\Controllers\Teamwork\TeamController::class, 'destroy'])->name('teams.destroy');
        Route::get('switch/{id}', [App\Http\Controllers\Teamwork\TeamController::class, 'switchTeam'])->name('teams.switch');
        Route::post('switch/{id?}', [App\Http\Controllers\Teamwork\TeamController::class, 'switchTeamApi'])->name('teams.api.switch');
        Route::get('members/{id}', [App\Http\Controllers\Teamwork\TeamMemberController::class, 'show'])->name('teams.members.show');
        Route::get('members/resend/{invite_id}', [App\Http\Controllers\Teamwork\TeamMemberController::class, 'resendInvite'])->name('teams.members.resend_invite');
        Route::post('members/{id}', [App\Http\Controllers\Teamwork\TeamMemberController::class, 'invite'])->name('teams.members.invite');
        Route::delete('members/{id}/{user_id}', [App\Http\Controllers\Teamwork\TeamMemberController::class, 'destroy'])->name('teams.members.destroy');
        Route::get('accept/{token}', [App\Http\Controllers\Teamwork\AuthController::class, 'acceptInvite'])->name('teams.accept_invite');
        Route::get('deny/{token}', [App\Http\Controllers\Teamwork\AuthController::class, 'denyInvite'])->name('teams.deny_invite');

    });

});




require __DIR__.'/auth.php';
