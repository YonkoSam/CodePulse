<?php

namespace App\Services;


use ConsoleTVs\Profanity\Builder;

class ProfanityFilterService
{


    public function filterString($string): string
    {
        return Builder::blocker($string,languages: ['en'])->filter();
    }

    public function filter($data, array $fields)
    {
        foreach ($fields as $field) {
            if (isset($data[$field])) {
                if (is_array($data[$field])) {
                    $data[$field] = array_map(function ($item) {
                        return Builder::blocker($item,languages: ['en'])->filter();
                    }, $data[$field]);
                } elseif (is_string($data[$field])) {
                    $data[$field] = Builder::blocker($data[$field],languages: ['en'])->filter();
                }
            }
        }

        return $data;
    }


}
