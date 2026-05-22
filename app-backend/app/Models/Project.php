<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'category',
        'excerpt',
        'description',
        'image_url',
        'year',
        'status',
        'tags',
        'links',
        'sort_order',
        'is_featured',
        'is_hidden',
        'is_favorite',
    ];

    protected function casts(): array
    {
        return [
            'tags' => 'array',
            'links' => 'array',
            'is_featured' => 'boolean',
            'is_hidden' => 'boolean',
            'is_favorite' => 'boolean',
        ];
    }
}
