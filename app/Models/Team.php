<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\Config;
use Lukeraymonddowning\SelfHealingUrls\Concerns\HasSelfHealingUrls;
use Mpociot\Teamwork\Traits\TeamworkTeamTrait;

class Team extends Model
{
    use HasSelfHealingUrls,TeamworkTeamTrait;

    public $timestamps = false;

    protected string $slug = 'name';

    protected $table;

    /**
     * @var array
     */
    protected $fillable = ['name', 'owner_id', 'last_message_timestamp'];

    /**
     * Creates a new instance of the model.
     */
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->table = Config::get('teamwork.teams_table');
    }

    public function reports(): MorphMany
    {
        return $this->morphMany(Report::class, 'reportable');
    }

    public function unreadMessages(User $user)
    {
        return $this->hasMany(Message::class, 'team_id')
            ->visibleToUser($user->id)
            ->visibleSinceJoined($this->id, $user->id)
            ->where('sender_id', '!=', $user->id)
            ->whereDoesntHave('usersSeen', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            });
    }

    public function updateLastMessageTimestamp(): void
    {
        $this->update(['last_message_timestamp' => now()]);
    }
}
