<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\LoginRequest;
use App\Http\Resources\OrderResource;
use App\Http\Resources\ProductResource;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Services\CartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class ApiController extends Controller
{
    public function __construct(private CartService $cartService) {}

    // ── Auth ──────────────────────────────────────────

    // ✅ Controller: استقبال + تفويض فقط
    // ✅ Validation: في LoginRequest
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => [__('api.auth.invalid_credentials')],
            ]);
        }

        $user->tokens()->delete();

        return response()->json([
            'token' => $user->createToken('api-token')->plainTextToken,
            'user'  => ['id' => $user->id, 'name' => $user->name, 'email' => $user->email],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => __('api.auth.logout_success')]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }

    // ── Products ──────────────────────────────────────

    // ✅ Resource: يتحكم بشكل الـ JSON
    public function products(Request $request): AnonymousResourceCollection
    {
        $products = Product::query()
            ->when($request->search,   fn($q) => $q->where('name', 'like', "%{$request->search}%"))
            ->when($request->category, fn($q) => $q->where('category', $request->category))
            ->paginate($request->per_page ?? 8);

        return ProductResource::collection($products);
    }

    public function product(Product $product): ProductResource
    {
        return new ProductResource($product);
    }

    // ── Cart ──────────────────────────────────────────

    // ✅ Service: كل الـ business logic في CartService
    public function cart(Request $request): JsonResponse
    {
        return response()->json($this->cartService->getCart($request->user()));
    }

    public function addToCart(Request $request, Product $product): JsonResponse
    {
        $item = $this->cartService->addItem($request->user(), $product);
        return response()->json(['message' => __('api.cart.added'), 'item' => $item], 201);
    }

    public function removeFromCart(Request $request, CartItem $cartItem): JsonResponse
    {
        $this->cartService->removeItem($request->user(), $cartItem);
        return response()->json(['message' => __('api.cart.removed')]);
    }

    // ── Orders ────────────────────────────────────────

    public function orders(Request $request): AnonymousResourceCollection
    {
        $orders = Order::with('items.product')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return OrderResource::collection($orders);
    }

    public function checkout(Request $request): JsonResponse
    {
        $order = $this->cartService->checkout($request->user());
        return response()->json([
            'message' => __('api.orders.created'),
            'order'   => new OrderResource($order),
        ], 201);
    }
}
