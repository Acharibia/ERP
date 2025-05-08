<?php

namespace App\Central\Services;

use App\Central\Models\Title;
use Illuminate\Database\Eloquent\Collection;

class TitleService
{
    /**
     * Get all titles.
     *
     * @param bool|null $isActive Filter by active status if provided
     * @return Collection
     */
    public function getAll(?bool $isActive = null): Collection
    {
        $query = Title::query();

        if ($isActive !== null) {
            $query->where('is_active', $isActive);
        }

        return $query->orderBy('name')->get();
    }

    /**
     * Find title by ID.
     *
     * @param int $id
     * @return Title|null
     */
    public function find(int $id): ?Title
    {
        return Title::find($id);
    }

    /**
     * Create a new title.
     *
     * @param array $data
     * @return Title
     */
    public function create(array $data): Title
    {
        return Title::create($data);
    }

    /**
     * Update an existing title.
     *
     * @param int $id
     * @param array $data
     * @return Title|null
     */
    public function update(int $id, array $data): ?Title
    {
        $title = $this->find($id);

        if (!$title) {
            return null;
        }

        $title->update($data);
        return $title;
    }

    /**
     * Delete a title.
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id): bool
    {
        $title = $this->find($id);

        if (!$title) {
            return false;
        }

        return $title->delete();
    }
}
