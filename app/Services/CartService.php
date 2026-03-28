<?php

namespace App\Services;

use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class CartService
{
    public function getCart(User $user): array
    {
        $items = CartItem::with('product')->where('user_id', $user->id)->get();

        return [
            'items' => $items,
            'total' => $this->calculateTotal($items),
            'count' => $items->sum('quantity'),
        ];
    }

    public function addItem(User $user, Product $product): CartItem
    {
        $item = CartItem::firstOrNew([
            'user_id'    => $user->id,
            'product_id' => $product->id,
        ]);

        $item->quantity = ($item->quantity ?? 0) + 1;
        $item->save();

        return $item->fresh('product');
    }

    public function removeItem(User $user, CartItem $cartItem): void
    {
        // ✅ Policy تتحقق أن المستخدم يملك العنصر
        abort_unless($user->can('delete', $cartItem), 403, __('api.auth.unauthorized'));
        $cartItem->delete();
    }

    public function updateQuantity(User $user, CartItem $cartItem, int $quantity): CartItem
    {
        abort_unless($user->can('update', $cartItem), 403, __('api.auth.unauthorized'));
        $cartItem->update(['quantity' => max(1, $quantity)]);
        return $cartItem->fresh('product');
    }

    public function checkout(User $user): Order
    {
        $items = CartItem::with('product')->where('user_id', $user->id)->get();

        abort_if($items->isEmpty(), 422, __('api.cart.empty'));

        $order = Order::create([
            'user_id' => $user->id,
            'total'   => $this->calculateTotal($items),
            'status'  => 'pending',
        ]);

        foreach ($items as $item) {
            OrderItem::create([
                'order_id'   => $order->id,
                'product_id' => $item->product_id,
                'quantity'   => $item->quantity,
                'price'      => $item->product->price,
            ]);
        }

        CartItem::where('user_id', $user->id)->delete();

        return $order->load('items.product');
    }

    private function calculateTotal(Collection $items): float
    {
        return (float) $items->sum(fn($item) => $item->product->price * $item->quantity);
    }
}
