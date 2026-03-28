<?php

namespace App\Domain\Inventory\DTOs;

readonly class CreateProductDTO
{
    public function __construct(
        public string  $name,
        public string  $description,
        public float   $price,
        public float   $cost,
        public string  $category,
        public string  $sku,           // Stock Keeping Unit — كود المنتج
        public int     $initialStock,
        public int     $reorderPoint,  // نقطة إعادة الطلب
        public ?string $barcode = null,
        public ?string $image   = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            name:         $data['name'],
            description:  $data['description'],
            price:        (float) $data['price'],
            cost:         (float) $data['cost'],
            category:     $data['category'],
            sku:          $data['sku'],
            initialStock: (int) $data['initial_stock'],
            reorderPoint: (int) ($data['reorder_point'] ?? 10),
            barcode:      $data['barcode'] ?? null,
            image:        $data['image'] ?? null,
        );
    }
}
