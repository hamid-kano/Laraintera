<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('inventory_products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 12, 2)->default(0);
            $table->decimal('cost',  12, 2)->default(0);
            $table->string('category');
            $table->string('sku')->unique();
            $table->string('barcode')->nullable()->unique();
            $table->string('image')->nullable();
            $table->integer('stock')->default(0);
            $table->integer('reorder_point')->default(10);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['category', 'stock']);
            $table->index('sku');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_products');
    }
};
