<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckVendor
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'status' => 401,
                'message' => 'Unauthenticated'
            ]);
        }

        if (!$user->hasAnyRole(['vendor', 'admin'])) {
            return response()->json([
                'status' => 403,
                'message' => 'Access Denied'
            ]);
        }

        return $next($request);
    }
}