protected $routeMiddleware = [
    // ... other middlewares
    'check.suspension' => \App\Http\Middleware\CheckUserSuspension::class,
];
