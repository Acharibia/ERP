<?php

use App\Tenant\HR\Enum\DepartmentStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->string('email')->unique();
            $table->text('description')->nullable();
            $table->foreignId('parent_id')->nullable()->references('id')->on('departments')->onDelete('set null');
            $table->foreignId('manager_id')->nullable(); // Will reference employees table
            $table->decimal('budget', 15, 2)->nullable();
            $table->string('cost_center')->nullable();
            $table->string('location')->nullable();
            $table->integer('headcount_limit')->nullable();
            $table->enum('status', array_column(DepartmentStatus::cases(), 'value'))->default(DepartmentStatus::ACTIVE->value);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('departments');
    }
};
