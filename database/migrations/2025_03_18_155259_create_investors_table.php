<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Create the investors table to track individual and corporate investors
     * across the ERP platform.
     *
     * This table serves multiple purposes:
     * - Track potential and existing investors
     * - Store both individual and corporate investor information
     * - Maintain contact and compliance details
     */
    public function up(): void
    {
        Schema::create('investors', function (Blueprint $table) {
            $table->id();

            // Optional link to platform user account
            $table->foreignId('user_id')->nullable()
                ->constrained('users')
                ->onDelete('set null');

            // Investor classification
            $table->string('type', 50)->comment('individual, corporate, venture_capital, angel, etc.');

            // Basic identification
            $table->string('name', 255)->comment('Primary contact or company name');
            $table->string('company_name', 255)->nullable()->comment('Company name for corporate investors');

            // Contact information
            $table->string('email', 255);
            $table->string('phone', 50)->nullable();

            // Address details
            $table->text('address')->nullable();
            $table->string('city', 100)->nullable();
            $table->string('state', 100)->nullable();
            $table->string('postal_code', 20)->nullable();
            $table->string('country', 100)->nullable();

            // Financial and compliance information
            $table->string('tax_id', 100)->nullable()->comment('Tax identification number');
            $table->string('status', 20)->default('active')->comment('active, inactive, blocked');
            $table->string('accreditation_status', 20)->nullable()->comment('accredited, non_accredited, pending');

            // Additional context
            $table->text('notes')->nullable()->comment('Internal notes about the investor');

            // Audit columns
            $table->timestamps();

            // Additional indexing for performance
            $table->index('type');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('investors');
    }
};
