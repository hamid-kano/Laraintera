<?php

namespace App\Domain\Inventory\Exceptions;

use RuntimeException;

class ProductNotFoundException extends RuntimeException
{
    public function __construct(string $identifier)
    {
        parent::__construct("المنتج '{$identifier}' غير موجود");
    }
}
