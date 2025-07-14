<?php

namespace Database\Seeders\Tenant\Module\Core;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
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

        // Assign permissions to roles
        $this->assignOwnerPermissions();
        $this->assignAdminPermissions();
        $this->assignManagerPermissions();
        $this->assignUserPermissions();
        $this->assignBillingManagerPermissions();
        $this->assignSupportAgentPermissions();
        $this->assignAnalystPermissions();
        $this->assignGuestPermissions();
    }

    /**
     * Assign permissions to the Owner role.
     *
     * @return void
     */
    private function assignOwnerPermissions(): void
    {
        // Owner gets all permissions
        $role = Role::findByName('owner', 'web');
        $permissions = Permission::all();
        $role->syncPermissions($permissions);
    }

    /**
     * Assign permissions to the Admin role.
     *
     * @return void
     */
    private function assignAdminPermissions(): void
    {
        $role = Role::findByName('admin', 'web');

        $permissions = [
            // Dashboard
            'view_dashboard',
            'customize_dashboard',
            'view_dashboard_widgets',
            'manage_dashboard_widgets',

            // Users
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

            // Subscription (view only)
            'view_subscription',
            'view_subscription_usage',

            // Invoices
            'view_invoices',
            'download_invoice',
            'view_payment_history',

            // Analytics
            'view_analytics',
            'export_analytics',
            'view_system_usage',
            'view_user_activity',
            'view_module_usage_stats',

            // Settings
            'view_company_profile',
            'edit_company_profile',
            'manage_company_logo',
            'view_billing_settings',
            'manage_api_keys',
            'manage_webhooks',
            'manage_notifications',
            'manage_email_templates',

            // Support
            'view_help_center',
            'create_support_ticket',
            'view_support_tickets',
            'reply_to_support_ticket',
            'close_support_ticket',
            'view_knowledge_base',
        ];

        $role->syncPermissions($permissions);
    }

    /**
     * Assign permissions to the Manager role.
     *
     * @return void
     */
    private function assignManagerPermissions(): void
    {
        $role = Role::findByName('manager', 'web');

        $permissions = [
            // Dashboard
            'view_dashboard',
            'view_dashboard_widgets',

            // Users
            'view_users',
            'create_user',
            'edit_user',
            'invite_user',
            'view_roles',
            'assign_role',
            'view_teams',
            'manage_team_members',

            // Subscription
            'view_subscription',
            'view_subscription_usage',

            // Invoices
            'view_invoices',
            'download_invoice',

            // Analytics
            'view_analytics',
            'view_user_activity',

            // Settings
            'view_company_profile',

            // Support
            'view_help_center',
            'create_support_ticket',
            'view_support_tickets',
            'reply_to_support_ticket',
            'view_knowledge_base',
        ];

        $role->syncPermissions($permissions);
    }

    /**
     * Assign permissions to the User role.
     *
     * @return void
     */
    private function assignUserPermissions(): void
    {
        $role = Role::findByName('user', 'web');

        $permissions = [
            // Dashboard
            'view_dashboard',
            'view_dashboard_widgets',

            // Limited user view
            'view_users',

            // Support
            'view_help_center',
            'create_support_ticket',
            'view_support_tickets',
            'reply_to_support_ticket',
            'view_knowledge_base',
        ];

        $role->syncPermissions($permissions);
    }

    /**
     * Assign permissions to the Billing Manager role.
     *
     * @return void
     */
    private function assignBillingManagerPermissions(): void
    {
        $role = Role::findByName('billing_manager', 'web');

        $permissions = [
            // Dashboard
            'view_dashboard',
            'view_dashboard_widgets',

            // Subscription
            'view_subscription',
            'upgrade_subscription',
            'downgrade_subscription',
            'cancel_subscription',
            'view_subscription_usage',
            'manage_subscription_payment_methods',

            // Invoices
            'view_invoices',
            'download_invoice',
            'pay_invoice',
            'view_payment_history',

            // Settings
            'view_billing_settings',
            'manage_billing_settings',
            'manage_payment_methods',
            'view_tax_information',
            'edit_tax_information',

            // Support
            'view_help_center',
            'create_support_ticket',
            'view_support_tickets',
            'reply_to_support_ticket',
            'view_knowledge_base',
        ];

        $role->syncPermissions($permissions);
    }

    /**
     * Assign permissions to the Support Agent role.
     *
     * @return void
     */
    private function assignSupportAgentPermissions(): void
    {
        $role = Role::findByName('support_agent', 'web');

        $permissions = [
            // Dashboard
            'view_dashboard',
            'view_dashboard_widgets',

            // Support
            'view_help_center',
            'create_support_ticket',
            'view_support_tickets',
            'reply_to_support_ticket',
            'close_support_ticket',
            'view_knowledge_base',
        ];

        $role->syncPermissions($permissions);
    }

    /**
     * Assign permissions to the Analyst role.
     *
     * @return void
     */
    private function assignAnalystPermissions(): void
    {
        $role = Role::findByName('analyst', 'web');

        $permissions = [
            // Dashboard
            'view_dashboard',
            'view_dashboard_widgets',

            // Analytics
            'view_analytics',
            'export_analytics',
            'view_system_usage',
            'view_user_activity',
            'view_module_usage_stats',

            // Support
            'view_help_center',
            'create_support_ticket',
            'view_knowledge_base',
        ];

        $role->syncPermissions($permissions);
    }

    /**
     * Assign permissions to the Guest role.
     *
     * @return void
     */
    private function assignGuestPermissions(): void
    {
        $role = Role::findByName('guest', 'web');

        $permissions = [
            // Very limited permissions
            'view_dashboard',
            'view_help_center',
            'view_knowledge_base',
        ];

        $role->syncPermissions($permissions);
    }
}
