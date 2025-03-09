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
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained()->onDelete('cascade');
            $table->foreignId('package_id')->constrained()->onDelete('restrict');
            $table->string('status', 20)->default('active'); // active, canceled, expired, trial
            $table->date('start_date');
            $table->date('end_date');
            $table->date('trial_ends_at')->nullable();
            $table->boolean('is_auto_renew')->default(true);
            $table->decimal('price_override', 10, 2)->nullable(); // Custom price if different from package price
            $table->string('billing_cycle', 20)->default('monthly'); // monthly, quarterly, annual
            $table->integer('user_limit_override')->nullable(); // Custom user limit if different from package
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
