<?php

namespace App\Listeners;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Notifications\Events\NotificationSent;

class NotificationSentListener{

    public function handle(NotificationSent $event): void
    {

        if ($event->response instanceof DatabaseNotification) {
            event(new \App\Events\NotificationSent($event->response));
        }
    }
}
