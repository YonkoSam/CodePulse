<?php
namespace App\Enums;

enum XpAction: int
{
    case CREATE_PULSE = 50;
    case RECEIVE_LIKE_ON_PULSE = 15;
    case RECEIVE_COMMENT = 20;
    case BE_CHOSEN_BEST_ANSWER = 500;
    case RECEIVE_LIKE_ON_COMMENT = 25;

    public static function toArray(): array
    {
        return array_column(self::cases(), 'value', 'name');
    }


}
