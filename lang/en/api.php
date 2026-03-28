<?php

return [
    'auth' => [
        'invalid_credentials' => 'Invalid email or password.',
        'unauthenticated'     => 'You must be logged in.',
        'unauthorized'        => 'You are not authorized for this action.',
        'logout_success'      => 'Logged out successfully.',
    ],
    'rate_limit'        => 'Too many requests. Please try again later.',
    'too_many_attempts' => 'Too many login attempts. Please try again in a minute.',
    'cart' => [
        'added'        => 'Product added to cart.',
        'removed'      => 'Product removed from cart.',
        'updated'      => 'Quantity updated.',
        'empty'        => 'Your cart is empty.',
        'not_yours'    => 'This item does not belong to your account.',
    ],
    'orders' => [
        'created'      => 'Order created successfully.',
        'not_found'    => 'Order not found.',
    ],
    'validation' => [
        'required'     => 'The :attribute field is required.',
        'email'        => 'Invalid email address.',
        'min'          => 'The :attribute must be at least :min characters.',
    ],
];
