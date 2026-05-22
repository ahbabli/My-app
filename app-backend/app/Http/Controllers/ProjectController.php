<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    public function index(): JsonResponse
    {
        $projects = Project::query()
            ->where('is_hidden', false)
            ->orderBy('sort_order')
            ->orderByDesc('year')
            ->get();

        return $this->corsResponse($projects);
    }

    public function adminIndex(): JsonResponse
    {
        $projects = Project::query()
            ->orderBy('sort_order')
            ->orderByDesc('year')
            ->get();

        return $this->corsResponse($projects);
    }

    public function show(Request $request, Project $project): JsonResponse
    {
        if ($project->is_hidden && ! $this->isAdminRequest($request)) {
            abort(404);
        }

        return $this->corsResponse($project);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validatedData($request);
        $data['slug'] ??= Str::slug($data['title']);

        $project = Project::query()->create($data);

        return $this->corsResponse($project)->setStatusCode(201);
    }

    public function update(Request $request, Project $project): JsonResponse
    {
        $data = $this->validatedData($request, $project);

        if (array_key_exists('title', $data) && ! array_key_exists('slug', $data)) {
            $data['slug'] = Str::slug($data['title']);
        }

        $project->update($data);

        return $this->corsResponse($project->fresh());
    }

    public function destroy(Project $project): JsonResponse
    {
        $project->delete();

        return $this->corsResponse(['deleted' => true]);
    }

    private function validatedData(Request $request, ?Project $project = null): array
    {
        $projectId = $project?->id ?? 'NULL';

        return $request->validate([
            'title' => [$project ? 'sometimes' : 'required', 'string', 'max:255'],
            'slug' => ['sometimes', 'string', 'max:255', "unique:projects,slug,{$projectId}"],
            'category' => [$project ? 'sometimes' : 'required', 'string', 'max:255'],
            'excerpt' => [$project ? 'sometimes' : 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image_url' => ['nullable', 'string', 'max:255'],
            'year' => [$project ? 'sometimes' : 'required', 'integer', 'between:2000,2100'],
            'status' => ['sometimes', 'string', 'max:255'],
            'tags' => [$project ? 'sometimes' : 'required', 'array'],
            'tags.*' => ['string', 'max:255'],
            'links' => ['nullable', 'array'],
            'links.*.label' => ['required_with:links', 'string', 'max:255'],
            'links.*.url' => ['required_with:links', 'string', 'max:255'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
            'is_featured' => ['sometimes', 'boolean'],
            'is_hidden' => ['sometimes', 'boolean'],
            'is_favorite' => ['sometimes', 'boolean'],
        ]);
    }

    private function isAdminRequest(Request $request): bool
    {
        $token = $request->bearerToken();

        return $token && hash_equals((string) env('ADMIN_TOKEN', 'admin-local-token'), $token);
    }

    private function corsResponse(mixed $data): JsonResponse
    {
        return response()
            ->json($data)
            ->header('Access-Control-Allow-Origin', '*');
    }
}
