<?php


namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use Illuminate\Database\Eloquent\Model;

class CentralExists implements Rule
{
    protected string $model;
    protected string $column;
    protected string $connection;

    /**
     * @param  class-string<Model>  $model 
     * @param  string  $column
     * @param  string|null  $connection
     */
    public function __construct(string $model, string $column = 'id', ?string $connection = null)
    {
        $this->model = $model;
        $this->column = $column;
        $this->connection = $connection ?? config('tenancy.database.central_connection', 'central');
    }

    public function passes($attribute, $value): bool
    {
        return app($this->model)
            ->setConnection($this->connection)
            ->where($this->column, $value)
            ->exists();
    }

    public function message(): string
    {
        return 'The selected :attribute is invalid.';
    }
}
