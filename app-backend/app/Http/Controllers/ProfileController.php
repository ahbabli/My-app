<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class ProfileController extends Controller
{
    public function show(): JsonResponse
    {
        return $this->corsResponse($this->profilePayload());
    }

    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'handle' => ['required', 'string', 'max:255'],
            'role' => ['required', 'string', 'max:255'],
            'bio' => ['required', 'string', 'max:1000'],
            'contactHref' => ['required', 'string', 'max:255'],
            'cvHref' => ['required', 'string', 'max:255'],
            'socialHref' => ['required', 'string', 'max:255'],
            'skills' => ['required', 'array'],
            'skills.*.label' => ['required', 'string', 'max:255'],
            'skills.*.icon' => ['required', 'string', 'max:255'],
            'skills.*.iconClass' => ['required', 'string', 'max:255'],
        ]);

        Profile::query()->updateOrCreate(
            ['id' => 1],
            [
                'name' => $data['name'],
                'handle' => $data['handle'],
                'role' => $data['role'],
                'bio' => $data['bio'],
                'contact_href' => $data['contactHref'],
                'cv_href' => $data['cvHref'],
                'social_href' => $data['socialHref'],
                'skills' => $data['skills'],
            ],
        );

        return $this->corsResponse($this->profilePayload());
    }

    private function profilePayload(): array
    {
        $profile = Profile::query()->first() ?? Profile::fallback();

        return [
            'name' => $profile->name,
            'handle' => $profile->handle,
            'role' => $profile->role,
            'bio' => $profile->bio,
            'contactHref' => $profile->contact_href,
            'cvHref' => $profile->cv_href,
            'socialHref' => $profile->social_href,
            'stats' => [
                ['value' => (string) (Schema::hasTable('projects') ? Project::query()->count() : 0), 'label' => 'Projects'],
                ['value' => (string) count($profile->skills ?? []), 'label' => 'Skills'],
                ['value' => '4', 'label' => 'Years exp'],
            ],
            'skills' => $profile->skills ?? [],
        ];
    }

    private function corsResponse(mixed $data): JsonResponse
    {
        return response()
            ->json($data)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    }
}
