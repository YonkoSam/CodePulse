<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Lukeraymonddowning\SelfHealingUrls\Concerns\HasSelfHealingUrls;

class Profile extends Model
{
    use HasFactory;
    use HasSelfHealingUrls;

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



    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reports(): MorphMany
    {
        return $this->morphMany(Report::class, 'reportable');
    }

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
                })
            ;
        });
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
