<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $projects = [
            [
                'title' => 'Mobile Banking Dashboard',
                'slug' => 'mobile-banking-dashboard',
                'category' => 'UI UX',
                'excerpt' => 'A clean finance app concept with account insights, transfer flows, and card controls.',
                'description' => 'Designed a mobile banking experience focused on fast account scanning, simple transfers, and trustworthy visual hierarchy.',
                'image_url' => null,
                'year' => 2026,
                'status' => 'Published',
                'tags' => ['Figma', 'Mobile App', 'Design System'],
                'links' => [
                    ['label' => 'Case Study', 'url' => '#'],
                ],
                'sort_order' => 1,
                'is_featured' => true,
                'is_hidden' => false,
                'is_favorite' => true,
            ],
            [
                'title' => 'SaaS Analytics Landing Page',
                'slug' => 'saas-analytics-landing-page',
                'category' => 'Development',
                'excerpt' => 'A responsive marketing page for an analytics product with reusable React sections.',
                'description' => 'Built a polished landing page with conversion-focused sections, responsive layouts, and production-ready components.',
                'image_url' => null,
                'year' => 2025,
                'status' => 'Published',
                'tags' => ['React', 'Tailwind CSS', 'Vite'],
                'links' => [
                    ['label' => 'Live Demo', 'url' => '#'],
                    ['label' => 'Source', 'url' => '#'],
                ],
                'sort_order' => 2,
                'is_featured' => false,
                'is_hidden' => false,
                'is_favorite' => false,
            ],
            [
                'title' => 'Brand Identity Kit',
                'slug' => 'brand-identity-kit',
                'category' => 'Graphic design',
                'excerpt' => 'Logo, palette, typography, and launch visuals for a digital product brand.',
                'description' => 'Created a compact identity system that works across app interfaces, pitch decks, and social launch assets.',
                'image_url' => null,
                'year' => 2025,
                'status' => 'Published',
                'tags' => ['Branding', 'Logo', 'Social Assets'],
                'links' => [
                    ['label' => 'Preview', 'url' => '#'],
                ],
                'sort_order' => 3,
                'is_featured' => false,
                'is_hidden' => false,
                'is_favorite' => false,
            ],
        ];

        foreach ($projects as $project) {
            Project::query()->updateOrCreate(
                ['slug' => $project['slug']],
                $project,
            );
        }
    }
}
