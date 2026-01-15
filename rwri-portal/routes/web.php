<?php

use App\Http\Controllers\Apps\PermissionManagementController;
use App\Http\Controllers\Apps\RoleManagementController;
use App\Http\Controllers\Apps\UserManagementController;
use App\Http\Controllers\Auth\SocialiteController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\WebStoresController;
use App\Http\Controllers\RoyalStoreController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::middleware(['auth'])->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('home');

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::name('user-management.')->group(function () {
        Route::resource('/user-management/users', UserManagementController::class);
        Route::resource('/user-management/roles', RoleManagementController::class);
        Route::resource('/user-management/permissions', PermissionManagementController::class);
    });

    Route::name('modules.')->group(function () {
        Route::resource('/modules', \App\Http\Controllers\ModuleController::class);
        Route::post('/modules/{module}/settings', [\App\Http\Controllers\ModuleController::class, 'storeSetting'])->name('modules.settings.store');
        Route::put('/modules/{module}/settings/{setting}', [\App\Http\Controllers\ModuleController::class, 'updateSetting'])->name('modules.settings.update');
        Route::delete('/modules/{module}/settings/{setting}', [\App\Http\Controllers\ModuleController::class, 'destroySetting'])->name('modules.settings.destroy');
    });

    Route::name('menus.')->group(function () {
        Route::resource('/menus', \App\Http\Controllers\MenuController::class);
    });

    // Web Stores routes
    Route::name('web-stores.')->group(function () {
        Route::get('/web-stores/dashboard', [WebStoresController::class, 'dashboard'])->name('dashboard');
        Route::get('/web-stores/stores', [WebStoresController::class, 'storesIndex'])->name('stores.index');
        Route::get('/web-stores/shopify-pull', [WebStoresController::class, 'shopifyPullIndex'])->name('shopify-pull.index');
        Route::get('/web-stores/locations', [WebStoresController::class, 'locationsIndex'])->name('locations.index');
        Route::get('/web-stores/categories', [WebStoresController::class, 'categoriesIndex'])->name('categories.index');
        Route::get('/web-stores/products', [WebStoresController::class, 'productsIndex'])->name('products.index');
        Route::get('/web-stores/inventory', [WebStoresController::class, 'inventoryIndex'])->name('inventory.index');
        Route::get('/web-stores/sku-mappings', [WebStoresController::class, 'skuMappingsIndex'])->name('sku-mappings.index');
        Route::get('/web-stores/sync-jobs', [WebStoresController::class, 'syncJobsIndex'])->name('sync-jobs.index');
        Route::get('/web-stores/sync-logs', [WebStoresController::class, 'syncLogsIndex'])->name('sync-logs.index');
        Route::get('/web-stores/settings', [WebStoresController::class, 'settings'])->name('settings');
    });

    // Royal Store routes
    Route::name('royal-store.')->group(function () {
        Route::get('/royal-store/dashboard', [RoyalStoreController::class, 'dashboard'])->name('dashboard');
        Route::get('/royal-store/jda-connection', [RoyalStoreController::class, 'jdaConnection'])->name('jda-connection');
        Route::get('/royal-store/shopify-pull', [RoyalStoreController::class, 'shopifyPull'])->name('shopify-pull');
        Route::get('/royal-store/locations', [RoyalStoreController::class, 'locations'])->name('locations');
        Route::get('/royal-store/products', [RoyalStoreController::class, 'products'])->name('products');
        Route::get('/royal-store/inventory', [RoyalStoreController::class, 'inventory'])->name('inventory');
        Route::get('/royal-store/prices', [RoyalStoreController::class, 'prices'])->name('prices');
        Route::get('/royal-store/sync-history', [RoyalStoreController::class, 'syncHistory'])->name('sync-history');
        Route::get('/royal-store/settings', [RoyalStoreController::class, 'settings'])->name('settings');
        Route::post('/royal-store/settings', [RoyalStoreController::class, 'updateSettings'])->name('settings.update');
        Route::post('/royal-store/query/execute', [RoyalStoreController::class, 'executeQuery'])->name('query.execute');
        Route::get('/royal-store/query/tables', [RoyalStoreController::class, 'getTables'])->name('query.tables');
        Route::get('/royal-store/query/columns', [RoyalStoreController::class, 'getTableColumns'])->name('query.columns');
        Route::post('/royal-store/query/export', [RoyalStoreController::class, 'exportQueryResults'])->name('query.export');
    });
});

Route::get('/error', function () {
    abort(500);
});

Route::get('/auth/redirect/{provider}', [SocialiteController::class, 'redirect']);

require __DIR__ . '/auth.php';
