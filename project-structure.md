app/
│
├── Admin/ # Admin-specific code
│ ├── Controllers/
│ │ ├── BusinessController.php # Manage businesses
│ │ ├── ResellerController.php # Manage resellers
│ │ ├── ModuleController.php # Manage modules
│ │ └── DashboardController.php # Admin dashboard
│ │
│ ├── Requests/ # Request validation for admin actions
│ │ ├── StoreBusinessRequest.php
│ │ └── BusinessUpdateRequest.php
│ │
│ └── Services/ # Business logic for admin operations
│ ├── BusinessService.php
│ └── ResellerService.php
│
├── Reseller/ # Reseller-specific code
│ ├── Controllers/
│ │ ├── ClientController.php # Manage clients (businesses)
│ │ ├── SubscriptionController.php # Manage client subscriptions
│ │ └── InvoiceController.php # Manage invoices
│ │
│ ├── Requests/
│ └── Services/
│
├── Business/ # Business user-specific code
│ ├── Controllers/
│ │ ├── UserController.php # Manage business users
│ │ ├── SettingsController.php # Business settings
│ │ └── SubscriptionController.php # View/manage subscription
│ │
│ ├── Requests/
│ └── Services/
│
├── Shared/ # Shared functionality
│ ├── Controllers/
│ │ ├── AuthController.php # Authentication
│ │ ├── UserProfileController.php # User profile management
│ │ └── MediaController.php # File uploads
│ │
│ ├── Requests/
│ ├── Services/
│ │ ├── AuthService.php
│ │ └── NotificationService.php
│ │
│ ├── Traits/
│ │ ├── HasAuditLog.php
│ │ └── HasPermissions.php
│ │
│ └── Middleware/
│ ├── IdentifyTenant.php
│ ├── HandleInertiaRequests.php # Inertia middleware
│ └── CheckModuleAccess.php
│
├── Modules/ # Business modules as independent domains
│ ├── Core/ # Core tenant functionality
│ │ ├── Controllers/
│ │ ├── Requests/
│ │ ├── Services/
│ │ └── Models/
│ │ ├── TenantSetting.php
│ │ └── TenantAuditLog.php
│ │
│ ├── HR/ # HR module
│ │ ├── Controllers/
│ │ │ ├── EmployeeController.php
│ │ │ └── DepartmentController.php
│ │ ├── Requests/
│ │ ├── Services/
│ │ └── Models/
│ │ ├── Employee.php
│ │ └── Department.php
│ │
│ ├── Inventory/ # Inventory module
│ │ ├── Controllers/
│ │ ├── Requests/
│ │ ├── Services/
│ │ └── Models/
│ │
│ ├── CRM/ # CRM module
│ │ ├── Controllers/
│ │ ├── Requests/
│ │ ├── Services/
│ │ └── Models/
│ │
│ └── Accounting/ # Accounting module
│ ├── Controllers/
│ ├── Requests/
│ ├── Services/
│ └── Models/
│
├── Models/ # Core data models
│ ├── Admin/
│ │ └── SystemSetting.php
│ ├── Reseller/
│ │ └── ResellerSetting.php
│ ├── Business/
│ │ └── BusinessSetting.php
│ └── Shared/
│ ├── User.php
│ ├── Business.php # Tenant model
│ ├── Reseller.php
│ ├── Subscription.php
│ └── Module.php
│
├── Support/ # Support classes
│ ├── Helpers/
│ │ ├── TenantHelper.php
│ │ └── FileHelper.php
│ └── Enums/
│ ├── UserType.php
│ └── SubscriptionStatus.php
│
└── Http/ # Standard Laravel Http folder
├── Kernel.php
├── Resources/ # API resources for external API endpoints
└── ...

resources/
│
├── js/ # React/Inertia frontend code
│ ├── Pages/ # Inertia page components
│ │ ├── Admin/ # Admin pages
│ │ │ ├── Businesses/
│ │ │ │ ├── Index.jsx
│ │ │ │ ├── Create.jsx
│ │ │ │ ├── Edit.jsx
│ │ │ │ └── Show.jsx
│ │ │ ├── Resellers/
│ │ │ ├── Modules/
│ │ │ └── Dashboard.jsx
│ │ │
│ │ ├── Reseller/ # Reseller pages
│ │ │ ├── Clients/
│ │ │ ├── Subscriptions/
│ │ │ └── Dashboard.jsx
│ │ │
│ │ ├── Business/ # Business pages
│ │ │ ├── Users/
│ │ │ ├── Settings/
│ │ │ └── Dashboard.jsx
│ │ │
│ │ ├── Modules/ # Module pages (renamed from Tenant)
│ │ │ ├── HR/
│ │ │ │ ├── Employees/
│ │ │ │ │ ├── Index.jsx
│ │ │ │ │ ├── Create.jsx
│ │ │ │ │ ├── Edit.jsx
│ │ │ │ │ └── Show.jsx
│ │ │ │ └── Departments/
│ │ │ ├── Inventory/
│ │ │ ├── CRM/
│ │ │ └── Accounting/
│ │ │
│ │ └── Auth/ # Auth pages
│ │ ├── Login.jsx
│ │ ├── Register.jsx
│ │ └── ForgotPassword.jsx
│ │
│ ├── Components/ # Shared React components
│ │ ├── Layout/
│ │ │ ├── AppLayout.jsx
│ │ │ ├── AdminSidebar.jsx
│ │ │ ├── ResellerSidebar.jsx
│ │ │ ├── BusinessSidebar.jsx
│ │ │ └── ModuleSidebar.jsx # Module navigation sidebar
│ │ │
│ │ ├── UI/ # UI components
│ │ │ ├── Button.jsx
│ │ │ ├── Card.jsx
│ │ │ └── Table.jsx
│ │ │
│ │ └── Forms/ # Form components
│ │ ├── InputField.jsx
│ │ └── SelectField.jsx
│ │
│ ├── Hooks/ # Custom React hooks
│ │ ├── useAuth.js
│ │ ├── useTenant.js
│ │ └── useModuleAccess.js # Hook to check module access
│ │
│ ├── Utils/ # Utility functions
│ │ ├── formatters.js
│ │ └── validators.js
│ │
│ └── app.jsx # Main entry point
│
├── css/ # CSS styles
│ └── app.css
│
└── views/
└── app.blade.php # Main blade template for Inertia

database/
├── migrations/
│ ├── 2023_01_01_000000_create_users_table.php
│ ├── 2023_01_01_000001_create_businesses_table.php
│ └── ...
├── migrations/tenant/ # Tenant migrations
│ ├── 2023_01_01_000000_create_tenant_settings_table.php
│ ├── modules/ # Organized by module
│ │ ├── hr/
│ │ │ ├── 2023_01_01_000001_create_employees_table.php
│ │ │ └── 2023_01_01_000002_create_departments_table.php
│ │ ├── inventory/
│ │ ├── crm/
│ │ └── accounting/
│ └── ...
└── seeders/
├── admin/
├── reseller/
├── business/
├── shared/
└── modules/ # Organized by module
├── core/
├── hr/
├── inventory/
├── crm/
└── accounting/

routes/
├── web.php # Main web routes file for Inertia
├── api.php # For external API endpoints
├── modules.php # Module routes (renamed from tenant.php)
└── channels.php # Broadcasting channels

public/
├── build/ # Compiled assets
├── js/
├── css/
└── images/
