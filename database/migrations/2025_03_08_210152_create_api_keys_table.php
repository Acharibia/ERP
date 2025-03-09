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
        Schema::create('api_keys', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('key')->unique();
            $table->string('secret');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('business_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('reseller_id')->nullable()->constrained()->onDelete('cascade');
            $table->json('scopes')->nullable(); // Array of allowed scopes
            $table->timestamp('last_used')->nullable();
            $table->json('ip_restrictions')->nullable(); // Array of allowed IPs
            $table->timestamp('expires_at')->nullable();
            $table->string('status', 20)->default('active'); // active, inactive, revoked
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('api_keys');
    }
};
