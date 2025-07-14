<?php

use App\Tenant\Modules\HR\Enum\MaritalStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('employee_personal_info', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('work_email')->unique();
            $table->string('personal_email')->unique();
            $table->string('work_phone')->nullable();
            $table->string('personal_phone')->nullable();

            $table->date('birth_date')->nullable();
            $table->unsignedBigInteger('gender_id')->nullable();
            $table->enum('marital_status', MaritalStatus::values())->nullable();
            $table->string('nationality')->nullable();
            $table->string('national_id')->nullable();

            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->unsignedBigInteger('state_id')->nullable();
            $table->string('postal_code')->nullable();
            $table->unsignedBigInteger('country_id')->nullable();
            $table->longText('bio')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['employee_id', 'work_email']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_personal_info');
    }
};
