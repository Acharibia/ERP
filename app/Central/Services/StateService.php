<?php

namespace App\Central\Services;

use App\Central\Models\State;
use Illuminate\Database\Eloquent\Collection;

class StateService
{
    /**
     * Get all states.
     *
     * @param bool|null $isActive Filter by active status if provided
     * @return Collection
     */
    public function getAll(?bool $isActive = null): Collection
    {
        $query = State::query();

        if ($isActive !== null) {
            $query->where('is_active', $isActive);
        }

        return $query->orderBy('name')->get();
    }

    /**
     * Get states by country ID.
     *
     * @param int $countryId
     * @param bool|null $isActive Filter by active status if provided
     * @return Collection
     */
    public function getByCountry(int $countryId, ?bool $isActive = null): Collection
    {
        $query = State::where('country_id', $countryId);

        if ($isActive !== null) {
            $query->where('is_active', $isActive);
        }

        return $query->orderBy('name')->get();
    }

    /**
     * Find state by ID.
     *
     * @param int $id
     * @return State|null
     */
    public function find(int $id): ?State
    {
        return State::find($id);
    }

    /**
     * Create a new state.
     *
     * @param array $data
     * @return State
     */
    public function create(array $data): State
    {
        return State::create($data);
    }

    /**
     * Update an existing state.
     *
     * @param int $id
     * @param array $data
     * @return State|null
     */
    public function update(int $id, array $data): ?State
    {
        $state = $this->find($id);

        if (!$state) {
            return null;
        }

        $state->update($data);
        return $state;
    }

    /**
     * Delete a state.
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id): bool
    {
        $state = $this->find($id);

        if (!$state) {
            return false;
        }

        return $state->delete();
    }
}
