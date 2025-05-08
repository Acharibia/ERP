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
        Schema::create('investor_offers', function (Blueprint $table) {
            $table->id();

            // Relationships
            $table->foreignId('business_id')
                ->constrained('businesses')
                ->onDelete('cascade')
                ->comment('The business receiving the offer');

            $table->foreignId('investor_id')
                ->constrained('investors')
                ->onDelete('cascade')
                ->comment('The investor submitting the offer');

            $table->foreignId('investment_round_id')
                ->constrained('investment_rounds')
                ->onDelete('cascade')
                ->comment('The investment round for this offer');

            // Offer details
            $table->decimal('amount', 15, 2)->comment('Amount of investment proposed');
            $table->string('currency', 10)->comment('Currency of the investment');
            $table->decimal('equity_percentage', 5, 2)->nullable()->comment('Proposed equity percentage');

            // Offer timeline
            $table->date('offer_date')->comment('Date the offer was submitted');
            $table->date('expiry_date')->nullable()->comment('Date the offer expires');
            $table->timestamp('response_date')->nullable()->comment('Date the offer was responded to');

            // Offer status
            $table->enum('status', [
                'pending',
                'under_review',
                'negotiation',
                'accepted',
                'rejected',
                'countered'
            ])->default('pending')->comment('Current status of the offer');

            // Investment structure specifics
            $table->enum('instrument_type', [
                'equity',
                'convertible_note',
                'safe',
                'warrant',
                'other'
            ])->nullable()->comment('Type of investment instrument');

            // Share pricing and structure
            $table->decimal('share_price', 10, 4)->nullable()->comment('Proposed price per share');
            $table->integer('number_of_shares')->nullable()->comment('Number of proposed shares');

            // Additional terms and rights
            $table->json('terms')->nullable()->comment('Detailed JSON of offer terms');
            $table->boolean('board_seat_offered')->default(false)->comment('Indicates if a board seat is part of the offer');
            $table->json('special_rights')->nullable()->comment('Special rights granted as part of the offer');
            $table->text('response_notes')->nullable()->comment('Notes on the response to the offer');

            // Tracking and accountability
            $table->foreignId('created_by')
                ->constrained('users')
                ->comment('User who submitted the offer');

            // Timestamps
            $table->timestamps();

            // Indexes for performance
            $table->index('status');
            $table->index('offer_date');
            $table->index(['investment_round_id', 'investor_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('investor_offers');
    }
};
