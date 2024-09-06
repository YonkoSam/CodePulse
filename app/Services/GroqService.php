<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use LucianoTonet\GroqPHP\Groq;
use LucianoTonet\GroqPHP\GroqException;

class GroqService
{
    protected Groq $groq;
    public function __construct()
    {
        $this->groq = new Groq();
    }

    public function queryGroq($prompt)
    {
        try {
            $response = $this->groq->chat()->completions()->create([
                'model' => 'llama3-8b-8192',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => "You are PulseBot, an AI assistant for the CodePulse platform. Respond to the following question with a clear, concise, and complete answer ,  use markdown and  if you have code snippet include the name of the language the code example ```JavaScript
console.log('It works!')``` . Since you only have one chance to reply, provide the best possible solution or general advice based on the information provided. Maintain a friendly and supportive tone, and avoid asking for clarification.",
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt
                    ]
                ],
            ]);
            return  $response['choices'][0]['message']['content'];
        } catch (GroqException $e) {
            Log::error('Error: ' . $e->getMessage());
            return null;
        }
    }
}
