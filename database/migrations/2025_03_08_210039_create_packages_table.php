<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('packages', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->notNull();
            $table->text('description')->nullable();
            $table->boolean('is_public')->default(true);
            $table->decimal('base_price', 10, 2)->notNull();
            $table->integer('user_limit')->nullable(); // NULL for unlimited
            $table->integer('storage_limit')->nullable(); // in GB, NULL for unlimited
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};
