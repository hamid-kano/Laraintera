<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            ['name' => 'iPhone 15 Pro', 'description' => 'أحدث هاتف من Apple بشاشة 6.1 إنش وكاميرا 48MP', 'price' => 999.99, 'category' => 'Electronics', 'stock' => 50, 'image' => 'https://placehold.co/400x300/3b82f6/white?text=iPhone+15'],
            ['name' => 'Samsung Galaxy S24', 'description' => 'هاتف Samsung الرائد بمعالج Snapdragon 8 Gen 3', 'price' => 849.99, 'category' => 'Electronics', 'stock' => 35, 'image' => 'https://placehold.co/400x300/8b5cf6/white?text=Galaxy+S24'],
            ['name' => 'MacBook Pro M3', 'description' => 'لابتوب Apple بشريحة M3 وذاكرة 16GB', 'price' => 1999.99, 'category' => 'Electronics', 'stock' => 20, 'image' => 'https://placehold.co/400x300/6366f1/white?text=MacBook+Pro'],
            ['name' => 'Sony WH-1000XM5', 'description' => 'سماعات لاسلكية بخاصية إلغاء الضوضاء', 'price' => 349.99, 'category' => 'Electronics', 'stock' => 60, 'image' => 'https://placehold.co/400x300/ec4899/white?text=Sony+WH'],
            ['name' => 'Nike Air Max 270', 'description' => 'حذاء رياضي مريح بتقنية Air Max', 'price' => 129.99, 'category' => 'Shoes', 'stock' => 100, 'image' => 'https://placehold.co/400x300/f59e0b/white?text=Nike+Air'],
            ['name' => 'Adidas Ultraboost 23', 'description' => 'حذاء جري بتقنية Boost للراحة القصوى', 'price' => 179.99, 'category' => 'Shoes', 'stock' => 80, 'image' => 'https://placehold.co/400x300/10b981/white?text=Adidas'],
            ['name' => 'تيشيرت قطن بريميوم', 'description' => 'تيشيرت 100% قطن مصري بجودة عالية', 'price' => 29.99, 'category' => 'Clothing', 'stock' => 200, 'image' => 'https://placehold.co/400x300/ef4444/white?text=T-Shirt'],
            ['name' => 'جاكيت شتوي', 'description' => 'جاكيت دافئ مناسب للطقس البارد', 'price' => 89.99, 'category' => 'Clothing', 'stock' => 45, 'image' => 'https://placehold.co/400x300/0ea5e9/white?text=Jacket'],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
