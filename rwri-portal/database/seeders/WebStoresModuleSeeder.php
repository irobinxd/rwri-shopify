<?php

namespace Database\Seeders;

use App\Models\Menu;
use App\Models\Module;
use Illuminate\Database\Seeder;

class WebStoresModuleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Web Stores module
        $webStoresModule = Module::updateOrCreate(
            ['slug' => 'web-stores'],
            [
                'name' => 'Web Stores',
                'icon' => 'ki-shop',
                'is_active' => true,
            ]
        );

        // Create menus for Web Stores module
        $menus = [
            [
                'name' => 'Dashboard',
                'route_name' => 'web-stores.dashboard',
                'icon' => 'ki-element-11',
                'order' => 1,
            ],
            [
                'name' => 'Stores',
                'route_name' => 'web-stores.stores.index',
                'icon' => 'ki-shop',
                'order' => 2,
            ],
            [
                'name' => 'Shopify Pull',
                'route_name' => 'web-stores.shopify-pull.index',
                'icon' => 'ki-cloud-download',
                'order' => 3,
            ],
            [
                'name' => 'Locations',
                'route_name' => 'web-stores.locations.index',
                'icon' => 'ki-geolocation',
                'order' => 4,
            ],
            [
                'name' => 'Categories',
                'route_name' => 'web-stores.categories.index',
                'icon' => 'ki-category',
                'order' => 5,
            ],
            [
                'name' => 'Products',
                'route_name' => 'web-stores.products.index',
                'icon' => 'ki-package',
                'order' => 6,
            ],
            [
                'name' => 'Inventory',
                'route_name' => 'web-stores.inventory.index',
                'icon' => 'ki-cube-2',
                'order' => 7,
            ],
            [
                'name' => 'SKU Mappings',
                'route_name' => 'web-stores.sku-mappings.index',
                'icon' => 'ki-barcode',
                'order' => 8,
            ],
            [
                'name' => 'Sync Jobs',
                'route_name' => 'web-stores.sync-jobs.index',
                'icon' => 'ki-arrows-circle',
                'order' => 9,
            ],
            [
                'name' => 'Sync Logs',
                'route_name' => 'web-stores.sync-logs.index',
                'icon' => 'ki-document',
                'order' => 10,
            ],
            [
                'name' => 'Settings',
                'route_name' => 'web-stores.settings',
                'icon' => 'ki-setting-2',
                'order' => 11,
            ],
        ];

        foreach ($menus as $menuData) {
            Menu::updateOrCreate(
                [
                    'module_id' => $webStoresModule->id,
                    'route_name' => $menuData['route_name'],
                ],
                [
                    'name' => $menuData['name'],
                    'icon' => $menuData['icon'],
                    'order' => $menuData['order'],
                ]
            );
        }

        // Create Royal Store sub-module (store-specific configuration)
        $royalStoreModule = Module::updateOrCreate(
            ['slug' => 'royal-store'],
            [
                'name' => 'Royal Store',
                'icon' => 'ki-crown',
                'is_active' => true,
            ]
        );

        // Create menus for Royal Store module
        $royalMenus = [
            [
                'name' => 'Dashboard',
                'route_name' => 'royal-store.dashboard',
                'icon' => 'ki-element-11',
                'order' => 1,
            ],
            [
                'name' => 'JDA Connection',
                'route_name' => 'royal-store.jda-connection',
                'icon' => 'ki-data',
                'order' => 2,
            ],
            [
                'name' => 'Pull Shopify Data',
                'route_name' => 'royal-store.shopify-pull',
                'icon' => 'ki-cloud-download',
                'order' => 3,
            ],
            [
                'name' => 'Location Mapping',
                'route_name' => 'royal-store.locations',
                'icon' => 'ki-geolocation',
                'order' => 4,
            ],
            [
                'name' => 'Product Sync',
                'route_name' => 'royal-store.products',
                'icon' => 'ki-package',
                'order' => 5,
            ],
            [
                'name' => 'Inventory Sync',
                'route_name' => 'royal-store.inventory',
                'icon' => 'ki-cube-2',
                'order' => 6,
            ],
            [
                'name' => 'Price Sync',
                'route_name' => 'royal-store.prices',
                'icon' => 'ki-price-tag',
                'order' => 7,
            ],
            [
                'name' => 'Sync History',
                'route_name' => 'royal-store.sync-history',
                'icon' => 'ki-time',
                'order' => 8,
            ],
        ];

        foreach ($royalMenus as $menuData) {
            Menu::updateOrCreate(
                [
                    'module_id' => $royalStoreModule->id,
                    'route_name' => $menuData['route_name'],
                ],
                [
                    'name' => $menuData['name'],
                    'icon' => $menuData['icon'],
                    'order' => $menuData['order'],
                ]
            );
        }

        // Assign modules to all users (with null department, location, group for universal access)
        $users = \App\Models\User::all();
        foreach ($users as $user) {
            // Check if user already has the module assigned
            if (!$user->modules()->where('modules.id', $webStoresModule->id)->exists()) {
                $user->modules()->attach($webStoresModule->id, [
                    'department_id' => null,
                    'location_id' => null,
                    'group_id' => null,
                ]);
            }
            
            if (!$user->modules()->where('modules.id', $royalStoreModule->id)->exists()) {
                $user->modules()->attach($royalStoreModule->id, [
                    'department_id' => null,
                    'location_id' => null,
                    'group_id' => null,
                ]);
            }
        }

        $this->command->info('Web Stores module and Royal Store sub-module seeded successfully.');
    }
}
