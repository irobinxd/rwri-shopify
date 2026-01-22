<?php

namespace Database\Seeders;

use App\Models\User;
use Faker\Generator;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(Generator $faker)
    {
        // Create admin user if it doesn't exist
        $demoUser2 = User::firstOrCreate(
            ['email' => 'admin@royalstores.com'],
            [
                'firstname'         => 'Admin',
                'lastname'          => 'User',
                'password'          => Hash::make('admin123'),
                'email_verified_at' => now(),
                'is_active'         => true,
                'is_super_admin'    => true, // Super admin has access to all without restrictions
            ]
        );
        
        // Update existing admin user to be super admin if it already exists
        if ($demoUser2->wasRecentlyCreated === false) {
            $demoUser2->is_super_admin = true;
            $demoUser2->save();
        }
    }
}
