<?php

namespace Tests\Feature;

use Database\Seeders\ProjectSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_projects_can_be_listed(): void
    {
        $this->seed(ProjectSeeder::class);

        $response = $this->getJson('/api/projects');

        $response
            ->assertOk()
            ->assertJsonCount(3)
            ->assertJsonPath('0.slug', 'mobile-banking-dashboard');
    }

    public function test_hidden_projects_are_hidden_from_visitors_but_visible_to_admins(): void
    {
        $this->seed(ProjectSeeder::class);

        $this
            ->withHeader('Authorization', 'Bearer admin-local-token')
            ->patchJson('/api/projects/brand-identity-kit', ['is_hidden' => true])
            ->assertOk();

        $this->getJson('/api/projects')
            ->assertOk()
            ->assertJsonCount(2);

        $this
            ->withHeader('Authorization', 'Bearer admin-local-token')
            ->getJson('/api/admin/projects')
            ->assertOk()
            ->assertJsonCount(3)
            ->assertJsonPath('2.is_hidden', true);
    }

    public function test_project_can_be_found_by_slug(): void
    {
        $this->seed(ProjectSeeder::class);

        $response = $this->getJson('/api/projects/brand-identity-kit');

        $response
            ->assertOk()
            ->assertJsonPath('slug', 'brand-identity-kit')
            ->assertJsonPath('category', 'Graphic design');
    }

    public function test_project_can_be_created(): void
    {
        $response = $this
            ->withHeader('Authorization', 'Bearer admin-local-token')
            ->postJson('/api/projects', [
            'title' => 'Portfolio Case Study',
            'category' => 'UI UX',
            'excerpt' => 'A case study page for presenting design decisions and outcomes.',
            'year' => 2026,
            'tags' => ['Portfolio', 'Case Study'],
            'links' => [['label' => 'Preview', 'url' => '#']],
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('slug', 'portfolio-case-study');

        $this->assertDatabaseHas('projects', [
            'slug' => 'portfolio-case-study',
        ]);
    }

    public function test_visitors_cannot_create_projects(): void
    {
        $response = $this->postJson('/api/projects', [
            'title' => 'Blocked Project',
            'category' => 'UI UX',
            'excerpt' => 'This should not be stored without admin access.',
            'year' => 2026,
            'tags' => ['Blocked'],
        ]);

        $response->assertUnauthorized();
    }
}
