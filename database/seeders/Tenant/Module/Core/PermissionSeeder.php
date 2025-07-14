<?php

namespace Database\Seeders\Tenant\Module\Core;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions for tenant core module
        $permissions = $this->getPermissions();

        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission, 'web');
        }
    }

    /**
     * Get the list of permissions for the tenant core module.
     *
     * @return array
     */
    private function getPermissions(): array
    {
        return array_merge(
            $this->getDashboardPermissions(),
            $this->getUserPermissions(),
            $this->getSubscriptionPermissions(),
            $this->getInvoicePermissions(),
            $this->getAnalyticsPermissions(),
            $this->getSettingsPermissions(),
            $this->getSupportPermissions()
        );
    }

    /**
     * Get dashboard permissions.
     *
     * @return array
     */
    private function getDashboardPermissions(): array
    {
        return [
            'view_dashboard',
            'customize_dashboard',
            'view_dashboard_widgets',
            'manage_dashboard_widgets',
        ];
    }

    /**
     * Get user management permissions.
     *
     * @return array
     */
    private function getUserPermissions(): array
    {
        return [
            'view_users',
            'create_user',
            'edit_user',
            'delete_user',
            'invite_user',
            'manage_user_permissions',
            'view_roles',
            'create_role',
            'edit_role',
            'delete_role',
            'assign_role',
            'view_teams',
            'create_team',
            'edit_team',
            'delete_team',
            'manage_team_members',
        ];
    }

    /**
     * Get subscription management permissions.
     *
     * @return array
     */
    private function getSubscriptionPermissions(): array
    {
        return [
            'view_subscription',
            'upgrade_subscription',
            'downgrade_subscription',
            'cancel_subscription',
            'view_subscription_usage',
            'manage_subscription_payment_methods',
        ];
    }

    /**
     * Get invoice permissions.
     *
     * @return array
     */
    private function getInvoicePermissions(): array
    {
        return [
            'view_invoices',
            'download_invoice',
            'pay_invoice',
            'view_payment_history',
        ];
    }

    /**
     * Get analytics permissions.
     *
     * @return array
     */
    private function getAnalyticsPermissions(): array
    {
        return [
            'view_analytics',
            'export_analytics',
            'view_system_usage',
            'view_user_activity',
            'view_module_usage_stats',
        ];
    }

    /**
     * Get settings permissions.
     *
     * @return array
     */
    private function getSettingsPermissions(): array
    {
        return [
            'view_company_profile',
            'edit_company_profile',
            'manage_company_logo',
            'view_billing_settings',
            'manage_billing_settings',
            'manage_payment_methods',
            'view_tax_information',
            'edit_tax_information',
            'manage_api_keys',
            'manage_webhooks',
            'manage_notifications',
            'manage_email_templates',
        ];
    }

    /**
     * Get support permissions.
     *
     * @return array
     */
    private function getSupportPermissions(): array
    {
        return [
            'view_help_center',
            'create_support_ticket',
            'view_support_tickets',
            'reply_to_support_ticket',
            'close_support_ticket',
            'view_knowledge_base',
        ];
    }
}
