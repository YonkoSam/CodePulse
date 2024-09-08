<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Social extends Model
{

    protected $fillable = [
        'profile_id',
        'facebook' ,
        'twitter' ,
        'instagram' ,
        'linkedin' ,
        'youtube',
        'github'];

    protected $hidden = [
        'profile_id',
        'created_at',
        'updated_at',
    ];
}
