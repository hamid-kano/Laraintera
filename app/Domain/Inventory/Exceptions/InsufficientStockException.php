<?php

namespace App\Domain\Inventory\Exceptions;

use RuntimeException;

// 📌 DDD: الاستثناءات تعبّر عن قواعد العمل بلغة واضحة
class InsufficientStockException extends RuntimeException
{
    public function __construct(
        public readonly string $productName,
        public readonly int    $requested,
        public readonly int    $available,
    ) {
        parent::__construct(
            "المخزون غير كافٍ للمنتج '{$productName}'. مطلوب: {$requested}، متاح: {$available}"
        );
    }
}
