<?php

namespace App\Domain\Inventory\Exceptions;

use RuntimeException;

class NegativeStockException extends RuntimeException
{
    public function __construct(string $productName)
    {
        parent::__construct("لا يمكن أن يكون مخزون '{$productName}' سالباً");
    }
}
