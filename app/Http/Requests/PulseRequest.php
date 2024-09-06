<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PulseRequest extends FormRequest{
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'min:1'],
            'text' => ['required', 'string', 'min:1'],
            'code' => ['nullable'],
            'team_id' => 'nullable',
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
