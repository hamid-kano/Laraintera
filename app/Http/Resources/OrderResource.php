<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'total'      => (float) $this->total,
            'status'     => $this->status,
            'created_at' => $this->created_at->toDateString(),
            'items'      => $this->whenLoaded('items', fn() =>
                $this->items->map(fn($item) => [
                    'id'       => $item->id,
                    'quantity' => $item->quantity,
                    'price'    => (float) $item->price,
                    'product'  => [
                        'name'  => $item->product->name,
                        'image' => $item->product->image,
                    ],
                ])
            ),
        ];
    }
}
