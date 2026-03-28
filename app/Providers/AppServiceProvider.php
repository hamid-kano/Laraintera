<?php

namespace App\Providers;

use App\Models\CartItem;
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

        // 📌 مفهوم Inertia: Shared Data — تُشارك مع كل صفحة تلقائياً
        // في React نصل إليها عبر: usePage().props.cartCount
        Inertia::share([
            'cartCount' => fn () => auth()->check()
                ? CartItem::where('user_id', auth()->id())->sum('quantity')
                : 0,
        ]);
    }
}
