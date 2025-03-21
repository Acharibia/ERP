<?php

namespace App\Support\Enums;

/**
 * Enum representing the different user types in the system.
 */
enum UserType: string
{
    case SYSTEM_ADMIN = 'system_admin';
    case RESELLER = 'reseller';
    case BUSINESS_USER = 'business_user';
    case INVESTOR = 'investor';
}
