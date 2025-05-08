<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('currencies', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->notNull();
            $table->string('code', 3)->unique()->notNull(); // ISO currency code
            $table->string('symbol', 5)->notNull();
            $table->string('format', 20)->default('1,234.56'); // Format example
            $table->decimal('exchange_rate', 15, 6)->default(1.000000); // Rate against base currency
            $table->boolean('is_base')->default(false); // Only one currency can be base
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_updated_at')->nullable();
            $table->timestamps();
        }); 
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('currencies');
    }
};
