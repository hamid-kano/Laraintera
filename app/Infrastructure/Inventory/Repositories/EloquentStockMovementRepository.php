<?php

namespace App\Infrastructure\Inventory\Repositories;

use App\Domain\Inventory\DTOs\StockMovementDTO;
use App\Domain\Inventory\Repositories\StockMovementRepositoryInterface;
use App\Infrastructure\Inventory\Models\StockMovement;

class EloquentStockMovementRepository implements StockMovementRepositoryInterface
{
    public function record(StockMovementDTO $dto, int $stockBefore, int $stockAfter): StockMovement
    {
        return StockMovement::create([
            'product_id'     => $dto->productId,
            'quantity'       => $dto->quantity,
            'type'           => $dto->type,
            'reason'         => $dto->reason,
            'notes'          => $dto->notes,
            'warehouse_id'   => $dto->warehouseId,
            'reference_id'   => $dto->referenceId,
            'reference_type' => $dto->referenceType,
            'stock_before'   => $stockBefore,
            'stock_after'    => $stockAfter,
            'created_by'     => auth()->id(),
        ]);
    }

    public function getProductHistory(int $productId, int $perPage = 20): array
    {
        return StockMovement::where('product_id', $productId)
            ->with('product')
            ->latest()
            ->paginate($perPage)
            ->toArray();
    }

    public function getMovementsByType(string $type, ?int $productId = null): array
    {
        return StockMovement::query()
            ->where('type', $type)
            ->when($productId, fn($q) => $q->where('product_id', $productId))
            ->with('product')
            ->latest()
            ->get()
            ->toArray();
    }
}
