<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Order;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Dashboard', [
            'stats' => [
                'totalProducts' => Product::count(),
                'totalOrders'   => Order::where('user_id', auth()->id())->count(),
                'totalRevenue'  => Order::where('user_id', auth()->id())->where('status', 'completed')->sum('total'),
                'cartItems'     => CartItem::where('user_id', auth()->id())->sum('quantity'),
            ],
            'recentOrders' => Order::where('user_id', auth()->id())
                ->latest()
                ->take(5)
                ->get(['id', 'status', 'total', 'created_at']),
        ]);
    }
}
