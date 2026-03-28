<?php

namespace App\Domain\Inventory\DTOs;

// 📌 DDD: DTO = Data Transfer Object
// يحمل البيانات بين الطبقات بدون منطق
// readonly = لا يمكن تعديله بعد الإنشاء (immutable)
readonly class StockMovementDTO
{
    public function __construct(
        public int    $productId,
        public int    $quantity,
        public string $type,      // 'in' | 'out' | 'transfer' | 'adjustment'
        public string $reason,
        public ?int   $warehouseId   = null,
        public ?int   $referenceId   = null,   // order_id, purchase_id, etc.
        public ?string $referenceType = null,   // 'order', 'purchase', 'adjustment'
        public ?string $notes         = null,
    ) {}

    // Factory methods — تجعل الكود أوضح
    public static function stockIn(int $productId, int $quantity, string $reason, ?int $referenceId = null): self
    {
        return new self(
            productId:     $productId,
            quantity:      $quantity,
            type:          'in',
            reason:        $reason,
            referenceId:   $referenceId,
            referenceType: 'purchase',
        );
    }

    public static function stockOut(int $productId, int $quantity, string $reason, ?int $orderId = null): self
    {
        return new self(
            productId:     $productId,
            quantity:      $quantity,
            type:          'out',
            reason:        $reason,
            referenceId:   $orderId,
            referenceType: 'order',
        );
    }

    public static function adjustment(int $productId, int $quantity, string $notes): self
    {
        return new self(
            productId: $productId,
            quantity:  $quantity,
            type:      'adjustment',
            reason:    'تسوية مخزون',
            notes:     $notes,
        );
    }
}
