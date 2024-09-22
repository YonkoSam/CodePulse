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

class Pulse extends Model
{
    use HasFactory, HasSelfHealingUrls,VisibleToUser;

    protected string $slug = 'title';

    protected $fillable = ['user_id', 'text', 'title', 'code', 'team_id', 'is_answered'];

    protected $casts = [
        'code' => 'array',
    ];

    public function bestAnswer(): HasOne
    {
        return $this->hasOne(Comment::class)->where('is_best_answer', true);
    }

    public function markAsAnswered(): void
    {
        $this->is_answered = true;
        $this->save();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function reports(): MorphMany
    {
        return $this->morphMany(Report::class, 'reportable');
    }

    public function likes(): HasMany
    {
        return $this->hasMany(Like::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }
}
