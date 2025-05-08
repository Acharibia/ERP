<?php

namespace App\Central\Services;

use App\Central\Models\Industry;
use Illuminate\Database\Eloquent\Collection;

class IndustryService
{
    /**
     * Get all industries.
     *
     * @param bool|null $isActive Filter by active status if provided
     * @return Collection
     */
    public function getAll(?bool $isActive = null): Collection
    {
        $query = Industry::query();

        if ($isActive !== null) {
            $query->where('is_active', $isActive);
        }

        return $query->orderBy('name')->get();
    }

    /**
     * Get only root industries (not sub-industries).
     *
     * @param bool|null $isActive Filter by active status if provided
     * @return Collection
     */
    public function getRootIndustries(?bool $isActive = null): Collection
    {
        $query = Industry::root();

        if ($isActive !== null) {
            $query->where('is_active', $isActive);
        }

        return $query->orderBy('name')->get();
    }

    /**
     * Get sub-industries for a specific industry.
     *
     * @param int $parentId
     * @param bool|null $isActive Filter by active status if provided
     * @return Collection
     */
    public function getChildIndustries(int $parentId, ?bool $isActive = null): Collection
    {
        $query = Industry::where('parent_id', $parentId);

        if ($isActive !== null) {
            $query->where('is_active', $isActive);
        }

        return $query->orderBy('name')->get();
    }

    /**
     * Get industry by ID.
     *
     * @param int $id
     * @return Industry|null
     */
    public function find(int $id): ?Industry
    {
        return Industry::find($id);
    }

    /**
     * Create a new industry.
     *
     * @param array $data
     * @return Industry
     */
    public function create(array $data): Industry
    {
        return Industry::create($data);
    }

    /**
     * Update an existing industry.
     *
     * @param int $id
     * @param array $data
     * @return Industry|null
     */
    public function update(int $id, array $data): ?Industry
    {
        $industry = $this->find($id);

        if (!$industry) {
            return null;
        }

        $industry->update($data);
        return $industry;
    }

    /**
     * Delete an industry.
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id): bool
    {
        $industry = $this->find($id);

        if (!$industry) {
            return false;
        }

        // Check if this industry has children
        if ($industry->hasChildren()) {
            return false; // Prevent deletion if it has children
        }

        return $industry->delete();
    }

    /**
     * Get a hierarchical list of industries.
     *
     * @param bool|null $isActive Filter by active status if provided
     * @return Collection
     */
    public function getHierarchicalList(?bool $isActive = null): Collection
    {
        $rootIndustries = $this->getRootIndustries($isActive);

        foreach ($rootIndustries as $industry) {
            $industry->setAttribute('children', $this->getChildrenRecursive($industry, $isActive));
        }

        return $rootIndustries;
    }

    /**
     * Get all businesses in an industry and its sub-industries.
     *
     * @param int $industryId
     * @return Collection
     */
    public function getAllBusinessesInIndustry(int $industryId): Collection
    {
        $industry = $this->find($industryId);

        if (!$industry) {
            return collect();
        }

        return $industry->getAllBusinesses();
    }

    /**
     * Helper method to recursively get children.
     *
     * @param Industry $industry
     * @param bool|null $isActive
     * @return Collection
     */
    protected function getChildrenRecursive(Industry $industry, ?bool $isActive = null): Collection
    {
        $query = $industry->children();

        if ($isActive !== null) {
            $query->where('is_active', $isActive);
        }

        $children = $query->orderBy('name')->get();

        foreach ($children as $child) {
            $child->setAttribute('children', $this->getChildrenRecursive($child, $isActive));
        }

        return $children;
    }

    /**
     * Get all child industries (recursively) for a given industry.
     *
     * @param int $industryId
     * @param bool|null $isActive
     * @return array
     */
    public function getAllChildIndustryIds(int $industryId, ?bool $isActive = null): array
    {
        $industry = $this->find($industryId);

        if (!$industry) {
            return [];
        }

        $query = $industry->children();

        if ($isActive !== null) {
            $query->where('is_active', $isActive);
        }

        $children = $query->get();
        $ids = $children->pluck('id')->toArray();

        foreach ($children as $child) {
            $childIds = $this->getAllChildIndustryIds($child->id, $isActive);
            $ids = array_merge($ids, $childIds);
        }

        return $ids;
    }
}
