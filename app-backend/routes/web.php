<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name' => 'Ahmed Albabli API',
        'endpoints' => [
            'profile' => url('/api/profile'),
            'projects' => url('/api/projects'),
            'admin_login' => url('/api/admin/login'),
        ],
    ])->header('Access-Control-Allow-Origin', '*');
});

Route::post('/api/admin/login', function (Request $request) {
    $data = $request->validate([
        'password' => ['required', 'string'],
    ]);

    if (! hash_equals((string) env('ADMIN_PASSWORD', 'admin123'), $data['password'])) {
        return response()
            ->json(['message' => 'Invalid admin password.'], 422)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    }

    return response()
        ->json([
            'role' => 'admin',
            'token' => env('ADMIN_TOKEN', 'admin-local-token'),
        ])
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
});

Route::middleware('admin')->get('/api/admin/me', fn () => response()
    ->json(['role' => 'admin'])
    ->header('Access-Control-Allow-Origin', '*')
    ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With'));

Route::get('/api/profile', [ProfileController::class, 'show']);
Route::get('/api/projects', [ProjectController::class, 'index']);
Route::get('/api/projects/{project:slug}', [ProjectController::class, 'show']);

Route::middleware('admin')->group(function () {
    Route::get('/api/admin/projects', [ProjectController::class, 'adminIndex']);
    Route::put('/api/profile', [ProfileController::class, 'update']);
    Route::post('/api/projects', [ProjectController::class, 'store']);
    Route::put('/api/projects/{project:slug}', [ProjectController::class, 'update']);
    Route::patch('/api/projects/{project:slug}', [ProjectController::class, 'update']);
    Route::delete('/api/projects/{project:slug}', [ProjectController::class, 'destroy']);
});

Route::options('/api/{any}', function () {
    return response('', 204)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
})->where('any', '.*');
