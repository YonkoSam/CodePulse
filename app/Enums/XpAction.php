<?php
namespace App\Enums;

enum XpAction: int
{
    case COMPLETE_PROFILE = 1000;
    case CREATE_PULSE = 100;
    case RECEIVE_LIKE_ON_PULSE = 25;
    case RECEIVE_COMMENT = 50;
    case BE_CHOSEN_BEST_ANSWER = 750;
    case RECEIVE_LIKE_ON_COMMENT = 40;

    public static function toArray(): array
    {
        return array_column(self::cases(), 'value', 'name');
    }


}
