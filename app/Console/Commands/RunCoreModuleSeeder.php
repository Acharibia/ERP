<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Stancl\Tenancy\Tenancy;
use App\Central\Models\Tenant;


class RunCoreModuleSeeder extends Command
{
    protected $signature = 'tenants:seed-core-module';
    protected $description = 'Runs the CoreModule seeders for all tenants';

    public function handle()
    {
        // Get all tenants directly from the Tenant model
        $tenants = Tenant::query()->get();

        $this->info("Found " . count($tenants) . " tenants.");

        // Get the tenancy service
        $tenancy = app(Tenancy::class);

        foreach ($tenants as $tenant) {
            $this->info("Running Core Module seeders for tenant: " . $tenant->id);
            $this->runCoreModuleSeeders($tenant, $tenancy);
        }

        $this->info("CoreModule seeders completed for all tenants.");

        return 0;
    }

    private function runCoreModuleSeeders(Tenant $tenant, Tenancy $tenancy): void
    {
        try {
            $tenant->update(["status" => "Running CoreModule seeders"]);

            // Initialize the tenant context
            $tenancy->initialize($tenant);

            // Run the seeder in the tenant context
            $seeder = new \Database\Seeders\Module\Core\CoreSeeder();
            $seeder->run();

            // End the tenant context
            $tenancy->end();

            $tenant->update(["status" => "Done running CoreModule seeders"]);

            Log::info("Completed Core Module seeders", [
                'tenant_id' => $tenant->id
            ]);
        } catch (\Exception $e) {
            Log::error("Failed to run Core Module seeders", [
                'tenant_id' => $tenant->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            $this->error("Error for tenant {$tenant->id}: {$e->getMessage()}");
        }
    }
}
