<?php

namespace App\Domain\Inventory\Repositories;

use App\Domain\Inventory\DTOs\StockMovementDTO;
use App\Infrastructure\Inventory\Models\StockMovement;

interface StockMovementRepositoryInterface
{
    public function record(StockMovementDTO $dto, int $stockBefore, int $stockAfter): StockMovement;

    public function getProductHistory(int $productId, int $perPage = 20): array;

    public function getMovementsByType(string $type, ?int $productId = null): array;
}
