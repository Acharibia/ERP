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
        Schema::create('businesses', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('registration_number')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('website')->nullable();
            $table->string('address_line_1')->nullable();
            $table->string('address_line_2')->nullable();
            $table->string('city')->nullable();
            $table->string('state_id')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('country_id')->nullable();
            $table->foreignId('industry_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('reseller_id')->nullable()->constrained()->onDelete('set null');
            $table->string('subscription_status')->default('ACTIVE'); // active, trial, suspended, cancelled
            $table->string('environment')->default('PRODUCTION'); // production, staging, development
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('businesses');
    }
};
