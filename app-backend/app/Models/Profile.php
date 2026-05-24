<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $fillable = [
        'name',
        'handle',
        'role',
        'bio',
        'contact_href',
        'cv_href',
        'social_href',
        'photo_url',
        'story_photo_url',
        'skills',
    ];

    protected function casts(): array
    {
        return [
            'skills' => 'array',
        ];
    }

    public static function fallback(): self
    {
        return new self([
            'name' => 'Ahmed Albabli',
            'handle' => '@ahbabli',
            'role' => 'Product Designer',
            'bio' => 'I design and prototype digital products from initial brand identity to high-fidelity code-ready interfaces.',
            'contact_href' => 'mailto:ahbabli77@gmail.com',
            'cv_href' => '/ahmed-albabli-cv.txt',
            'social_href' => '#projects',
            'photo_url' => '/assets/avatar.png',
            'story_photo_url' => '/assets/avatar.png',
            'skills' => [
                ['label' => 'UI UX', 'icon' => 'uiux-icon.svg', 'iconClass' => 'h-[45px] w-8'],
                ['label' => 'Development', 'icon' => 'dev-icon.svg', 'iconClass' => 'h-[43px] w-12'],
                ['label' => 'Graphic design', 'icon' => 'graphic-icon.svg', 'iconClass' => 'h-[78px] w-[78px]'],
            ],
        ]);
    }
}
