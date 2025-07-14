<?php

use App\Support\Helpers\BusinessHelper;

if (!function_exists('currentBusiness')) {
    /**
     * Global helper to access current business from anywhere.
     *
     * @return \App\Central\Models\Business|null
     */
    function currentBusiness(): ?\App\Central\Models\Business
    {
        return BusinessHelper::current();
    }
}
