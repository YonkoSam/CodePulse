<?php

namespace App\Models;

    use Illuminate\Database\Eloquent\Model;
    use Illuminate\Database\Eloquent\Relations\MorphMany;
    use Illuminate\Support\Facades\Config;
    use Mpociot\Teamwork\Traits\TeamworkTeamTrait;

    class Team extends Model {

        use TeamworkTeamTrait;

        public $timestamps = false;
        protected $table;

        /**
         * @var array
         */
        protected $fillable = ['name', 'owner_id','last_message_timestamp'];

        /**
         * Creates a new instance of the model.
         *
         * @param array $attributes
         */
        public function __construct(array $attributes = [])
        {
            parent::__construct($attributes);
            $this->table = Config::get('teamwork.teams_table');
        }

        public function reports(): morphMany
        {
            return $this->morphMany(Report::class, 'team');
        }
        public function unreadMessages(User $user)
        {
            return $this->hasMany(Message::class, 'team_id')
                ->visibleToUser($user->id)
                ->visibleSinceJoined($this->id,$user->id)
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
