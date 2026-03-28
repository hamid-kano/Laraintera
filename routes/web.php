<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'    => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

// 📌 route لتغيير اللغة — يحفظ في Cookie (أفضل من Session)
Route::post('/locale', function () {
    $locale = request('locale');
    abort_if(! in_array($locale, ['ar', 'en']), 422);
    return response()->json(['locale' => $locale])
        ->cookie('locale', $locale, 60 * 24 * 365, '/', null, false, false);
})->name('locale.set');

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // 🛒 متجر — محمي بالمصادقة
    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::get('/products/{product}', [ProductController::class, 'show'])->name('products.show');

    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/{product}', [CartController::class, 'add'])->name('cart.add');
    Route::delete('/cart/{cartItem}', [CartController::class, 'remove'])->name('cart.remove');
    Route::patch('/cart/{cartItem}', [CartController::class, 'update'])->name('cart.update');

    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::post('/orders/checkout', [OrderController::class, 'checkout'])->name('orders.checkout');

    // 🔌 API Explorer
    Route::get('/api-explorer', fn() => Inertia::render('Api/Explorer'))->name('api.explorer');
});

require __DIR__.'/auth.php';
