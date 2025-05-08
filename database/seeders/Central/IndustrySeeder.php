<?php

namespace Database\Seeders\Central;

use App\Central\Models\Industry;
use Illuminate\Database\Seeder;

class IndustrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $industries = [
            ['name' => 'Technology', 'code' => 'tech', 'description' => 'Technology and software companies'],
            ['name' => 'Healthcare', 'code' => 'health', 'description' => 'Healthcare providers and services'],
            ['name' => 'Manufacturing', 'code' => 'mfg', 'description' => 'Manufacturing and production companies'],
            ['name' => 'Retail', 'code' => 'retail', 'description' => 'Retail and consumer goods'],
            ['name' => 'Financial Services', 'code' => 'finance', 'description' => 'Banks, insurance, and financial institutions'],
            ['name' => 'Education', 'code' => 'edu', 'description' => 'Educational institutions and services'],
            ['name' => 'Hospitality', 'code' => 'hosp', 'description' => 'Hotels, restaurants, and tourism'],
            ['name' => 'Construction', 'code' => 'const', 'description' => 'Construction and building services'],
            ['name' => 'Transportation', 'code' => 'trans', 'description' => 'Transportation and logistics'],
            ['name' => 'Energy', 'code' => 'energy', 'description' => 'Energy and utilities companies'],
        ];

        foreach ($industries as $industryData) {
            // Use updateOrCreate instead of create
            Industry::updateOrCreate(
                ['code' => $industryData['code']], // Identify by code
                $industryData // Data to use
            );
        }

        // Create some sub-industries as examples
        $technology = Industry::where('code', 'tech')->first();

        if ($technology) {
            // Also use updateOrCreate for sub-industries
            Industry::updateOrCreate(
                ['code' => 'tech-sw'],
                [
                    'name' => 'Software Development',
                    'code' => 'tech-sw',
                    'description' => 'Software development companies',
                    'parent_id' => $technology->id,
                ]
            );

            Industry::updateOrCreate(
                ['code' => 'tech-it'],
                [
                    'name' => 'IT Services',
                    'code' => 'tech-it',
                    'description' => 'IT service providers',
                    'parent_id' => $technology->id,
                ]
            );

            Industry::updateOrCreate(
                ['code' => 'tech-hw'],
                [
                    'name' => 'Hardware Manufacturing',
                    'code' => 'tech-hw',
                    'description' => 'Computer hardware manufacturers',
                    'parent_id' => $technology->id,
                ]
            );
        }

        $this->command->info('Industries created successfully.');
    }
}
