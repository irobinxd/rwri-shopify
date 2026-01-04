<?php

use App\Http\Controllers\Apps\PermissionManagementController;
use App\Http\Controllers\Apps\RoleManagementController;
use App\Http\Controllers\Apps\UserManagementController;
use App\Http\Controllers\Auth\SocialiteController;
use App\Http\Controllers\DashboardController;
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
});

Route::get('/error', function () {
    abort(500);
});

Route::get('/auth/redirect/{provider}', [SocialiteController::class, 'redirect']);

require __DIR__ . '/auth.php';
