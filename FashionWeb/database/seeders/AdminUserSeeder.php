<?php

// database/seeders/UserRoleSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        // Create admin user if doesn't exist
        $adminUser = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin',
                'phone' => '123456789',
                'password' => bcrypt('password123') // default password
            ]
        );

        // Assign admin role if not assigned
        if (!$adminUser->hasRole('admin')) {
            $adminUser->assignRole('admin');
        }

        // Assign 'user' role to all non-admin users
        $normalUsers = User::where('email', '!=', 'admin@example.com')->get();

        foreach ($normalUsers as $user) {
            if (!$user->hasRole('user')) {
                $user->assignRole('user');
            }
        }
    }
}

