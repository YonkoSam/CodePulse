<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Redis;
use Laravel\Sanctum\HasApiTokens;
use Mpociot\Teamwork\Traits\UserHasTeams;

class User extends Authenticatable
{
    use HasApiTokens,HasFactory, Notifiable,UserHasTeams;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'profile_image',
        'last_time_online',

    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'email',
        'remember_token',
        'email_verified_at',
        'created_at',
        'updated_at',
        'current_team_id',
        'last_time_online',
    ];


    public function scopeVisible($query, int  $userId)
    {
        return $query->whereNotIn('id', function ($query) use ($userId) {
            $query->select('friend_id')
                ->from('friendships')
                ->where('user_id', $userId)
                ->where('blocked', true)
                ->union(function ($query) use ($userId) {
                    $query->select('user_id')
                        ->from('friendships')
                        ->where('friend_id', $userId)
                        ->where('blocked', true);
                });
        });
    }

    public function isOnline(): bool|int|\Redis
    {

        return Redis::exists('user-online-'.$this->id);

    }

    public function lastTimeOnline(): ?string
    {
        if (Redis::exists('user-last-time-online-'.$this->id)) {
            return Redis::get('user-last-time-online-'.$this->id);
        }

        return $this->last_time_online;
    }

    public function unreadMessages(?User $friend = null): HasMany
    {
        if ($friend) {
            return $this->hasMany(Message::class, 'receiver_id')
                ->where('sender_id', $friend->id)
                ->where('seen_at', null);
        }

        return $this->hasMany(Message::class, 'receiver_id')
            ->where('seen_at', null);
    }

    public function allFriends()
    {
        $friendIds = $this->friends()->pluck('users.id')->merge($this->friendOf()->pluck('users.id'));

        return User::whereIn('id', $friendIds);
    }

    public function friends(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'friendships', 'user_id', 'friend_id')
            ->wherePivot('blocked', false)
            ->withTimestamps();
    }

    public function friendOf(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'friendships', 'friend_id', 'user_id')
            ->wherePivot('blocked', false)
            ->withTimestamps();
    }

    public function blockedUsers(): array
    {

        $blockedFriendShip = Friendship::where(['blocked_initiator' => $this->id, 'blocked' => '1'])->get();
        $blockedList = [];
        foreach ($blockedFriendShip as $friendShip) {
            if ($friendShip->user_id == $this->id) {
                $blockedList[] = User::find($friendShip->friend_id);
            }
            if ($friendShip->friend_id == $this->id) {
                $blockedList[] = User::find($friendShip->user_id);
            }
        }

        return $blockedList;

    }

    public function pulses(): HasMany
    {
        return $this->hasMany(Pulse::class);

    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);

    }

    public function sentMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function receivedMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }

    public function profile(): hasOne
    {
        return $this->hasOne(Profile::class);
    }

    public function sentFriendRequests(): HasMany
    {
        return $this->hasMany(FriendRequest::class, 'sender_id');
    }

    public function receivedFriendRequests(): HasMany
    {
        return $this->hasMany(FriendRequest::class, 'receiver_id');
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
