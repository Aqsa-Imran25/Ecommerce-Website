<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckStoreApproved
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json([
                'status' => 401,
                'message' => 'Unauthenticated'
            ]);
        }
        $active = $user->store()->where('status', 'active')->exists();

        if ($active) {

            return $next($request);
        }
        return response()->json([
            'status' => 403,
            'message' => 'Store not approved by admin yet'
        ]);
    }
}
