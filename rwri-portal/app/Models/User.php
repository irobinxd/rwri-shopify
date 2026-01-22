<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;
    use HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'firstname',
        'middlename',
        'lastname',
        'email',
        'password',
        'department_id',
        'location_id',
        'group_id',
        'is_active',
        'is_super_admin',
        'must_change_password',
        'created_by',
        'updated_by',
        'last_login_at',
        'last_login_ip',
        'profile_photo_path',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login_at' => 'datetime',
        'is_active' => 'boolean',
        'is_super_admin' => 'boolean',
        'must_change_password' => 'boolean',
    ];

    /**
     * Get the user's full name
     */
    public function getNameAttribute()
    {
        $name = trim($this->firstname . ' ' . ($this->middlename ? $this->middlename . ' ' : '') . $this->lastname);
        return $name ?: $this->email;
    }

    /**
     * Get the user's full name
     */
    public function getFullNameAttribute()
    {
        return $this->name;
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function modules()
    {
        return $this->belongsToMany(Module::class, 'module_user')
            ->withPivot(['department_id', 'location_id', 'group_id'])
            ->withTimestamps();
    }

    public function menus()
    {
        return $this->belongsToMany(Menu::class, 'menu_user')
            ->withPivot(['department_id', 'location_id', 'group_id'])
            ->withTimestamps();
    }

    /**
     * Get accessible modules for this user based on their department, location, and group
     * Super admins have access to all modules
     */
    public function getAccessibleModules()
    {
        // Super admins have access to all active modules
        if ($this->is_super_admin) {
            return \App\Models\Module::where('is_active', true)
                ->orderBy('name')
                ->get();
        }
        
        return $this->modules()
            ->where('modules.is_active', true)
            ->where(function ($query) {
                $query->whereNull('module_user.department_id')
                    ->orWhere('module_user.department_id', $this->department_id);
            })
            ->where(function ($query) {
                $query->whereNull('module_user.location_id')
                    ->orWhere('module_user.location_id', $this->location_id);
            })
            ->where(function ($query) {
                $query->whereNull('module_user.group_id')
                    ->orWhere('module_user.group_id', $this->group_id);
            })
            ->orderBy('modules.name')
            ->get();
    }

    /**
     * Get accessible menus for this user based on:
     * 1. Super admin - all menus
     * 2. Role-based menu access
     * 3. Direct user-menu assignments with scoping
     * 4. Module-based access (if no specific restrictions)
     */
    public function getAccessibleMenus()
    {
        // Super admins have access to all menus
        if ($this->is_super_admin) {
            return Menu::with('module')
                ->orderBy('module_id')
                ->orderBy('order')
                ->get();
        }
        
        $moduleIds = $this->getAccessibleModules()->pluck('id');

        if ($moduleIds->isEmpty()) {
            return collect();
        }

        // Get menus from user's roles
        $roleMenuIds = collect();
        foreach ($this->roles as $role) {
            $roleMenuIds = $roleMenuIds->merge($role->menus->pluck('id'));
        }
        $roleMenuIds = $roleMenuIds->unique();

        return Menu::whereIn('module_id', $moduleIds)
            ->where(function ($query) use ($moduleIds, $roleMenuIds) {
                // Menus from user's roles
                if ($roleMenuIds->isNotEmpty()) {
                    $query->whereIn('id', $roleMenuIds);
                }
                
                // OR menus assigned directly to user with proper scoping
                $query->orWhereHas('users', function ($q) {
                    $q->where('menu_user.user_id', $this->id)
                        ->where(function ($subQ) {
                            $subQ->whereNull('menu_user.department_id')
                                ->orWhere('menu_user.department_id', $this->department_id);
                        })
                        ->where(function ($subQ) {
                            $subQ->whereNull('menu_user.location_id')
                                ->orWhere('menu_user.location_id', $this->location_id);
                        })
                        ->where(function ($subQ) {
                            $subQ->whereNull('menu_user.group_id')
                                ->orWhere('menu_user.group_id', $this->group_id);
                        });
                });
                
                // OR if no role menus and no direct assignments, show all menus from accessible modules
                // (only if user has no role-based restrictions)
                if ($roleMenuIds->isEmpty() && !$this->menus()->exists()) {
                    $query->orWhereIn('module_id', $moduleIds);
                }
            })
            ->orderBy('module_id')
            ->orderBy('order')
            ->get();
    }

    public function getProfilePhotoUrlAttribute()
    {
        if ($this->profile_photo_path) {
            return asset('storage/' . $this->profile_photo_path);
        }

        return $this->profile_photo_path;
    }

    public function addresses()
    {
        return $this->hasMany(Address::class);
    }

    public function getDefaultAddressAttribute()
    {
        return $this->addresses?->first();
    }

    /**
     * Override Spatie's hasPermissionTo to allow super admins to bypass all permission checks
     */
    public function hasPermissionTo($permission, $guardName = null): bool
    {
        // Super admins have all permissions
        if ($this->is_super_admin) {
            return true;
        }
        
        return parent::hasPermissionTo($permission, $guardName);
    }

    /**
     * Override Spatie's hasAnyPermission to allow super admins to bypass all permission checks
     */
    public function hasAnyPermission(...$permissions): bool
    {
        // Super admins have all permissions
        if ($this->is_super_admin) {
            return true;
        }
        
        return parent::hasAnyPermission(...$permissions);
    }

    /**
     * Override Spatie's hasAllPermissions to allow super admins to bypass all permission checks
     */
    public function hasAllPermissions(...$permissions): bool
    {
        // Super admins have all permissions
        if ($this->is_super_admin) {
            return true;
        }
        
        return parent::hasAllPermissions(...$permissions);
    }
}
