<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function index(): Response
    {
        $cartItems = CartItem::with('product')
            ->where('user_id', auth()->id())
            ->get();

        return Inertia::render('Shop/Cart', [
            'cartItems' => $cartItems,
            'total'     => $cartItems->sum(fn($i) => $i->product->price * $i->quantity),
        ]);
    }

    public function add(Product $product): RedirectResponse
    {
        $cartItem = CartItem::firstOrNew([
            'user_id'    => auth()->id(),
            'product_id' => $product->id,
        ]);

        $cartItem->quantity = ($cartItem->quantity ?? 0) + 1;
        $cartItem->save();

        return redirect()->back();
    }

    public function remove(CartItem $cartItem): RedirectResponse
    {
        // ✅ Policy تتحقق أن المستخدم يملك العنصر
        $this->authorize('delete', $cartItem);
        $cartItem->delete();
        return redirect()->back();
    }

    public function update(CartItem $cartItem): RedirectResponse
    {
        $this->authorize('update', $cartItem);
        $cartItem->update(['quantity' => max(1, (int) request('quantity'))]);
        return redirect()->back();
    }
}
