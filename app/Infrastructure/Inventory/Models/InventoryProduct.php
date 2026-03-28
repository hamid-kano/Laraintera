<?php

namespace App\Infrastructure\Inventory\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

// 📌 DDD: Eloquent Model في Infrastructure — ليس في Domain
// الـ Domain لا يعرف شيئاً عن Eloquent
class InventoryProduct extends Model
{
    protected $table    = 'inventory_products';
    protected $fillable = [
        'name', 'description', 'price', 'cost',
        'category', 'sku', 'barcode', 'image',
        'stock', 'reorder_point',
    ];

    protected $casts = [
        'price'        => 'float',
        'cost'         => 'float',
        'stock'        => 'integer',
        'reorder_point'=> 'integer',
    ];

    public function movements(): HasMany
    {
        return $this->hasMany(StockMovement::class, 'product_id');
    }

    // Computed property
    public function isLowStock(): bool
    {
        return $this->stock <= $this->reorder_point;
    }

    public function getMarginAttribute(): float
    {
        return $this->cost > 0
            ? round((($this->price - $this->cost) / $this->price) * 100, 2)
            : 0;
    }
}
