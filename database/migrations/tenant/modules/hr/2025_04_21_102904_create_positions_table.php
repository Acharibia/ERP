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
        Schema::create('positions', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('code')->unique();
            $table->text('description')->nullable();
            $table->text('requirements')->nullable();
            $table->text('responsibilities')->nullable();
            $table->foreignId('department_id')->nullable()->references('id')->on('departments')->onDelete('set null');
            $table->string('employment_type')->default('full-time'); // full-time, part-time, contract, intern
            $table->string('position_level')->nullable(); // entry, mid, senior, manager, executive
            $table->decimal('min_salary', 12, 2)->nullable();
            $table->decimal('max_salary', 12, 2)->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('positions');
    }
};
