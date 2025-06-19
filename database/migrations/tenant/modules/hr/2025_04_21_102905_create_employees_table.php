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
        Schema::create('employees', function (Blueprint $table) {
            $table->id();

            // ========================================
            // USER & EMPLOYEE IDENTIFICATION
            // ========================================
            $table->foreignId('user_id')->references('id')->on('users')->onDelete('restrict');
            $table->string('employee_id')->unique();
            $table->string('name');

            // ========================================
            // CONTACT INFORMATION
            // ========================================
            $table->string('work_email')->unique();
            $table->string('personal_email')->unique();
            $table->string('work_phone')->nullable();
            $table->string('personal_phone')->nullable();

            // ========================================
            // PERSONAL INFORMATION
            // ========================================
            $table->date('birth_date')->nullable();
            $table->enum('gender', ['male', 'female', 'other', 'prefer_not_to_say'])->nullable();
            $table->string('marital_status')->nullable();
            $table->string('nationality')->nullable();

            // ========================================
            // ADDRESS INFORMATION
            // ========================================
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state_id')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('country_id')->nullable();

            // ========================================
            // EMPLOYMENT DATES
            // ========================================
            $table->date('hire_date');
            $table->date('termination_date')->nullable();
            $table->string('termination_reason')->nullable();

            // ========================================
            // ORGANIZATIONAL STRUCTURE
            // ========================================
            $table->foreignId('department_id')->nullable()->references('id')->on('departments')->onDelete('set null');
            $table->foreignId('position_id')->nullable()->references('id')->on('positions')->onDelete('set null');
            $table->foreignId('manager_id')->nullable()->references('id')->on('employees')->onDelete('set null');

            // ========================================
            // EMPLOYMENT DETAILS
            // ========================================
            $table->enum('employment_status', ['active', 'inactive', 'on_leave', 'terminated', 'probation'])->default('active');
            $table->enum('employment_type', ['full_time', 'part_time', 'contract', 'temporary', 'intern']);
            $table->string('work_location')->nullable();

            // ========================================
            // ADDITIONAL INFORMATION
            // ========================================
            $table->longText('bio')->nullable();

            // ========================================
            // SYSTEM FIELDS
            // ========================================
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
