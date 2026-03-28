<?php

use App\Application\Inventory\Controllers\InventoryController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:admin'])->prefix('inventory')->name('inventory.')->group(function () {

    // Pages
    Route::get('/',          [InventoryController::class, 'index'])->name('index');
    Route::get('/{id}',      [InventoryController::class, 'show'])->name('show');

    // Actions
    Route::post('/',                        [InventoryController::class, 'store'])->name('store');
    Route::post('/{id}/receive',            [InventoryController::class, 'receiveStock'])->name('receive');
    Route::post('/{id}/deduct',             [InventoryController::class, 'deductStock'])->name('deduct');
    Route::post('/{id}/adjust',             [InventoryController::class, 'adjustStock'])->name('adjust');
    Route::get('/reports/low-stock',        [InventoryController::class, 'lowStock'])->name('low-stock');
    Route::get('/{id}/history',             [InventoryController::class, 'history'])->name('history');
});
