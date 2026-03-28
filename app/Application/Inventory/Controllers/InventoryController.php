<?php

namespace App\Application\Inventory\Controllers;

use App\Domain\Inventory\DTOs\CreateProductDTO;
use App\Domain\Inventory\DTOs\StockMovementDTO;
use App\Domain\Inventory\Exceptions\InsufficientStockException;
use App\Domain\Inventory\Exceptions\ProductNotFoundException;
use App\Domain\Inventory\Services\InventoryService;
use App\Domain\Inventory\Repositories\ProductRepositoryInterface;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

// 📌 DDD: Controller مسؤول فقط عن:
// 1. استقبال HTTP request
// 2. تحويله لـ DTO
// 3. تمريره للـ Domain Service
// 4. إرجاع Response
// لا يحتوي على أي business logic
class InventoryController extends Controller
{
    public function __construct(
        private InventoryService           $inventoryService,
        private ProductRepositoryInterface $products,
    ) {}

    // ── Pages (Inertia) ───────────────────────────────

    public function index(Request $request): Response
    {
        $products = $this->products->findAll(
            filters: $request->only(['search', 'category', 'low_stock']),
            perPage: 15,
        );

        $lowStockCount = count($this->inventoryService->getLowStockProducts());

        return Inertia::render('Inventory/Products', [
            'products'      => $products,
            'lowStockCount' => $lowStockCount,
            'filters'       => $request->only(['search', 'category', 'low_stock']),
        ]);
    }

    public function show(int $id): Response
    {
        $product = $this->products->findById($id);

        if (! $product) {
            abort(404);
        }

        $history = $this->inventoryService->getProductHistory($id);

        return Inertia::render('Inventory/ProductDetail', [
            'product' => $product,
            'history' => $history,
        ]);
    }

    // ── Actions ───────────────────────────────────────

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name'          => 'required|string|max:255',
            'description'   => 'nullable|string',
            'price'         => 'required|numeric|min:0',
            'cost'          => 'required|numeric|min:0',
            'category'      => 'required|string',
            'sku'           => 'required|string|unique:inventory_products,sku',
            'initial_stock' => 'required|integer|min:0',
            'reorder_point' => 'required|integer|min:0',
        ]);

        try {
            $product = $this->inventoryService->createProduct(
                CreateProductDTO::fromArray($request->all())
            );

            return response()->json([
                'message' => 'تم إنشاء المنتج بنجاح',
                'product' => $product,
            ], 201);

        } catch (\DomainException $e) {
            // 📌 Domain Exception → 422 Unprocessable
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function receiveStock(Request $request, int $productId): JsonResponse
    {
        $request->validate([
            'quantity'     => 'required|integer|min:1',
            'reason'       => 'required|string',
            'reference_id' => 'nullable|integer',
        ]);

        try {
            $this->inventoryService->receiveStock(
                StockMovementDTO::stockIn(
                    productId:   $productId,
                    quantity:    $request->quantity,
                    reason:      $request->reason,
                    referenceId: $request->reference_id,
                )
            );

            return response()->json(['message' => 'تم استلام المخزون بنجاح']);

        } catch (ProductNotFoundException $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }

    public function deductStock(Request $request, int $productId): JsonResponse
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
            'reason'   => 'required|string',
        ]);

        try {
            $this->inventoryService->deductStock(
                StockMovementDTO::stockOut(
                    productId: $productId,
                    quantity:  $request->quantity,
                    reason:    $request->reason,
                )
            );

            return response()->json(['message' => 'تم سحب المخزون بنجاح']);

        } catch (InsufficientStockException $e) {
            // 📌 Domain Exception → رسالة واضحة للمستخدم
            return response()->json(['message' => $e->getMessage()], 422);
        } catch (ProductNotFoundException $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }

    public function adjustStock(Request $request, int $productId): JsonResponse
    {
        $request->validate([
            'actual_count' => 'required|integer|min:0',
            'notes'        => 'required|string',
        ]);

        try {
            $this->inventoryService->adjustStock(
                productId:    $productId,
                actualCount:  $request->actual_count,
                notes:        $request->notes,
            );

            return response()->json(['message' => 'تمت تسوية المخزون بنجاح']);

        } catch (ProductNotFoundException $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }

    public function lowStock(): JsonResponse
    {
        return response()->json([
            'products' => $this->inventoryService->getLowStockProducts(),
        ]);
    }

    public function history(int $productId): JsonResponse
    {
        try {
            return response()->json([
                'history' => $this->inventoryService->getProductHistory($productId),
            ]);
        } catch (ProductNotFoundException $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }
}
