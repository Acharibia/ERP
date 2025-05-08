<?php

namespace App\Resellers\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ResellerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'company_name' => $this->company_name,
            'contact_name' => $this->contact_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
            'city' => $this->city,
            'state' => $this->state,
            'postal_code' => $this->postal_code,
            'country' => $this->country,
            'status' => $this->status,
            'verification_status' => $this->verification_status,
            'commission_rate' => $this->commission_rate,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),

            'businesses_count' => $this->when($this->businesses_count !== null, $this->businesses_count),
            'active_businesses_count' => $this->when($this->active_businesses_count !== null, $this->active_businesses_count),

            'businesses' => $this->whenLoaded('businesses', function () {
                return $this->businesses;
            }),
            'users' => $this->whenLoaded('users', function () {
                return $this->users;
            }),
        ];
    }
}
