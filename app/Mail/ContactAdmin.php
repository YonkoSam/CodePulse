<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactAdmin extends Mailable
{
    use Queueable, SerializesModels;

    public $userEmail;
    public $userMessage;

    public function __construct($email, $message)
    {
        $this->userEmail = $email;
        $this->userMessage = $message;
    }

    public function build()
    {
        return $this->view('emails.contact-admin')
                    ->subject('Suspended User Contact');
    }
}
