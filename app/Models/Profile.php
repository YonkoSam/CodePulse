<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'cover',
        'company',
        'website',
        'country',
        'location',
        'status',
        'skills',
        'bio',
    ];

    public function isFriend(User $user): bool
    {

        return $this->user->friends()->where('friend_id', $user->id)->exists() ||
            $this->user->friendOf()->where('user_id', $user->id)->exists();
    }

    public function isBlocked(User $user): bool
    {
        $friendship = Friendship::where('user_id', $this->user->id)
            ->where('friend_id', $user->id)
            ->orWhere('user_id', $user->id)
            ->where('friend_id', $this->user->id)
            ->first();

        if ($friendship) {
            return $friendship->blocked;
        }

        return false;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function experiences(): HasMany
    {
        return $this->hasMany(Experience::class);
    }

    public function educations(): HasMany
    {
        return $this->hasMany(Education::class);
    }

    public function socials(): HasOne
    {
        return $this->hasOne(Social::class);
    }
}
