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
        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('message');
            $table->string('type')->default('general'); // general, important, urgent
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->boolean('is_published')->default(true);
            $table->json('departments')->nullable(); // Array of department IDs
            $table->json('locations')->nullable(); // Array of locations
            $table->json('positions')->nullable(); // Array of position IDs
            $table->json('employees')->nullable(); // Array of specific employee IDs
            $table->foreignId('created_by')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};
