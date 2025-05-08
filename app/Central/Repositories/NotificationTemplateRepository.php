<?php

namespace App\Central\Repositories;

use App\Central\Models\NotificationTemplate;
use App\Support\Enums\NotificationChannel;
use Illuminate\Database\Eloquent\Collection;

class NotificationTemplateRepository
{
    /**
     * Find a template by its code and channel
     *
     * @param string $code
     * @param NotificationChannel|string $channel
     * @return NotificationTemplate|null
     */
    public function findByCodeAndChannel(string $code, $channel): ?NotificationTemplate
    {
        $channelValue = $channel instanceof NotificationChannel ? $channel->value : $channel;

        return NotificationTemplate::where('code', $code)
            ->where('channel', $channelValue)
            ->where('is_active', true)
            ->first();
    }

    /**
     * Get templates for a specific channel
     *
     * @param NotificationChannel|string $channel
     * @return Collection
     */
    public function getByChannel($channel): Collection
    {
        $channelValue = $channel instanceof NotificationChannel ? $channel->value : $channel;

        return NotificationTemplate::where('channel', $channelValue)
            ->where('is_active', true)
            ->get();
    }

    /**
     * Get templates for a specific reseller
     *
     * @param int $resellerId
     * @param NotificationChannel|string|null $channel
     * @return Collection
     */
    public function getByReseller(int $resellerId, $channel = null): Collection
    {
        $query = NotificationTemplate::where(function ($query) use ($resellerId) {
            $query->where('reseller_id', $resellerId)
                ->orWhere(function ($q) {
                    $q->whereNull('reseller_id')
                        ->where('access_level', 'system');
                });
        })->where('is_active', true);

        if ($channel) {
            $channelValue = $channel instanceof NotificationChannel ? $channel->value : $channel;
            $query->where('channel', $channelValue);
        }

        return $query->get();
    }

    /**
     * Get templates for a specific business
     *
     * @param int $businessId
     * @param int|null $resellerId
     * @param NotificationChannel|string|null $channel
     * @return Collection
     */
    public function getByBusiness(int $businessId, ?int $resellerId = null, $channel = null): Collection
    {
        $query = NotificationTemplate::where(function ($query) use ($businessId, $resellerId) {
            $query->where('business_id', $businessId)
                ->orWhere(function ($q) use ($resellerId) {
                    $q->whereNull('business_id')
                        ->where(function ($q2) use ($resellerId) {
                            $q2->where('reseller_id', $resellerId)
                                ->orWhere(function ($q3) {
                                    $q3->whereNull('reseller_id')
                                        ->where('access_level', 'system');
                                });
                        });
                });
        })->where('is_active', true);

        if ($channel) {
            $channelValue = $channel instanceof NotificationChannel ? $channel->value : $channel;
            $query->where('channel', $channelValue);
        }

        return $query->get();
    }

    /**
     * Get system-wide templates
     *
     * @param NotificationChannel|string|null $channel
     * @return Collection
     */
    public function getSystemTemplates($channel = null): Collection
    {
        $query = NotificationTemplate::whereNull('reseller_id')
            ->whereNull('business_id')
            ->where('access_level', 'system')
            ->where('is_active', true);

        if ($channel) {
            $channelValue = $channel instanceof NotificationChannel ? $channel->value : $channel;
            $query->where('channel', $channelValue);
        }

        return $query->get();
    }

    /**
     * Create a new template
     *
     * @param array $data
     * @return NotificationTemplate
     */
    public function create(array $data): NotificationTemplate
    {
        return NotificationTemplate::create($data);
    }

    /**
     * Update a template
     *
     * @param NotificationTemplate $template
     * @param array $data
     * @return NotificationTemplate
     */
    public function update(NotificationTemplate $template, array $data): NotificationTemplate
    {
        $template->update($data);
        return $template;
    }

    /**
     * Delete a template
     *
     * @param NotificationTemplate $template
     * @return bool|null
     */
    public function delete(NotificationTemplate $template): ?bool
    {
        // Don't allow deletion of system templates
        if ($template->is_system) {
            return false;
        }

        return $template->delete();
    }

    /**
     * Toggle template active status
     *
     * @param NotificationTemplate $template
     * @return NotificationTemplate
     */
    public function toggleActive(NotificationTemplate $template): NotificationTemplate
    {
        $template->is_active = !$template->is_active;
        $template->save();

        return $template;
    }
}
