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
        Schema::create('shift_preferences', function (Blueprint $table) {
            $table->id();

            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->foreignId('shift_id')->constrained()->onDelete('cascade');
            $table->boolean('is_available')->default(true);              // General availability for this shift
            $table->unsignedTinyInteger('preference_level')->nullable(); // 1 = highest preference, 5 = lowest
            $table->boolean('is_mandatory')->default(false);             // True = must strictly follow is_available
            $table->string('day_of_week')->nullable();                   // e.g., Monday, Tuesday (optional, for daily preference granularity)
            $table->unique(['employee_id', 'shift_id', 'day_of_week']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shift_preferences');
    }
};
