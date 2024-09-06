<?php


namespace App\Enums;

enum ReportReason: int
{
    case InappropriateContent = 1;
    case Spam = 2;
    case Harassment = 3;
    case Other = 4;


}
