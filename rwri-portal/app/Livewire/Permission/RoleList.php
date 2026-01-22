<?php

namespace App\Livewire\Permission;

use Illuminate\Database\Eloquent\Collection;
use Livewire\Component;
use App\Models\Role;

class RoleList extends Component
{
    public array|Collection $roles;

    protected $listeners = ['success' => 'updateRoleList', 'refreshRoleList' => 'updateRoleList'];

    public function render()
    {
        // Always fetch fresh data with relationships
        $this->roles = Role::with(['menus.module', 'users'])->get();

        return view('livewire.permission.role-list');
    }

    public function updateRoleList()
    {
        // Clear any cached relationships and refresh
        $this->roles = Role::with(['menus.module', 'users'])->get();
        $this->render(); // Force re-render
    }

    public function hydrate()
    {
        $this->resetErrorBag();
        $this->resetValidation();
    }
}
