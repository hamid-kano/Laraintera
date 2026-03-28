<?php

namespace App\Infrastructure\Inventory\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockMovement extends Model
{
    protected $table    = 'stock_movements';
    protected $fillable = [
        'product_id', 'quantity', 'type',
        'reason', 'notes', 'warehouse_id',
        'reference_id', 'reference_type',
        'stock_before', 'stock_after',
        'created_by',
    ];

    protected $casts = [
        'quantity'     => 'integer',
        'stock_before' => 'integer',
        'stock_after'  => 'integer',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(InventoryProduct::class, 'product_id');
    }

    // نوع الحركة بالعربية
    public function getTypeLabel(): string
    {
        return match($this->type) {
            'in'         => 'وارد',
            'out'        => 'صادر',
            'transfer'   => 'تحويل',
            'adjustment' => 'تسوية',
            default      => $this->type,
        };
    }
}
