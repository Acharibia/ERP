<?php

namespace App\Central\Models;

use Illuminate\Database\Eloquent\Model;
use Stancl\Tenancy\Database\Concerns\CentralConnection;

class CentralModel extends Model
{
    use CentralConnection;
}

