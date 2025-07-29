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
        Schema::create('shift_rotations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->nullable()->constrained('employees')->onDelete('cascade');
            $table->json('department_ids')->nullable();
            $table->json('position_ids')->nullable();
            $table->json('role_ids')->nullable();
            $table->foreignId('shift_id')->nullable()->constrained('shifts')->onDelete('set null');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->string('frequency');
            $table->unsignedInteger('interval')->default(1);
            $table->string('status')->default('active');
            $table->unsignedInteger('duration_days')->nullable();
            $table->boolean('is_recurring')->default(true);
            $table->enum('priority', ['high', 'medium', 'low'])->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shift_rotations');
    }
};
