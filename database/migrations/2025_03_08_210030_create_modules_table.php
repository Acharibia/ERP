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
        Schema::create('modules', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->notNull();
            $table->string('code', 50)->unique()->notNull();
            $table->text('description')->nullable();
            $table->string('version', 20)->notNull();
            $table->boolean('is_core')->default(false);
            $table->string('status')->default('active'); // active, inactive, deprecated
            $table->text('installation_script')->nullable();
            $table->text('uninstallation_script')->nullable();
            $table->string('icon_url', 255)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('modules');
    }
};
