<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Create the investment_rounds table to track funding rounds for businesses
     *
     * This table provides:
     * - Detailed tracking of investment rounds
     * - Funding stage information
     * - Target and minimum investment details
     * - Round status and lifecycle management
     */
    public function up(): void
    {
        Schema::create('investment_rounds', function (Blueprint $table) {
            $table->id();

            // Business relationship
            $table->foreignId('business_id')
                ->constrained('businesses')
                ->onDelete('cascade')
                ->comment('The business seeking investment');

            // Round identification
            $table->string('name', 100)->comment('Round name (e.g., Seed, Series A)');
            $table->string('type', 50)->comment('Investment type: equity, convertible_note, safe');

            // Financial details
            $table->decimal('target_amount', 15, 2)->comment('Total funding target');
            $table->decimal('minimum_investment', 15, 2)->nullable()->comment('Minimum individual investment amount');
            $table->decimal('raised_amount', 15, 2)->default(0)->comment('Amount of funding currently raised');

            // Timing and status
            $table->date('start_date')->comment('Begin date for investment round');
            $table->date('end_date')->nullable()->comment('Closing date for investment round');
            $table->string('status', 20)->default('active')->comment('planning, active, closed, cancelled');

            // Additional context
            $table->text('description')->nullable()->comment('Detailed description of the investment round');
            $table->json('terms')->nullable()->comment('JSON of investment terms and conditions');

            // Tracking and accountability
            $table->foreignId('created_by')
                ->constrained('users')
                ->comment('User who initiated the investment round');

            // Audit columns
            $table->timestamps();

            // Indexes for performance and filtering
            $table->index('name');
            $table->index('type');
            $table->index('status');
            $table->index('start_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('investment_rounds');
    }
};
