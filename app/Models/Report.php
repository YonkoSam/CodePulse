<?php

namespace App\Models;

use App\Enums\ReportReason;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Report extends Model
{

    protected $fillable = [
        'user_id',
        'reportable_type',
        'reportable_id',
        'reason',
        'additional_text'
    ];

    protected $casts = [
        'reason' => ReportReason::class,
    ];

    public function reportable(): MorphTo
    {
        return $this->morphTo();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }


}
