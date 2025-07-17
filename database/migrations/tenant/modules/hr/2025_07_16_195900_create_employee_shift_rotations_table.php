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
        Schema::create('employee_shift_rotations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->date('start_date');
            $table->enum('frequency', ['daily', 'weekly', 'bi-weekly', 'custom'])->default('daily');
            $table->unsignedInteger('interval')->nullable();                   // Used if frequency = 'custom'
            $table->enum('status', ['active', 'inactive'])->default('active'); // replaces is_active
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_shift_rotations');
    }
};
