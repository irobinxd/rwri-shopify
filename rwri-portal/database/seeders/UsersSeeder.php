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
        // Create demo user if it doesn't exist
        $demoUser = User::firstOrCreate(
            ['email' => 'demo@demo.com'],
            [
                'firstname'         => 'Demo',
                'lastname'          => 'User',
                'password'          => Hash::make('demo'),
                'email_verified_at' => now(),
                'is_active'         => true,
            ]
        );

        // Create admin user if it doesn't exist
        $demoUser2 = User::firstOrCreate(
            ['email' => 'admin@royalstores.com'],
            [
                'firstname'         => 'Admin',
                'lastname'          => 'User',
                'password'          => Hash::make('admin123'),
                'email_verified_at' => now(),
                'is_active'         => true,
            ]
        );
    }
}
