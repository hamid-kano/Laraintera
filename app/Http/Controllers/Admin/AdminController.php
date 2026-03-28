<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    // ── Dashboard ─────────────────────────────────────
    public function dashboard(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalProducts' => Product::count(),
                'totalOrders'   => Order::count(),
                'totalUsers'    => User::count(),
                'totalRevenue'  => Order::where('status', 'completed')->sum('total'),
                'pendingOrders' => Order::where('status', 'pending')->count(),
            ],
            'recentOrders' => Order::with('user')
                ->latest()
                ->take(10)
                ->get(['id', 'user_id', 'total', 'status', 'created_at']),
        ]);
    }

    // ── Products ──────────────────────────────────────
    public function products(): Response
    {
        $this->authorize('create-products'); // Spatie Permission

        return Inertia::render('Admin/Products', [
            'products' => Product::latest()->paginate(15),
        ]);
    }

    public function storeProduct(Request $request): RedirectResponse
    {
        $this->authorize('create-products');

        $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'required|string',
            'price'       => 'required|numeric|min:0',
            'category'    => 'required|string',
            'stock'       => 'required|integer|min:0',
        ]);

        Product::create($request->only(['name', 'description', 'price', 'category', 'stock', 'image']));

        return redirect()->back()->with('success', __('api.orders.created'));
    }

    public function updateProduct(Request $request, Product $product): RedirectResponse
    {
        $this->authorize('edit-products');

        $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'required|string',
            'price'       => 'required|numeric|min:0',
            'category'    => 'required|string',
            'stock'       => 'required|integer|min:0',
        ]);

        $product->update($request->only(['name', 'description', 'price', 'category', 'stock', 'image']));

        return redirect()->back()->with('success', 'تم تحديث المنتج.');
    }

    public function deleteProduct(Product $product): RedirectResponse
    {
        $this->authorize('delete-products');
        $product->delete();
        return redirect()->back()->with('success', 'تم حذف المنتج.');
    }

    // ── Orders ────────────────────────────────────────
    public function orders(): Response
    {
        $this->authorize('view-all-orders');

        return Inertia::render('Admin/Orders', [
            'orders' => Order::with('user', 'items.product')
                ->latest()
                ->paginate(15),
        ]);
    }

    public function updateOrderStatus(Request $request, Order $order): RedirectResponse
    {
        $this->authorize('update-order-status');

        $request->validate([
            'status' => 'required|in:pending,processing,completed,cancelled',
        ]);

        $order->update(['status' => $request->status]);

        return redirect()->back()->with('success', 'تم تحديث حالة الطلب.');
    }
}
