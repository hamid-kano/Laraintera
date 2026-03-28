<?php

use App\Http\Controllers\Api\ApiController;
use Illuminate\Support\Facades\Route;

// ── Public ────────────────────────────────────────────
// المنتجات متاحة للجميع
Route::get('/products',           [ApiController::class, 'products']);
Route::get('/products/{product}', [ApiController::class, 'product']);

// ── Token Auth (للـ Mobile / Third Party) ─────────────
// تسجيل دخول منفصل يعطي Token
Route::post('/login', [ApiController::class, 'login']);

// ── Protected — Session أو Token ─────────────────────
// 📌 'auth:sanctum,web' يقبل:
//    - Session Cookie (من Inertia login) ✅
//    - Bearer Token   (من API login)     ✅
Route::middleware('auth:sanctum,web')->group(function () {
    Route::post('/logout', [ApiController::class, 'logout']);
    Route::get('/me',      [ApiController::class, 'me']);

    Route::get('/cart',               [ApiController::class, 'cart']);
    Route::post('/cart/{product}',    [ApiController::class, 'addToCart']);
    Route::delete('/cart/{cartItem}', [ApiController::class, 'removeFromCart']);

    Route::get('/orders',             [ApiController::class, 'orders']);
    Route::post('/orders/checkout',   [ApiController::class, 'checkout']);
});
