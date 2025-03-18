<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Create partnerships table to manage business collaborations
     */
    public function up(): void
    {
        Schema::create('partnerships', function (Blueprint $table) {
            $table->id();

            // Basic partnership details
            $table->string('name', 255);
            $table->text('description')->nullable();

            // Partnership classification
            $table->enum('partnership_type', [
                'supplier',
                'distributor',
                'strategic',
                'joint_venture',
                'research',
                'technology',
                'marketing',
                'financial',
                'service',
                'other'
            ])->comment('Categorization of partnership type');

            // Lifecycle management
            $table->date('start_date')->comment('Official partnership start date');
            $table->date('end_date')->nullable()->comment('Partnership end date (NULL for ongoing)');

            // Status tracking
            $table->enum('status', [
                'pending',      // Initial setup phase
                'active',       // Currently operational
                'suspended',    // Temporarily paused
                'negotiating',  // Ongoing terms discussion
                'terminated',   // Permanently ended
                'completed'     // Successfully concluded
            ])->default('pending')->comment('Current status of the partnership');

            // Participation complexity
            $table->boolean('is_multi_party')->default(false)
                ->comment('Indicates if partnership involves more than two parties');

            // Primary relationships
            $table->foreignId('initiator_business_id')
                ->constrained('businesses')
                ->onDelete('cascade')
                ->comment('Business that initiated the partnership');

            $table->foreignId('lead_contact_id')
                ->nullable()
                ->constrained('users')
                ->onDelete('set null')
                ->comment('Primary contact person for the partnership');

            // Additional details
            $table->text('terms')->nullable()->comment('High-level partnership terms and conditions');

            // Governance
            $table->foreignId('created_by')
                ->constrained('users');


            $table->index('partnership_type');
            $table->index('status');
            $table->index('start_date');

            // Audit columns
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('partnerships');
    }
};
