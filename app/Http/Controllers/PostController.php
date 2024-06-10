<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index()
    {
        return Inertia::render('Posts/index', ['posts' => Post::with('user', 'comments', 'likes')->latest()->paginate(6)]);
    }

    public function store()
    {
        $post = request()->validate([

            'title' => ['required', 'string', 'min:1'],
            'text' => ['required', 'string', 'min:1'],

        ]);

        $user = Auth::user();

        $post['user_id'] = $user->id;

        $profile = Post::create($post);

        return to_route('posts.index');

    }

    public function create()
    {
        return Inertia::render('Posts/create');
    }

    public function show(Post $post)
    {
        $post->load('user', 'comments.user', 'likes');

        return Inertia::render('Posts/show', ['post' => $post]);
    }
}
