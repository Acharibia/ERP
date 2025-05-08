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
        Schema::create('notification_templates', function (Blueprint $table) {
            $table->id();
            $table->string('code', 100);
            $table->string('name', 255);
            $table->text('description')->nullable();
            $table->string('channel', 20); // email, sms, in-app, push
            $table->string('subject', 255)->nullable();
            $table->text('content');
            $table->json('variables')->nullable(); // Required variables for this template
            $table->string('notification_type', 20)->default('info'); // info, success, warning, error
            $table->boolean('is_system')->default(false); // System templates cannot be deleted
            $table->boolean('is_active')->default(true);
            $table->string('access_level', 20)->default('system'); // system, reseller, business
            $table->foreignId('reseller_id')->nullable()->constrained()->nullOnDelete(); // NULL for system templates
            $table->foreignId('business_id')->nullable()->constrained()->nullOnDelete(); // NULL for non-business templates
            $table->timestamps();
            $table->softDeletes();

            // Use a composite unique constraint on code and channel instead of just code
            $table->unique(['code', 'channel'], 'notification_templates_code_channel_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notification_templates');
    }
};
