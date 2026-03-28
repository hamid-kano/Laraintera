<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'name'        => $this->name,
            'description' => $this->description,
            'price'       => (float) $this->price,
            'category'    => $this->category,
            'stock'       => $this->stock,
            'image'       => $this->image,
            'in_stock'    => $this->stock > 0,
            'created_at'  => $this->created_at->toDateString(),
        ];
    }
}
