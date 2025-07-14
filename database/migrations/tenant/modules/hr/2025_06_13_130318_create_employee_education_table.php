<?php

use App\Tenant\Modules\HR\Enum\DegreeType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('employee_education', function (Blueprint $table) {
            $table->id();

            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');

            $table->string('institution');
            $table->unsignedBigInteger('country_id')->nullable();

            $table->enum('degree_type', DegreeType::values());
            $table->string('field_of_study');

            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->date('graduation_date')->nullable();
            $table->boolean('is_completed')->default(false);
            $table->boolean('is_current')->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['employee_id', 'is_completed']);
            $table->index(['employee_id', 'degree_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_education');
    }
};
