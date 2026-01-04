<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    use HasFactory;

    protected $fillable = [
        'module_id',
        'name',
        'route_name',
        'icon',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'menu_user')
            ->withPivot(['department_id', 'location_id', 'group_id'])
            ->withTimestamps();
    }
}
