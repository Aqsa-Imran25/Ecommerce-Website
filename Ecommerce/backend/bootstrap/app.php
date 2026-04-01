<?php

use Illuminate\Http\Middleware\HandleCors;
use App\Http\Middleware\CheckAdmin;
use App\Http\Middleware\CheckProfileComplete;
use App\Http\Middleware\CheckUser;
use App\Http\Middleware\CheckUserVendor;
use App\Http\Middleware\CheckVendor;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // 👉 This line ensures CORS headers are added to all API responses
        $middleware->prepend(HandleCors::class);

        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);

        $middleware->alias([
            'verified' => \App\Http\Middleware\EnsureEmailIsVerified::class,
            'checkAdminRole' => CheckAdmin::class,
            'checkUserRole' => CheckUser::class,
            'checkVendorRole' => CheckVendor::class,
            'checkProfile' => CheckProfileComplete::class,
            'CheckUserVendor' => CheckUserVendor::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })
    ->create();
