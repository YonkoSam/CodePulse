<?php

namespace App\Http\utils;

use App\Enums\ReportReason;
use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Validation\Rule;

class ReportController extends Controller{
    public function __invoke()
    {
        request()->validate([
            'reason' => ['required',Rule::enum(ReportReason::class)],
            'additional_text' => 'nullable|string|max:255',
        ]);

        Report::create([
            'user_id' => auth()->id(),
            'reportable_type' => request()->reportable_type,
            'reportable_id' => request()->reportable_id,
            'reason' => request()->reason,
            'additional_text' => request()->additional_text,
        ]);

        return response()->json(['status'=>'Report submitted successfully!']);

    }
}
