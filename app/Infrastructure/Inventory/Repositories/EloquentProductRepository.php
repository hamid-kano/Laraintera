<?php

namespace App\Infrastructure\Inventory\Repositories;

use App\Domain\Inventory\DTOs\CreateProductDTO;
use App\Domain\Inventory\Repositories\ProductRepositoryInterface;
use App\Infrastructure\Inventory\Models\InventoryProduct;
use Illuminate\Pagination\LengthAwarePaginator;

// 📌 DDD: هذا الملف في Infrastructure — يعرف Eloquent
// الـ Domain لا يعرف هذا الملف موجود
class EloquentProductRepository implements ProductRepositoryInterface
{
    public function findById(int $id): ?InventoryProduct
    {
        return InventoryProduct::find($id);
    }

    public function findBySku(string $sku): ?InventoryProduct
    {
        return InventoryProduct::where('sku', $sku)->first();
    }

    public function findAll(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return InventoryProduct::query()
            ->when($filters['search']   ?? null, fn($q, $v) => $q->where('name', 'like', "%{$v}%")
                ->orWhere('sku', 'like', "%{$v}%"))
            ->when($filters['category'] ?? null, fn($q, $v) => $q->where('category', $v))
            ->when($filters['low_stock'] ?? false, fn($q) => $q->whereColumn('stock', '<=', 'reorder_point'))
            ->latest()
            ->paginate($perPage);
    }

    public function create(CreateProductDTO $dto): InventoryProduct
    {
        return InventoryProduct::create([
            'name'         => $dto->name,
            'description'  => $dto->description,
            'price'        => $dto->price,
            'cost'         => $dto->cost,
            'category'     => $dto->category,
            'sku'          => $dto->sku,
            'barcode'      => $dto->barcode,
            'image'        => $dto->image,
            'stock'        => $dto->initialStock,
            'reorder_point'=> $dto->reorderPoint,
        ]);
    }

    public function updateStock(int $productId, int $newStock): void
    {
        InventoryProduct::where('id', $productId)->update(['stock' => $newStock]);
    }

    public function findLowStock(int $threshold = 10): array
    {
        return InventoryProduct::whereColumn('stock', '<=', 'reorder_point')
            ->orderBy('stock')
            ->get()
            ->toArray();
    }

    public function existsBySku(string $sku): bool
    {
        return InventoryProduct::where('sku', $sku)->exists();
    }
}
