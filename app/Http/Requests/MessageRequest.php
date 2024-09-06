<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MessageRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'receiver_id' => ['nullable', 'required_without:team_id', 'prohibits:team_id'],
            'team_id' => ['nullable', 'required_without:receiver_id', 'prohibits:receiver_id'],
            'message' => ['required_without_all:audioBlob,image'],
            'audioBlob' => ['nullable', 'mimes:webm'],
            'image' => ['nullable', 'image'],
        ];
    }

    public function messages(): array
    {
        return [
            'receiver_id.required_without' => 'please choose the user to send a message.',
            'receiver_id.prohibits' => 'You cannot specify both a receiver and a team.',
            'team_id.required_without' => 'please choose the team to send a message.',
            'team_id.prohibits' => 'You cannot specify both a receiver and a team.',
            'message.required_without_all' => 'A message, code, audio, or image is required.',
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
