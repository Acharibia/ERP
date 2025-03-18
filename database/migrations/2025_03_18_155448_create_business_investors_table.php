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
        Schema::create('business_investors', function (Blueprint $table) {
            $table->id();

            // Relationships
            $table->foreignId('business_id')
                ->constrained('businesses')
                ->onDelete('cascade')
                ->comment('The business receiving investment');

            $table->foreignId('investor_id')
                ->constrained('investors')
                ->onDelete('cascade')
                ->comment('The investor providing funding');

            $table->foreignId('investment_round_id')
                ->nullable()
                ->constrained('investment_rounds')
                ->onDelete('set null')
                ->comment('The specific investment round');

            // New: Link to specific investor offer
            $table->foreignId('investor_offer_id')
                ->nullable()
                ->constrained('investor_offers')
                ->onDelete('set null')
                ->comment('The specific investor offer that established this relationship');

            // Optional role management (using Spatie roles)
            $table->foreignId('role_id')
                ->nullable()
                ->constrained('roles')
                ->onDelete('set null')
                ->comment('Optional role for the investor');

            // Investor status and details
            $table->string('status', 20)->default('active')
                ->comment('active, former, pending');

            // Investment specifics
            $table->date('investment_date')->nullable()->comment('Date of investment');
            $table->decimal('total_investment', 15, 2)->default(0.00)->comment('Total amount invested');
            $table->decimal('equity_percentage', 5, 2)->nullable()->comment('Percentage of business ownership');

            // Enhanced tracking
            $table->date('initial_contact_date')->nullable()->comment('Date of first contact');
            $table->enum('investor_type', [
                'angel',
                'venture_capital',
                'private_equity',
                'corporate',
                'individual'
            ])->nullable()->comment('Type of investor');

            // Additional terms and context
            $table->text('investment_terms')->nullable()->comment('Specific terms of investment');
            $table->json('additional_details')->nullable()->comment('Additional JSON-stored details');

            // Contact management
            $table->foreignId('contact_person_id')
                ->nullable()
                ->constrained('users')
                ->onDelete('set null')
                ->comment('Primary contact for this investor');

            // Audit columns
            $table->timestamps();

            // Unique constraint to prevent duplicate entries
            $table->unique(['business_id', 'investor_id', 'investment_round_id'], 'unique_business_investor_round');

            // Indexes for performance and filtering
            $table->index('status');
            $table->index('investment_date');
            $table->index('investor_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business_investors');
    }
};
