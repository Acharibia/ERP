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
        Schema::create('business_mergers', function (Blueprint $table) {
            $table->id();

            // Businesses involved in the merger
            $table->foreignId('acquiring_business_id')
                ->constrained('businesses')
                ->onDelete('cascade')
                ->comment('Business that is acquiring another');

            $table->foreignId('target_business_id')
                ->constrained('businesses')
                ->onDelete('cascade')
                ->comment('Business being acquired');

            // Merger details
            $table->enum('merger_type', [
                'horizontal',      // Between companies in same industry
                'vertical',        // Along supply chain
                'conglomerate',    // Unrelated industries
                'market_extension',// Same product, different markets
                'product_extension',// Different products, same market
                'acquisition',     // One company fully purchasing another
                'consolidation',   // Creating entirely new company
                'reverse',         // Private company becoming public
                'strategic'        // Long-term strategic merger
            ])->comment('Type of merger between businesses');

            $table->enum('status', [
                'pending',
                'due_diligence',
                'negotiation',
                'approved',
                'completed',
                'terminated'
            ])->default('pending')->comment('Current status of the merger process');

            // Financial details
            $table->decimal('transaction_value', 15, 2)->nullable()->comment('Total value of the merger transaction');

            // Key dates
            $table->date('agreement_date')->nullable()->comment('Date of merger agreement');
            $table->date('completion_date')->nullable()->comment('Date when merger is finalized');

            // Additional context
            $table->text('terms')->nullable()->comment('Merger terms and conditions');

            // Governance
            $table->foreignId('initiated_by')
                ->constrained('users')
                ->comment('User who initiated the merger process');

            // Audit columns
            $table->timestamps();

            // Unique constraint to prevent duplicate merger attempts
            $table->unique(['acquiring_business_id', 'target_business_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business_mergers');
    }
};
