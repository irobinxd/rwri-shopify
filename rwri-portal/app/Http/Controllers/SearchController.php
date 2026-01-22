<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\Module;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

class SearchController extends Controller
{
    /**
     * Search for menus and content
     */
    public function search(Request $request)
    {
        $query = $request->get('q', '');
        $query = trim($query);

        if (strlen($query) < 2) {
            return response()->json([
                'success' => true,
                'results' => [],
                'menus' => [],
            ]);
        }

        $user = auth()->user();
        $results = [
            'menus' => [],
            'products' => [],
            'users' => [],
        ];

        // Search menus
        $menus = Menu::where('name', 'LIKE', "%{$query}%")
            ->with('module')
            ->get()
            ->filter(function ($menu) use ($user) {
                // Super admins have access to all menus
                if ($user->is_super_admin) {
                    return true;
                }
                // Check if user has access to this menu's module
                return $user->modules()->where('modules.id', $menu->module_id)->exists();
            })
            ->map(function ($menu) {
                $route = null;
                try {
                    if (Route::has($menu->route_name)) {
                        $route = route($menu->route_name);
                    }
                } catch (\Exception $e) {
                    // Route doesn't exist
                }

                return [
                    'id' => $menu->id,
                    'name' => $menu->name,
                    'icon' => $menu->icon,
                    'module' => $menu->module->name ?? 'Unknown',
                    'route' => $route,
                    'type' => 'menu',
                ];
            })
            ->values();

        $results['menus'] = $menus;

        // Search products (if user has access to Royal Store or Web Stores)
        $hasProductAccess = $user->is_super_admin || $user->modules()
            ->whereIn('modules.slug', ['royal-store', 'web-stores'])
            ->exists();

        if ($hasProductAccess) {
            // Search in shopify_products
            $products = DB::table('shopify_products')
                ->where('title', 'LIKE', "%{$query}%")
                ->orWhere('handle', 'LIKE', "%{$query}%")
                ->orWhere('vendor', 'LIKE', "%{$query}%")
                ->orWhere('product_type', 'LIKE', "%{$query}%")
                ->select('id', 'shopify_product_id', 'title', 'handle', 'vendor', 'product_type')
                ->limit(5)
                ->get()
                ->map(function ($product) {
                    return [
                        'id' => $product->id,
                        'name' => $product->title,
                        'subtitle' => ($product->vendor ? $product->vendor . ' • ' : '') . ($product->product_type ?? 'Product'),
                        'route' => route('royal-store.products') . '?search=' . urlencode($product->title),
                        'type' => 'product',
                    ];
                });

            $results['products'] = $products;

            // Search in jda_skus_staging
            $skus = DB::table('jda_skus_staging')
                ->where('sku', 'LIKE', "%{$query}%")
                ->orWhere('product_name', 'LIKE', "%{$query}%")
                ->select('id', 'sku', 'product_name', 'price')
                ->limit(5)
                ->get()
                ->map(function ($sku) {
                    return [
                        'id' => $sku->id,
                        'name' => $sku->product_name ?? $sku->sku,
                        'subtitle' => 'SKU: ' . $sku->sku . ($sku->price ? ' • $' . number_format($sku->price, 2) : ''),
                        'route' => route('royal-store.products') . '?search=' . urlencode($sku->sku),
                        'type' => 'sku',
                    ];
                });

            $results['skus'] = $skus;
        }

        // Search users (if user has access to User Management)
        $hasUserManagementAccess = $user->is_super_admin || $user->modules()
            ->where('modules.slug', 'user-management')
            ->exists();

        if ($hasUserManagementAccess) {
            $users = User::where('name', 'LIKE', "%{$query}%")
                ->orWhere('email', 'LIKE', "%{$query}%")
                ->select('id', 'name', 'email')
                ->limit(5)
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'subtitle' => $user->email,
                        'route' => route('user-management.users.show', $user->id),
                        'type' => 'user',
                    ];
                });

            $results['users'] = $users;
        }

        return response()->json([
            'success' => true,
            'query' => $query,
            'results' => $results,
        ]);
    }
}
