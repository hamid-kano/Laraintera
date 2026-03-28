<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class ApiController extends Controller
{
    // ── Auth ──────────────────────────────────────────

    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['بيانات الاعتماد غير صحيحة.'],
            ]);
        }

        $user->tokens()->delete();
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => ['id' => $user->id, 'name' => $user->name, 'email' => $user->email],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'تم تسجيل الخروج']);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }

    // ── Products ──────────────────────────────────────

    public function products(Request $request): JsonResponse
    {
        $products = Product::query()
            ->when($request->search,   fn($q) => $q->where('name', 'like', "%{$request->search}%"))
            ->when($request->category, fn($q) => $q->where('category', $request->category))
            ->paginate($request->per_page ?? 8);

        return response()->json($products);
    }

    public function product(Product $product): JsonResponse
    {
        return response()->json($product);
    }

    // ── Cart ──────────────────────────────────────────

    public function cart(Request $request): JsonResponse
    {
        $items = CartItem::with('product')->where('user_id', $request->user()->id)->get();

        return response()->json([
            'items' => $items,
            'total' => $items->sum(fn($i) => $i->product->price * $i->quantity),
        ]);
    }

    public function addToCart(Request $request, Product $product): JsonResponse
    {
        $item = CartItem::firstOrNew([
            'user_id'    => $request->user()->id,
            'product_id' => $product->id,
        ]);
        $item->quantity = ($item->quantity ?? 0) + 1;
        $item->save();

        return response()->json(['message' => 'تمت الإضافة', 'item' => $item], 201);
    }

    public function removeFromCart(Request $request, CartItem $cartItem): JsonResponse
    {
        abort_if($cartItem->user_id !== $request->user()->id, 403);
        $cartItem->delete();
        return response()->json(['message' => 'تم الحذف']);
    }

    // ── Orders ────────────────────────────────────────

    public function orders(Request $request): JsonResponse
    {
        $orders = Order::with('items.product')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json($orders);
    }

    public function checkout(Request $request): JsonResponse
    {
        $cartItems = CartItem::with('product')->where('user_id', $request->user()->id)->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'السلة فارغة'], 422);
        }

        $total = $cartItems->sum(fn($i) => $i->product->price * $i->quantity);

        $order = Order::create([
            'user_id' => $request->user()->id,
            'total'   => $total,
            'status'  => 'pending',
        ]);

        foreach ($cartItems as $item) {
            OrderItem::create([
                'order_id'   => $order->id,
                'product_id' => $item->product_id,
                'quantity'   => $item->quantity,
                'price'      => $item->product->price,
            ]);
        }

        CartItem::where('user_id', $request->user()->id)->delete();

        return response()->json([
            'message' => 'تم إنشاء الطلب',
            'order'   => $order->load('items.product'),
        ], 201);
    }
}
