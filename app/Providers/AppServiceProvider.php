<?php

namespace App\Providers;

use App\Models\Message;
use App\Observers\MessageObserver;
use App\Services\GroqService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(GroqService::class, function ($app) {
            return new GroqService();
        });

    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Model::preventLazyLoading();
        Message::observe(MessageObserver::class);

    }
}
