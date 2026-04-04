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
        if ($user->store && $user->store->status === "active") {
            return $next($request);
        }
        return response()->json([
            'status' => 403,
            'message' => 'Store not approved by admin yet'
        ]);
    }
}
