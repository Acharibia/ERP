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
        Schema::create('investments', function (Blueprint $table) {
            $table->id();

            // Relationships
            $table->foreignId('business_id')
                ->constrained('businesses')
                ->onDelete('cascade')
                ->comment('The business receiving investment');

            $table->foreignId('investor_id')
                ->constrained('investors')
                ->onDelete('cascade')
                ->comment('The investor making the investment');

            $table->foreignId('investment_round_id')
                ->constrained('investment_rounds')
                ->onDelete('cascade')
                ->comment('The specific investment round');

            // New: Link to specific investor offer
            $table->foreignId('investor_offer_id')
                ->nullable()
                ->constrained('investor_offers')
                ->onDelete('set null')
                ->comment('The specific investor offer that led to this investment');

            // Financial details
            $table->decimal('amount', 15, 2)->comment('Investment amount');
            $table->string('currency', 3)->default('USD')->comment('Currency of investment');

            // Transaction specifics
            $table->date('investment_date')->comment('Date of investment');
            $table->string('payment_method', 50)->nullable()->comment('Method of payment');
            $table->string('transaction_id', 100)->nullable()->comment('External transaction identifier');

            // Additional details
            $table->string('status', 20)->default('pending')->comment('pending, completed, refunded');
            $table->text('notes')->nullable()->comment('Additional notes about the investment');

            // Investment structure
            $table->string('instrument_type', 50)->nullable()->comment('Type of investment instrument');
            $table->decimal('share_price', 10, 4)->nullable()->comment('Price per share');
            $table->integer('shares_acquired')->nullable()->comment('Number of shares acquired');

            // Audit and compliance
            $table->foreignId('processed_by')
                ->nullable()
                ->constrained('users')
                ->onDelete('set null')
                ->comment('User who processed the investment');

            // Audit columns
            $table->timestamps();

            // Indexes for performance and filtering
            $table->index('investment_date');
            $table->index('status');
            $table->index(['business_id', 'investment_round_id']);

            // Unique constraint for transaction tracking
            $table->unique(['investment_round_id', 'investor_id', 'transaction_id'], 'unique_investment_transaction');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('investments');
    }
};
