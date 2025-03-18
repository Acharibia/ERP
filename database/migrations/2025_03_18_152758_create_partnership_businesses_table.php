<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Create partnership_businesses table to track business participation
     */
    public function up(): void
    {
        Schema::create('partnership_businesses', function (Blueprint $table) {
            // Primary Key
            $table->id();

            // Relationship references
            $table->foreignId('partnership_id')
                ->constrained('partnerships')
                ->onDelete('cascade')
                ->comment('The specific partnership');

            $table->foreignId('business_id')
                ->constrained('businesses')
                ->onDelete('cascade')
                ->comment('Business participating in the partnership');

            // Contact management
            $table->foreignId('contact_person_id')
                ->nullable()
                ->constrained('users')
                ->onDelete('set null')
                ->comment('Primary contact for this business in the partnership');

            $table->enum('status', [
                'pending',      // Invitation sent, awaiting confirmation
                'active',       // Currently participating
                'suspended',    // Temporarily paused
                'negotiating',  // Discussing terms
                'exited',       // Withdrawn from partnership
                'terminated'    // Removed from partnership
            ])->default('pending')->comment('Current participation status');

            // Participation Dates
            $table->date('joined_date')->nullable()
                ->comment('Date when business officially joined the partnership');

            $table->date('exit_date')->nullable()
                ->comment('Date when business exited the partnership');

            // Audit columns
            $table->timestamps();

            // Unique constraint to prevent duplicate entries
            $table->unique(['partnership_id', 'business_id']);

            $table->index('status');
            $table->index('joined_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('partnership_businesses');
    }
};
