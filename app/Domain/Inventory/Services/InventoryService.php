<?php

namespace App\Domain\Inventory\Services;

use App\Domain\Inventory\DTOs\CreateProductDTO;
use App\Domain\Inventory\DTOs\StockMovementDTO;
use App\Domain\Inventory\Events\StockDepleted;
use App\Domain\Inventory\Events\StockMovementRecorded;
use App\Domain\Inventory\Exceptions\InsufficientStockException;
use App\Domain\Inventory\Exceptions\NegativeStockException;
use App\Domain\Inventory\Exceptions\ProductNotFoundException;
use App\Domain\Inventory\Repositories\ProductRepositoryInterface;
use App\Domain\Inventory\Repositories\StockMovementRepositoryInterface;
use App\Infrastructure\Inventory\Models\InventoryProduct;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;

// 📌 DDD: Domain Service يحتوي على Business Logic
// لا يعرف شيئاً عن HTTP أو Eloquent مباشرة
// يتعامل فقط مع Interfaces
class InventoryService
{
    public function __construct(
        private ProductRepositoryInterface       $products,
        private StockMovementRepositoryInterface $movements,
    ) {}

    // ── إنشاء منتج جديد ──────────────────────────────
    public function createProduct(CreateProductDTO $dto): InventoryProduct
    {
        // قاعدة عمل: SKU يجب أن يكون فريداً
        if ($this->products->existsBySku($dto->sku)) {
            throw new \DomainException("الكود '{$dto->sku}' مستخدم بالفعل");
        }

        return DB::transaction(function () use ($dto) {
            $product = $this->products->create($dto);

            // تسجيل المخزون الأولي كحركة
            if ($dto->initialStock > 0) {
                $this->recordMovement(
                    StockMovementDTO::stockIn(
                        productId: $product->id,
                        quantity:  $dto->initialStock,
                        reason:    'مخزون أولي عند إنشاء المنتج',
                    )
                );
            }

            return $product;
        });
    }

    // ── إضافة مخزون (استلام بضاعة) ───────────────────
    public function receiveStock(StockMovementDTO $dto): void
    {
        // 📌 قاعدة عمل: الكمية يجب أن تكون موجبة
        if ($dto->quantity <= 0) {
            throw new \DomainException('الكمية يجب أن تكون أكبر من صفر');
        }

        $product = $this->findProductOrFail($dto->productId);

        DB::transaction(function () use ($dto, $product) {
            $stockBefore = $product->stock;
            $stockAfter  = $stockBefore + $dto->quantity;

            $this->products->updateStock($product->id, $stockAfter);
            $movement = $this->movements->record($dto, $stockBefore, $stockAfter);

            Event::dispatch(new StockMovementRecorded($movement->id, $dto, $stockBefore, $stockAfter));
        });
    }

    // ── سحب مخزون (بيع أو صرف) ───────────────────────
    public function deductStock(StockMovementDTO $dto): void
    {
        $product = $this->findProductOrFail($dto->productId);

        // 📌 قاعدة عمل: لا يمكن سحب أكثر من المتاح
        if ($dto->quantity > $product->stock) {
            throw new InsufficientStockException(
                productName: $product->name,
                requested:   $dto->quantity,
                available:   $product->stock,
            );
        }

        DB::transaction(function () use ($dto, $product) {
            $stockBefore = $product->stock;
            $stockAfter  = $stockBefore - $dto->quantity;

            // 📌 قاعدة عمل: المخزون لا يكون سالباً أبداً
            if ($stockAfter < 0) {
                throw new NegativeStockException($product->name);
            }

            $this->products->updateStock($product->id, $stockAfter);
            $movement = $this->movements->record($dto, $stockBefore, $stockAfter);

            Event::dispatch(new StockMovementRecorded($movement->id, $dto, $stockBefore, $stockAfter));

            // 📌 قاعدة عمل: تنبيه عند وصول المخزون لنقطة إعادة الطلب
            if ($stockAfter <= $product->reorder_point) {
                Event::dispatch(new StockDepleted(
                    productId:    $product->id,
                    productName:  $product->name,
                    currentStock: $stockAfter,
                    reorderPoint: $product->reorder_point,
                ));
            }
        });
    }

    // ── تسوية المخزون (جرد) ──────────────────────────
    public function adjustStock(int $productId, int $actualCount, string $notes): void
    {
        $product = $this->findProductOrFail($productId);

        // 📌 قاعدة عمل: الجرد لا يقبل أرقاماً سالبة
        if ($actualCount < 0) {
            throw new NegativeStockException($product->name);
        }

        $difference = $actualCount - $product->stock;

        if ($difference === 0) return; // لا يوجد فرق

        $dto = StockMovementDTO::adjustment(
            productId: $productId,
            quantity:  abs($difference),
            notes:     $notes,
        );

        // نحدد نوع الحركة بناءً على الفرق
        $type = $difference > 0 ? 'in' : 'out';

        DB::transaction(function () use ($dto, $product, $actualCount, $type) {
            $stockBefore = $product->stock;
            $this->products->updateStock($product->id, $actualCount);
            $movement = $this->movements->record(
                new StockMovementDTO(
                    productId: $dto->productId,
                    quantity:  $dto->quantity,
                    type:      $type,
                    reason:    $dto->reason,
                    notes:     $dto->notes,
                ),
                $stockBefore,
                $actualCount,
            );

            Event::dispatch(new StockMovementRecorded($movement->id, $dto, $stockBefore, $actualCount));
        });
    }

    // ── استعلامات ─────────────────────────────────────
    public function getLowStockProducts(): array
    {
        return $this->products->findLowStock();
    }

    public function getProductHistory(int $productId): array
    {
        $this->findProductOrFail($productId);
        return $this->movements->getProductHistory($productId);
    }

    // ── Private Helpers ───────────────────────────────
    private function findProductOrFail(int $id): InventoryProduct
    {
        $product = $this->products->findById($id);

        if (! $product) {
            throw new ProductNotFoundException((string) $id);
        }

        return $product;
    }
}
