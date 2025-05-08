<?php

namespace App\Central\Services;

use App\Central\Models\Country;
use Illuminate\Database\Eloquent\Collection;

class CountryService
{
    /**
     * Get all countries.
     *
     * @param bool|null $isActive Filter by active status if provided
     * @return Collection
     */
    public function getAll(?bool $isActive = null): Collection
    {
        $query = Country::query();

        if ($isActive !== null) {
            $query->where('is_active', $isActive);
        }

        return $query->orderBy('name')->get();
    }

    /**
     * Find country by ID.
     *
     * @param int $id
     * @return Country|null
     */
    public function find(int $id): ?Country
    {
        return Country::find($id);
    }

    /**
     * Create a new country.
     *
     * @param array $data
     * @return Country
     */
    public function create(array $data): Country
    {
        return Country::create($data);
    }

    /**
     * Update an existing country.
     *
     * @param int $id
     * @param array $data
     * @return Country|null
     */
    public function update(int $id, array $data): ?Country
    {
        $country = $this->find($id);

        if (!$country) {
            return null;
        }

        $country->update($data);
        return $country;
    }

    /**
     * Delete a country.
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id): bool
    {
        $country = $this->find($id);

        if (!$country) {
            return false;
        }

        return $country->delete();
    }
}
