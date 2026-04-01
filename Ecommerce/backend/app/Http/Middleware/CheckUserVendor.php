<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckUserVendor
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if ($user && $user->hasRole('user') || $user->hasRole('vendor')) {
            return $next($request);
        } else {
            return response()->json([
                'status' => 403,
                'message' => "Access Denied"
            ]);
        }
    }
}
