<?php
namespace Database\Seeders\Tenant\HR;

use App\Tenant\HR\Models\Shift;
use Illuminate\Database\Seeder;

class ShiftSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $shifts = [
            [
                'name'          => 'Morning Shift',
                'start_time'    => '06:00:00',
                'end_time'      => '14:00:00',
                'max_employees' => 20,
                'location'      => 'Main Office',
            ],
            [
                'name'          => 'Day Shift',
                'start_time'    => '09:00:00',
                'end_time'      => '17:00:00',
                'max_employees' => 30,
                'location'      => 'Main Office',
            ],
            [
                'name'          => 'Evening Shift',
                'start_time'    => '14:00:00',
                'end_time'      => '22:00:00',
                'max_employees' => 15,
                'location'      => 'Main Office',
            ],
            [
                'name'          => 'Night Shift',
                'start_time'    => '22:00:00',
                'end_time'      => '06:00:00',
                'max_employees' => 10,
                'location'      => 'Main Office',
            ],
            [
                'name'          => 'Part Time Morning',
                'start_time'    => '09:00:00',
                'end_time'      => '13:00:00',
                'max_employees' => 8,
                'location'      => 'Main Office',
            ],
            [
                'name'          => 'Part Time Afternoon',
                'start_time'    => '13:00:00',
                'end_time'      => '17:00:00',
                'max_employees' => 8,
                'location'      => 'Main Office',
            ],
            [
                'name'          => 'Remote Shift',
                'start_time'    => '08:00:00',
                'end_time'      => '16:00:00',
                'max_employees' => null,
                'location'      => 'Remote',
            ],
        ];

        foreach ($shifts as $shiftData) {
            Shift::firstOrCreate(
                ['name' => $shiftData['name']],
                $shiftData
            );
        }

        $this->command->info('✓ Shifts seeded successfully!');
    }
}
