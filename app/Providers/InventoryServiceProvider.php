<?php

namespace App\Providers;

use App\Domain\Inventory\Repositories\ProductRepositoryInterface;
use App\Domain\Inventory\Repositories\StockMovementRepositoryInterface;
use App\Domain\Inventory\Services\InventoryService;
use App\Infrastructure\Inventory\Repositories\EloquentProductRepository;
use App\Infrastructure\Inventory\Repositories\EloquentStockMovementRepository;
use Illuminate\Support\ServiceProvider;

// 📌 DDD: هنا يحدث السحر
// نخبر Laravel: "عندما يطلب أحد ProductRepositoryInterface
// أعطه EloquentProductRepository"
// هذا يسمى Dependency Injection + Dependency Inversion
class InventoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // ربط الـ Interfaces بـ Implementations
        $this->app->bind(
            ProductRepositoryInterface::class,
            EloquentProductRepository::class,
        );

        $this->app->bind(
            StockMovementRepositoryInterface::class,
            EloquentStockMovementRepository::class,
        );

        // InventoryService يُحقن تلقائياً بالـ Repositories
        $this->app->bind(InventoryService::class, function ($app) {
            return new InventoryService(
                products:  $app->make(ProductRepositoryInterface::class),
                movements: $app->make(StockMovementRepositoryInterface::class),
            );
        });
    }
}
