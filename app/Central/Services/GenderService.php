<?php

namespace App\Central\Services;

use App\Central\Models\Gender;
use Illuminate\Database\Eloquent\Collection;

class GenderService
{
    /**
     * Get all genders.
     *
     * @param bool|null $isActive Filter by active status if provided
     * @return Collection
     */
    public function getAll(?bool $isActive = null): Collection
    {
        $query = Gender::query();

        if ($isActive !== null) {
            $query->where('is_active', $isActive);
        }

        return $query->orderBy('name')->get();
    }

    /**
     * Find gender by ID.
     *
     * @param int $id
     * @return Gender|null
     */
    public function find(int $id): ?Gender
    {
        return Gender::find($id);
    }

    /**
     * Create a new gender.
     *
     * @param array $data
     * @return Gender
     */
    public function create(array $data): Gender
    {
        return Gender::create($data);
    }

    /**
     * Update an existing gender.
     *
     * @param int $id
     * @param array $data
     * @return Gender|null
     */
    public function update(int $id, array $data): ?Gender
    {
        $gender = $this->find($id);

        if (!$gender) {
            return null;
        }

        $gender->update($data);
        return $gender;
    }

    /**
     * Delete a gender.
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id): bool
    {
        $gender = $this->find($id);

        if (!$gender) {
            return false;
        }

        return $gender->delete();
    }
}
