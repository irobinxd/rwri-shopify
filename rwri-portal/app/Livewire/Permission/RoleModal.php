<?php

namespace App\Livewire\Permission;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;
use Livewire\Component;
use App\Models\Role;
use App\Models\Menu;
use Spatie\Permission\Models\Permission;

class RoleModal extends Component
{
    public $name;
    public $checked_permissions;
    public $check_all;
    public $checked_menus;

    public Role $role;
    public Collection $permissions;
    public Collection $menus;

    protected $rules = [
        'name' => 'required|string',
    ];

    // This is the list of listeners that this component listens to.
    protected $listeners = ['modal.show.role_id' => 'mountRole', 'modal.show.role_name' => 'mountRole'];

    // This function is called when the component receives the `modal.show.role_id` or `modal.show.role_name` event.
    public function mountRole($role_identifier = '')
    {
        if (empty($role_identifier)) {
            // Create new
            $this->role = new Role;
            $this->name = '';
            $this->checked_permissions = [];
            $this->checked_menus = [];
            $this->check_all = false;
            return;
        }

        // Try to get role by ID first, then by name
        if (is_numeric($role_identifier)) {
            $role = Role::where('id', $role_identifier)->with(['permissions', 'menus'])->first();
        } else {
            $role = Role::where('name', $role_identifier)->with(['permissions', 'menus'])->first();
        }
        
        if (is_null($role)) {
            $this->dispatch('error', 'The selected role is not found');
            return;
        }

        $this->role = $role;

        // Set the name and checked permissions properties to the role's values.
        $this->name = $this->role->name;
        $this->checked_permissions = $this->role->permissions->pluck('name')->toArray();
        $this->checked_menus = $this->role->menus->pluck('id')->toArray();
        
        // Set check_all based on whether all permissions are checked
        $allPermissionNames = $this->permissions->pluck('name')->toArray();
        $this->check_all = !empty($allPermissionNames) && count($this->checked_permissions) === count($allPermissionNames) && 
                          empty(array_diff($allPermissionNames, $this->checked_permissions));
        
        // If check_all is true, ensure all permissions are checked
        if ($this->check_all) {
            $this->checked_permissions = $allPermissionNames;
        }
    }

    // This function is called when the component is mounted.
    public function mount()
    {
        // Get all permissions.
        $this->permissions = Permission::all();
        
        // Get all menus grouped by module
        $this->menus = Menu::with('module')->orderBy('module_id')->orderBy('order')->get();

        // Set the checked permissions and menus properties to empty arrays.
        $this->checked_permissions = [];
        $this->checked_menus = [];
        $this->check_all = false;
    }
    
    // This function is called when check_all is updated
    public function updatedCheckAll()
    {
        // If the check_all property is true, set the checked permissions property to all of the permissions.
        if ($this->check_all) {
            $this->checked_permissions = $this->permissions->pluck('name')->toArray();
            // Also check all menus
            $this->checked_menus = $this->menus->pluck('id')->toArray();
        } else {
            // When unchecked, keep current selections but don't clear them
            // User can manually uncheck if needed
        }
    }

    // This function renders the component's view.
    public function render()
    {
        // Create an array of permissions grouped by ability.
        $permissions_by_group = [];
        foreach ($this->permissions ?? [] as $permission) {
            $ability = Str::after($permission->name, ' ');

            $permissions_by_group[$ability][] = $permission;
        }
        
        // Group menus by module - keep as collection for easier manipulation
        $menus_by_module = [];
        foreach ($this->menus ?? [] as $menu) {
            $moduleName = $menu->module ? $menu->module->name : 'Other';
            if (!isset($menus_by_module[$moduleName])) {
                $menus_by_module[$moduleName] = collect([]);
            }
            $menus_by_module[$moduleName]->push($menu);
        }

        // Return the view with the permissions_by_group and menus_by_module variables passed in.
        return view('livewire.permission.role-modal', compact('permissions_by_group', 'menus_by_module'));
    }

    // This function submits the form and updates the role's permissions.
    public function submit()
    {
        $this->validate();

        // Create or update role
        if ($this->role->exists) {
            $this->role->name = $this->name;
            if ($this->role->isDirty()) {
                $this->role->save();
            }
        } else {
            // Create new role
            $this->role = Role::create(['name' => $this->name, 'guard_name' => 'web']);
        }

        // Sync the role's permissions with the checked permissions property.
        $permissionsToSync = $this->checked_permissions ?? [];
        $this->role->syncPermissions($permissionsToSync);
        
        // Sync the role's menus
        $this->role->menus()->sync($this->checked_menus ?? []);
        
        // Clear the role's relationship cache and reload
        $this->role->unsetRelation('permissions');
        $this->role->unsetRelation('menus');
        $this->role->load(['permissions', 'menus']);

        // Emit a success event with a message indicating that the permissions have been updated.
        $this->dispatch('success', 'Role ' . ucwords($this->role->name) . ' saved successfully');
        
        // Refresh the role list
        $this->dispatch('refreshRoleList');
    }
    
    // Update check_all when permissions change
    public function updatedCheckedPermissions()
    {
        $allPermissionNames = $this->permissions->pluck('name')->toArray();
        $this->check_all = !empty($allPermissionNames) && 
                          count($this->checked_permissions) === count($allPermissionNames) && 
                          empty(array_diff($allPermissionNames, $this->checked_permissions));
    }

    public function hydrate()
    {
        $this->resetErrorBag();
        $this->resetValidation();
    }
}
