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
            $table->string('employee_id')->unique();
            $table->string('name');
            $table->string('work_email')->unique();
            $table->string('personal_email')->unique();
            $table->string('work_phone')->nullable();
            $table->string('personal_phone')->nullable();
            $table->date('birth_date')->nullable();
            $table->string('gender_id')->nullable();
            $table->string('marital_status')->nullable();
            $table->string('nationality')->nullable();
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state_id')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('country_id')->nullable();
            $table->date('hire_date');
            $table->date('termination_date')->nullable();
            $table->string('termination_reason')->nullable();
            $table->foreignId('department_id')->nullable()->references('id')->on('departments')->onDelete('set null');
            $table->foreignId('position_id')->nullable()->references('id')->on('positions')->onDelete('set null');
            $table->foreignId('manager_id')->nullable()->references('id')->on('employees')->onDelete('set null');
            $table->string('employment_status')->default('active'); // active, probation, terminated, on_leave
            $table->string('employment_type')->default('full-time'); // full-time, part-time, contract, intern
            $table->string('work_location')->nullable();
            $table->longText('bio')->nullable();
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
