<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(): Response
    {
        $orders = Order::with('items.product')
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('Shop/Orders', [
            'orders' => $orders,
        ]);
    }

    // 📌 مفهوم Inertia: useForm يرسل POST هنا، ثم نعمل redirect لصفحة الطلبات
    public function checkout(): RedirectResponse
    {
        $cartItems = CartItem::with('product')->where('user_id', auth()->id())->get();

        if ($cartItems->isEmpty()) {
            return redirect()->back()->with('error', 'السلة فارغة');
        }

        $total = $cartItems->sum(fn($item) => $item->product->price * $item->quantity);

        $order = Order::create([
            'user_id' => auth()->id(),
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

        CartItem::where('user_id', auth()->id())->delete();

        // 📌 مفهوم Inertia: redirect بعد العملية — Inertia يتعامل معه تلقائياً
        return redirect()->route('orders.index')->with('success', 'تم إتمام الطلب بنجاح!');
    }
}
