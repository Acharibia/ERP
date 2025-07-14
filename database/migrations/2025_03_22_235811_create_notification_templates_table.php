<?php

use App\Central\Enums\NotificationChannel;
use App\Central\Enums\NotificationType;
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
            $table->json('channels');
            $table->string('subject', 255)->nullable();
            $table->text('content');
            $table->json('variables')->nullable();
            $table->enum('notification_type', NotificationType::values())
                ->default(NotificationType::INFO->value);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
            $table->unique(['code'], 'notification_templates_code_channel_unique');
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
