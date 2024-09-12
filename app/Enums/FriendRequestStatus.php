<?php


namespace App\Enums;

enum FriendRequestStatus: int
{
    case sent = 1;
    case received = 2;
}
