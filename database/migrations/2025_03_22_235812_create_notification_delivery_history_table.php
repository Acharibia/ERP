<?php

use App\Central\Enums\NotificationChannel;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notification_delivery_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('channel', NotificationChannel::values());
            $table->string('recipient', 255);
            $table->foreignId('template_id')->nullable()->constrained('notification_templates')->nullOnDelete();
            $table->boolean('success')->default(false);
            $table->text('error_message')->nullable();
            $table->json('data')->nullable();
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notification_delivery_history');
    }
};
