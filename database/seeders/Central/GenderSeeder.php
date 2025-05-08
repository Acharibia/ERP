<?php

namespace Database\Seeders\Central;

use App\Central\Models\Gender;
use Illuminate\Database\Seeder;

class GenderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $genders = [
            [
                'name' => 'Male',
                'code' => 'M',
                'is_active' => true,
            ],
            [
                'name' => 'Female',
                'code' => 'F',
                'is_active' => true,
            ],
            [
                'name' => 'Non-Binary',
                'code' => 'NB',
                'is_active' => true,
            ],
            [
                'name' => 'Other',
                'code' => 'O',
                'is_active' => true,
            ],
            [
                'name' => 'Prefer Not to Say',
                'code' => 'NS',
                'is_active' => true,
            ],
        ];

        foreach ($genders as $gender) {
            Gender::updateOrCreate(
                ['code' => $gender['code']],
                [
                    'name' => $gender['name'],
                    'is_active' => $gender['is_active'],
                ]
            );
        }
    }
}
