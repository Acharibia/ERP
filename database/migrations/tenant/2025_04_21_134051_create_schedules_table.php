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
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->date('date');

            $table->foreignId('shift_id')->nullable()->constrained()->onDelete('set null');

            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();

            $table->enum('schedule_type', ['standard', 'shift', 'flexible', 'off'])->default('standard');
            $table->boolean('is_remote')->default(false);
            $table->string('location')->nullable();
            $table->text('notes')->nullable();
            $table->decimal('expected_hours', 4, 2)->nullable(); // e.g., 8.00

            $table->timestamps();

            $table->unique(['employee_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
