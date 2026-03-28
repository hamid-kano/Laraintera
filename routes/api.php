<?php

use App\Http\Controllers\Api\ApiController;
use Illuminate\Support\Facades\Route;

// ── Public ────────────────────────────────────────────
Route::get('/products',           [ApiController::class, 'products']);
Route::get('/products/{product}', [ApiController::class, 'product']);

// ── Token Auth ────────────────────────────────────────
Route::middleware('throttle:login')->group(function () {
    Route::post('/login', [ApiController::class, 'login']);
});

// ── Protected ─────────────────────────────────────────
Route::middleware(['auth:sanctum,web', 'throttle:api'])->group(function () {
    Route::post('/logout', [ApiController::class, 'logout']);
    Route::get('/me',      [ApiController::class, 'me']);

    Route::middleware('throttle:cart')->group(function () {
        Route::get('/cart',               [ApiController::class, 'cart']);
        Route::post('/cart/{product}',    [ApiController::class, 'addToCart']);
        Route::delete('/cart/{cartItem}', [ApiController::class, 'removeFromCart']);
    });

    Route::get('/orders',           [ApiController::class, 'orders']);
    Route::post('/orders/checkout', [ApiController::class, 'checkout']);
});
