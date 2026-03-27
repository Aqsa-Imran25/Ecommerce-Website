<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckProfileComplete
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        if (! auth()->check()) {
            return response()->json([
                'message' => "Unauthenticated",
            ], 401);
        }

        if (! auth()->user()->profile) {
            return response()->json([
                'message' => "Please fill your profile details first!",
            ], 403);
        }

        return $next($request);
    }
}
