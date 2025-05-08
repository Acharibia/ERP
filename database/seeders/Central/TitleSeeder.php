<?php

namespace Database\Seeders\Central;

use App\Central\Models\Title;
use Illuminate\Database\Seeder;

class TitleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $titles = [
            [
                'name' => 'Doctor',
                'abbreviation' => 'Dr.',
                'is_active' => true,
            ],
            [
                'name' => 'Professor',
                'abbreviation' => 'Prof.',
                'is_active' => true,
            ],
            [
                'name' => 'Mister',
                'abbreviation' => 'Mr.',
                'is_active' => true,
            ],
            [
                'name' => 'Miss',
                'abbreviation' => 'Ms.',
                'is_active' => true,
            ],
            [
                'name' => 'Misses',
                'abbreviation' => 'Mrs.',
                'is_active' => true,
            ],
            [
                'name' => 'Master',
                'abbreviation' => 'Mr.',
                'is_active' => true,
            ],
            [
                'name' => 'Engineer',
                'abbreviation' => 'Eng.',
                'is_active' => true,
            ],
            [
                'name' => 'Advocate',
                'abbreviation' => 'Adv.',
                'is_active' => true,
            ],
            [
                'name' => 'Reverend',
                'abbreviation' => 'Rev.',
                'is_active' => true,
            ],
            [
                'name' => 'Captain',
                'abbreviation' => 'Capt.',
                'is_active' => true,
            ],
            [
                'name' => 'Lieutenant',
                'abbreviation' => 'Lt.',
                'is_active' => true,
            ],
            [
                'name' => 'Colonel',
                'abbreviation' => 'Col.',
                'is_active' => true,
            ],
            [
                'name' => 'General',
                'abbreviation' => 'Gen.',
                'is_active' => true,
            ],
            [
                'name' => 'Honorable',
                'abbreviation' => 'Hon.',
                'is_active' => true,
            ],
            [
                'name' => 'Sir',
                'abbreviation' => 'Sir',
                'is_active' => true,
            ],
            [
                'name' => 'Lady',
                'abbreviation' => 'Lady',
                'is_active' => true,
            ]
        ];

        foreach ($titles as $title) {
            Title::updateOrCreate(
                ['name' => $title['name']],
                [
                    'abbreviation' => $title['abbreviation'],
                    'is_active' => $title['is_active'],
                ]
            );
        }

        $this->command->info('Titles seeded successfully!');
    }
}
