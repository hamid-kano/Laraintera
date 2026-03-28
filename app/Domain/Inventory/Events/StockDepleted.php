<?php

namespace App\Domain\Inventory\Events;

// 📌 DDD: Domain Events تعبّر عن "شيء حدث في العمل"
// اسمها دائماً في الماضي: StockDepleted, OrderPlaced, InvoicePaid
class StockDepleted
{
    public function __construct(
        public readonly int    $productId,
        public readonly string $productName,
        public readonly int    $currentStock,
        public readonly int    $reorderPoint,
    ) {}
}
