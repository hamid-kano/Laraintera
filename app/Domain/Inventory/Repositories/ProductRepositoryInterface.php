<?php

namespace App\Domain\Inventory\Repositories;

use App\Domain\Inventory\DTOs\CreateProductDTO;
use App\Infrastructure\Inventory\Models\InventoryProduct;
use Illuminate\Pagination\LengthAwarePaginator;

// 📌 DDD: الـ Domain يعرف فقط الـ Interface
// لا يعرف هل البيانات في MySQL أو MongoDB أو API خارجي
// هذا يسمى "Dependency Inversion Principle"
interface ProductRepositoryInterface
{
    public function findById(int $id): ?InventoryProduct;

    public function findBySku(string $sku): ?InventoryProduct;

    public function findAll(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function create(CreateProductDTO $dto): InventoryProduct;

    public function updateStock(int $productId, int $newStock): void;

    public function findLowStock(int $threshold = 10): array;

    public function existsBySku(string $sku): bool;
}
