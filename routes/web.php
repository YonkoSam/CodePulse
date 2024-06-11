<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\EducationController;
use App\Http\Controllers\ExperienceController;
use App\Http\Controllers\FriendController;
use App\Http\Controllers\FriendRequestController;
use App\Http\Controllers\isTypingController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProfilesController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::middleware('auth')->group(function () {

    //Profiles
    Route::get('/profiles/{profile}', [ProfilesController::class, 'show'])
        ->middleware(['auth', 'verified'])->name('profiles.show');
    Route::get('/home/', [ProfilesController::class, 'me'])
        ->middleware(['auth', 'verified'])->name('home');
    Route::get('/create-profile', [ProfilesController::class, 'create'])->name('profiles-create');
    Route::get('/update-profile', [ProfilesController::class, 'edit'])->name('profiles.edit');
    Route::get('/profiles', [UserController::class, 'index'])->name('profiles.index');
    Route::post('/profiles', [ProfilesController::class, 'store'])->name('profiles.store');
    Route::post('/profiles/experience', [ExperienceController::class, 'store'])->name('experience.store');
    Route::post('/profiles/education', [EducationController::class, 'store'])->name('education.store');
    Route::patch('/profiles/experience/{experience}', [ExperienceController::class, 'update'])->name('experience.update');
    Route::patch('/profiles/education/{education}', [EducationController::class, 'update'])->name('education.update');
    Route::delete('/profiles/experience/{experience}', [ExperienceController::class, 'destroy'])->name('experience.destroy');
    Route::delete('/profiles/education/{education}', [EducationController::class, 'destroy'])->name('education.destroy');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    //Posts
    Route::get('/posts', [PostController::class, 'index'])->name('posts.index');
    Route::get('/posts/create', [PostController::class, 'create'])->name('posts.create');
    Route::post('/posts/create', [PostController::class, 'store'])->name('posts.store');
    Route::get('/posts/{post}', [PostController::class, 'show'])->name('posts.show');
    Route::post('/posts', [LikeController::class, 'store'])->name('like.store');
    Route::post('/posts/comment', [CommentController::class, 'store'])->name('comment.store');
    Route::delete('/posts/comment/{comment}', [CommentController::class, 'destroy'])->name('comment.destroy');

    //Friends
    Route::get('/friends', [FriendController::class, 'index'])->name('friends.index');
    Route::post('/friend-request/send', [FriendRequestController::class, 'sendRequest'])->name('friend.request.send');
    Route::post('/friend-request/accept', [FriendRequestController::class, 'acceptRequest'])->name('friend.request.accept');
    Route::post('/friend-request/reject', [FriendRequestController::class, 'rejectRequest'])->name('friend.request.reject');
    Route::post('/notifications/read', [FriendRequestController::class, 'markAsRead'])->name('notifications.markAsRead');
    Route::post('/notifications/delete', [FriendRequestController::class, 'deleteNotification'])->name('notifications.delete');
    Route::delete('/friend/delete/{friend}', [FriendController::class, 'destroy'])->name('friend.delete');

    //Chat

    Route::post('/chat', [ChatController::class, 'store'])->name('chat.store');
    Route::get('/my-messages/{receiverId}', [ChatController::class, 'index'])->name('chatWithId.index');
    Route::get('/my-messages', [ChatController::class, 'index'])->name('chat.index');
    Route::post('/is-typing', isTypingController::class)->name('is-typing');

});

require __DIR__.'/auth.php';
