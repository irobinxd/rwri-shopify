<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class WebStoresController extends Controller
{
    public function dashboard()
    {
        return view('pages.web-stores.dashboard');
    }

    public function storesIndex()
    {
        return view('pages.web-stores.stores.index');
    }

    public function shopifyPullIndex()
    {
        return view('pages.web-stores.shopify-pull.index');
    }

    public function locationsIndex()
    {
        return view('pages.web-stores.locations.index');
    }

    public function categoriesIndex()
    {
        return view('pages.web-stores.categories.index');
    }

    public function productsIndex()
    {
        return view('pages.web-stores.products.index');
    }

    public function inventoryIndex()
    {
        return view('pages.web-stores.inventory.index');
    }

    public function skuMappingsIndex()
    {
        return view('pages.web-stores.sku-mappings.index');
    }

    public function syncJobsIndex()
    {
        return view('pages.web-stores.sync-jobs.index');
    }

    public function syncLogsIndex()
    {
        return view('pages.web-stores.sync-logs.index');
    }

    public function settings()
    {
        return view('pages.web-stores.settings');
    }
}


