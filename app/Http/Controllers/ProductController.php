<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    // 📌 مفهوم Inertia: Inertia::render() يمرر البيانات كـ props لمكون React
    public function index(): Response
    {
        $products = Product::query()
            ->when(request('search'),   fn($q) => $q->where('name', 'like', '%' . request('search') . '%'))
            ->when(request('category'), fn($q) => $q->where('category', request('category')))
            ->paginate(8);

        $categories = Product::distinct()->pluck('category');

        return Inertia::render('Shop/Products', [
            'products'   => $products,
            'categories' => $categories,
            'filters'    => request()->only(['search', 'category']),
        ]);
    }

    // 📌 مفهوم Inertia: Dynamic routing — نفس طريقة Laravel العادية
    public function show(Product $product): Response
    {
        return Inertia::render('Shop/ProductDetail', [
            'product' => $product,
        ]);
    }
}
