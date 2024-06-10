<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Education extends Model
{

protected $table = 'educations';
    protected $fillable = [
        'profile_id',
        'school',
        'degree',
        'fieldofstudy',
        'from',
        'to',
        'current',
    ];

    public function profile(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Profile::class);
    }
}
