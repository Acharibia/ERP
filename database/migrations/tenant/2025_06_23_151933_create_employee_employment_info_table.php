<?php

use App\Tenant\HR\Enum\EmploymentStatus;
use App\Tenant\HR\Enum\EmploymentType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('employee_employment_info', function (Blueprint $table) {
            $table->id();

            $table->foreignId('employee_id')->constrained()->onDelete('cascade');

            $table->foreignId('department_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('position_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('manager_id')->nullable()->constrained('employees')->nullOnDelete();

            $table->date('hire_date');

            $table->enum('employment_status', EmploymentStatus::values())->default(EmploymentStatus::ACTIVE->value);
            $table->enum('employment_type', EmploymentType::values());

            $table->text('work_location')->nullable();

            $table->date('probation_start_date')->nullable();
            $table->date('probation_end_date')->nullable();

            $table->date('contract_start_date')->nullable();
            $table->date('contract_end_date')->nullable();

            $table->date('termination_date')->nullable();
            $table->text('termination_reason')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['employee_id', 'employment_status']);
            $table->index(['employee_id', 'employment_type']);
            $table->index(['department_id', 'position_id', 'manager_id']);
            $table->index(['hire_date', 'termination_date']);
            $table->index(['probation_start_date', 'probation_end_date']);
            $table->index(['contract_start_date', 'contract_end_date']);

        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_employment_info');
    }
};
