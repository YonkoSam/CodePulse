<?php

namespace App\Enums;

enum MessageType: int
{
    case text = 1;
    case audio = 2;
    case image = 3;
    case code = 4;
    case video = 5;

}
