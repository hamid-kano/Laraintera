<?php

namespace App\Providers;

use App\Models\CartItem;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        $this->configureRateLimiting();

        Inertia::share([
            'cartCount' => fn () => auth()->check()
                ? CartItem::where('user_id', auth()->id())->sum('quantity')
                : 0,
        ]);
    }

    private function configureRateLimiting(): void
    {
        // 📌 عام — 60 طلب في الدقيقة لكل مستخدم
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)
                ->by($request->user()?->id ?: $request->ip())
                ->response(fn() => response()->json([
                    'message' => __('api.rate_limit'),
                ], 429));
        });

        // 📌 تسجيل الدخول — 5 محاولات فقط في الدقيقة
        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(5)
                ->by($request->input('email') . '|' . $request->ip())
                ->response(fn() => response()->json([
                    'message' => __('api.too_many_attempts'),
                ], 429));
        });

        // 📌 السلة — 30 عملية في الدقيقة
        RateLimiter::for('cart', function (Request $request) {
            return Limit::perMinute(30)
                ->by($request->user()?->id ?: $request->ip());
        });
    }
}
