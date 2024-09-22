<?php

namespace App\Models;

use App\Traits\VisibleToUser;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Lukeraymonddowning\SelfHealingUrls\Concerns\HasSelfHealingUrls;

class Profile extends Model
{
    use HasFactory,HasSelfHealingUrls,VisibleToUser;

    protected string $slug = 'userName';

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
        'has_completed_profile',
    ];

    public function getUserNameAttribute(): string
    {
        return $this->user->name;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reports(): MorphMany
    {
        return $this->morphMany(Report::class, 'reportable');
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
