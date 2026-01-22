<?php

namespace App\Livewire\User;

use App\Models\User;
use Livewire\Component;
use Livewire\WithFileUploads;
use Illuminate\Support\Facades\DB;
use App\Models\Role;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

class AddUserModal extends Component
{
    use WithFileUploads;

    public $user_id;
    public $name;
    public $email;
    public $role;
    public $avatar;
    public $saved_avatar;
    public $password;
    public $password_confirmation;
    public $must_change_password = false;

    public $edit_mode = false;

    protected $rules = [
        'name' => 'required|string',
        'email' => 'required|email',
        'role' => 'required|string',
        'avatar' => 'nullable|sometimes|image|max:1024',
        'password' => 'nullable|min:8|confirmed',
        'must_change_password' => 'boolean',
    ];

    protected $listeners = [
        'delete_user' => 'deleteUser',
        'update_user' => 'updateUser',
        'new_user' => 'hydrate',
    ];

    public function render()
    {
        $roles = Role::all();

        $roles_description = [
            'administrator' => 'Best for business owners and company administrators',
            'developer' => 'Best for developers or people primarily using the API',
            'analyst' => 'Best for people who need full access to analytics data, but don\'t need to update business settings',
            'support' => 'Best for employees who regularly refund payments and respond to disputes',
            'trial' => 'Best for people who need to preview content data, but don\'t need to make any updates',
        ];

        foreach ($roles as $i => $role) {
            $roles[$i]->description = $roles_description[$role->name] ?? '';
        }

        return view('livewire.user.add-user-modal', compact('roles'));
    }

    public function submit()
    {
        // Validate the form input data
        $this->validate();

        DB::transaction(function () {
            // Split name into firstname, middlename, lastname
            $nameParts = explode(' ', trim($this->name), 3);
            $firstname = $nameParts[0] ?? '';
            $middlename = $nameParts[1] ?? null;
            $lastname = $nameParts[2] ?? ($nameParts[1] ?? '');
            
            // Prepare the data for creating a new user
            $data = [
                'firstname' => $firstname,
                'middlename' => $middlename,
                'lastname' => $lastname,
                'must_change_password' => $this->must_change_password,
            ];

            if ($this->avatar) {
                $data['profile_photo_path'] = $this->avatar->store('avatars', 'public');
            } elseif (!$this->edit_mode) {
                $data['profile_photo_path'] = null;
            }

            // Handle password
            if ($this->edit_mode && $this->password) {
                // Update password if provided in edit mode
                $data['password'] = Hash::make($this->password);
            } elseif (!$this->edit_mode) {
                // Set default password for new users
                $data['password'] = Hash::make($this->email);
            }

            // Update or Create a new user record in the database
            $data['email'] = $this->email;
            $user = $this->edit_mode ? User::find($this->user_id) : User::create($data);

            if ($this->edit_mode) {
                // Update user fields
                $user->firstname = $firstname;
                $user->middlename = $middlename;
                $user->lastname = $lastname;
                $user->email = $this->email;
                $user->must_change_password = $this->must_change_password;
                
                if ($this->avatar) {
                    $user->profile_photo_path = $data['profile_photo_path'];
                }
                
                if (!empty($data['password'])) {
                    $user->password = $data['password'];
                }
                
                $user->save();
            }

            if ($this->edit_mode) {
                // Assign selected role for user
                $user->syncRoles($this->role);

                // Emit a success event with a message
                $this->dispatch('success', __('User updated'));
                $this->dispatch('refresh-users-table');
            } else {
                // Assign selected role for user
                $user->assignRole($this->role);

                // Send a password reset link to the user's email
                Password::sendResetLink($user->only('email'));

                // Emit a success event with a message
                $this->dispatch('success', __('New user created'));
            }
        });

        // Reset the form fields after successful submission
        $this->reset();
    }

    public function deleteUser($id)
    {
        // Prevent deletion of current user
        if ($id == Auth::id()) {
            $this->dispatch('error', 'User cannot be deleted');
            return;
        }

        // Delete the user record with the specified ID
        User::destroy($id);

        // Emit a success event with a message
        $this->dispatch('success', 'User successfully deleted');
    }

    public function updateUser($id)
    {
        $this->edit_mode = true;

        $user = User::find($id);

        $this->user_id = $user->id;
        $this->saved_avatar = $user->profile_photo_url;
        $this->name = $user->name; // This uses the getNameAttribute accessor
        $this->email = $user->email;
        $this->role = $user->roles?->first()->name ?? '';
        $this->must_change_password = $user->must_change_password ?? false;
        $this->password = null;
        $this->password_confirmation = null;
    }
    
    public function mount()
    {
        $this->reset();
    }
    
    public function reset(...$properties)
    {
        $this->user_id = null;
        $this->name = null;
        $this->email = null;
        $this->role = null;
        $this->avatar = null;
        $this->saved_avatar = null;
        $this->password = null;
        $this->password_confirmation = null;
        $this->must_change_password = false;
        $this->edit_mode = false;
    }

    public function hydrate()
    {
        $this->resetErrorBag();
        $this->resetValidation();
    }
}
