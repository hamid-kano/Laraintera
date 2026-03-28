<?php

use App\Http\Controllers\Api\ApiController;
use Illuminate\Support\Facades\Route;

// ── Public ────────────────────────────────────────────
Route::post('/login',  [ApiController::class, 'login']);
Route::get('/products',         [ApiController::class, 'products']);
Route::get('/products/{product}', [ApiController::class, 'product']);

// ── Protected (Sanctum Token) ─────────────────────────
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [ApiController::class, 'logout']);
    Route::get('/me',      [ApiController::class, 'me']);

    Route::get('/cart',                    [ApiController::class, 'cart']);
    Route::post('/cart/{product}',         [ApiController::class, 'addToCart']);
    Route::delete('/cart/{cartItem}',      [ApiController::class, 'removeFromCart']);

    Route::get('/orders',                  [ApiController::class, 'orders']);
    Route::post('/orders/checkout',        [ApiController::class, 'checkout']);
});
