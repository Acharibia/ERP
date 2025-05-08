<?php

namespace App\Central\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PackageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'base_price' => (float) $this->base_price,
            'user_limit' => $this->user_limit,
            'storage_limit' => $this->storage_limit,
            'is_public' => $this->is_public,
            'modules' => $this->modules->map(function ($module) {
                return [
                    'id' => $module->id,
                    'name' => $module->name,
                    'code' => $module->code,
                    'description' => $module->description,
                ];
            }),
        ];
    }
}
