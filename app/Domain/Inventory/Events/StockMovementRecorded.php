<?php

namespace App\Domain\Inventory\Events;

use App\Domain\Inventory\DTOs\StockMovementDTO;

class StockMovementRecorded
{
    public function __construct(
        public readonly int              $movementId,
        public readonly StockMovementDTO $dto,
        public readonly int              $stockBefore,
        public readonly int              $stockAfter,
    ) {}
}
