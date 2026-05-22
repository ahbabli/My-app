<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminAuth
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();
        $expectedToken = (string) env('ADMIN_TOKEN', 'admin-local-token');

        if (! $token || ! hash_equals($expectedToken, $token)) {
            return response()
                ->json(['message' => 'Admin access required.'], 401)
                ->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        }

        return $next($request);
    }
}
