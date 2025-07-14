<?php

namespace App\Support\Helpers;

use App\Central\Models\Business;

class BusinessHelper
{
    /**
     * Get the currently active business from session.
     *
     * @return Business|null
     */
    public static function current(): ?Business
    {
        $active = session('active_business');

        if ($active instanceof Business) {
            return $active;
        }

        if (is_array($active)) {
            return new Business($active);
        }

        if (is_object($active) && isset($active->id)) {
            return Business::find($active->id);
        }

        return null;
    }
}
