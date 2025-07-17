<?php
namespace Database\Seeders\Tenant\Module\HR;

use App\Tenant\Modules\HR\Models\Shift;
use Illuminate\Database\Seeder;

class ShiftSeeder extends Seeder
{
    public function run(): void
    {
        $shifts = [
            [
                'name'          => 'Morning',
                'start_time'    => '08:00:00',
                'end_time'      => '16:00:00',
                'max_employees' => 20,
                'location'      => 'Main Office',
            ],
            [
                'name'          => 'Afternoon',
                'start_time'    => '16:00:00',
                'end_time'      => '00:00:00',
                'max_employees' => 15,
                'location'      => 'Main Office',
            ],
            [
                'name'          => 'Night',
                'start_time'    => '00:00:00',
                'end_time'      => '08:00:00',
                'max_employees' => 10,
                'location'      => 'Main Office',
            ],
        ];

        foreach ($shifts as $shift) {
            Shift::updateOrCreate(
                ['name' => $shift['name']], // Unique key
                $shift
            );
        }
    }
}
