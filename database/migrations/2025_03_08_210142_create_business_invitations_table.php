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
        Schema::create('business_invitations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained()->onDelete('cascade');
            $table->string('email');
            $table->string('token')->unique();
            $table->foreignId('role_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('invited_by')->constrained('users')->onDelete('cascade');
            $table->string('status', 20)->default('pending'); // pending, accepted, declined, expired
            $table->timestamp('expires_at');
            $table->timestamps();

            // Ensure uniqueness of business and email
            $table->unique(['business_id', 'email']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business_invitations');
    }
};
