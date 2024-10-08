<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\FriendRequestStatus;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Laravel\Sanctum\HasApiTokens;
use Lukeraymonddowning\SelfHealingUrls\Concerns\HasSelfHealingUrls;
use Mpociot\Teamwork\Traits\UserHasTeams;

class User extends Authenticatable implements FilamentUser
{
    use HasApiTokens,HasFactory, HasSelfHealingUrls,Notifiable,UserHasTeams;

    protected string $slug = 'name';

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
        'is_suspended',

    ];

    protected $appends = ['last_activity'];

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
        'is_suspended',
        'is_admin',
    ];

    public function canAccessPanel(Panel $panel): bool
    {
        return $this->is_admin;
    }

    /**
     * Get the suspension reason for the user.
     */
    public function suspensionReason(): string
    {
        if (! $this->is_suspended) {
            return '';
        }

        $suspensionReason = DB::table('suspension_reasons')
            ->where('user_id', $this->id)
            ->value('reason');

        return $suspensionReason ?? '';
    }

    /**
     * Add suspension reasons for the user.
     */
    public function addSuspensionReason(string $reason): void
    {
        DB::table('suspension_reasons')->insert([
            'user_id' => $this->id,
            'reason' => $reason,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function scopeVisible($query, int $userId)
    {
        return $query->where('id', '!=', $userId)
            ->where('is_suspended', false)
            ->whereNotIn('id', function ($subQuery) use ($userId) {
                $subQuery->select('friend_id')
                    ->from('friendships')
                    ->where('user_id', $userId)
                    ->where('blocked', true)
                    ->union(
                        $subQuery->newQuery()
                            ->select('user_id')
                            ->from('friendships')
                            ->where('friend_id', $userId)
                            ->where('blocked', true)
                    );
            });
    }

    public function isFriend(User $user): bool
    {

        return $this->friends()->where('friend_id', $user->id)->exists() ||
            $this->friendOf()->where('user_id', $user->id)->exists();

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

    public function getFriendRequest(): ?array
    {
        $request = FriendRequest::findRequest($this->id);

        if (! $request) {
            return null;
        }

        return ['requestId' => $request->id,
            'requestStatus' => $request->sender_id == $this->id ? FriendRequestStatus::received : FriendRequestStatus::sent];
    }

    public function sentFriendRequests(): HasMany
    {
        return $this->hasMany(FriendRequest::class, 'sender_id');
    }

    public function allFriends($sort = false): Builder
    {
        $userId = $this->id;

        $query = User::query()->where('is_suspended', false)->join('friendships', function ($join) use ($userId) {
            $join->on('users.id', '=', 'friendships.friend_id')
                ->where('friendships.user_id', '=', $userId)
                ->orOn('users.id', '=', 'friendships.user_id')
                ->where('friendships.friend_id', '=', $userId);
        }
        )
            ->where('friendships.blocked', false)
            ->select('users.*', 'friendships.last_message_timestamp');
        if ($sort) {
            $query->orderBy('friendships.last_message_timestamp', 'desc');
        }

        return $query;
    }

    public function isBlocked(int $userId): bool
    {
        $friendship = Friendship::where('user_id', $this->id)
            ->where('friend_id', $userId)
            ->orWhere('user_id', $userId)
            ->where('friend_id', $this->id)
            ->first();

        if ($friendship) {
            return $friendship->blocked;
        }

        return false;
    }

    public function isOnline(): bool|int|\Redis
    {

        return Redis::exists('user-online-'.$this->id);

    }

    public function getLastActivityAttribute(): ?string
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

    public function allMessagesWithFriend(int $friendId): Builder
    {
        return Message::query()->where(function ($query) use ($friendId) {
            $query->where('sender_id', $this->id)
                ->where('receiver_id', $friendId);
        })
            ->orWhere(function ($query) use ($friendId) {
                $query->where('sender_id', $friendId)
                    ->where('receiver_id', $this->id);
            });
    }

    public function allMessagesWithTeam($teamId): Builder
    {
        return Message::query()->where('team_id', $teamId)
            ->visibleSinceJoined($teamId, $this->id)
            ->visibleToUser($this->id);
    }

    public function profile(): hasOne
    {
        return $this->hasOne(Profile::class);
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
