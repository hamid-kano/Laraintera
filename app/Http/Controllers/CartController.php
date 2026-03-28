<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    // 📌 مفهوم Inertia: نمرر بيانات السلة كـ props
    public function index(): Response
    {
        $cartItems = CartItem::with('product')
            ->where('user_id', auth()->id())
            ->get();

        $total = $cartItems->sum(fn($item) => $item->product->price * $item->quantity);

        return Inertia::render('Shop/Cart', [
            'cartItems' => $cartItems,
            'total'     => $total,
        ]);
    }

    // 📌 مفهوم Inertia: useForm في React يرسل POST هنا — بدون API
    public function add(Product $product): RedirectResponse
    {
        $cartItem = CartItem::firstOrNew([
            'user_id'    => auth()->id(),
            'product_id' => $product->id,
        ]);

        $cartItem->quantity = ($cartItem->quantity ?? 0) + 1;
        $cartItem->save();

        // 📌 مفهوم Inertia: redirect()->back() يعيد تحميل نفس الصفحة مع تحديث Shared Data
        return redirect()->back();
    }

    public function remove(CartItem $cartItem): RedirectResponse
    {
        $cartItem->delete();
        return redirect()->back();
    }

    public function update(CartItem $cartItem): RedirectResponse
    {
        $cartItem->update(['quantity' => request('quantity')]);
        return redirect()->back();
    }
}
