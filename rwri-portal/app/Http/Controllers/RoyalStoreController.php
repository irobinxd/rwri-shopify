<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RoyalStoreController extends Controller
{
    public function dashboard()
    {
        return view('pages.royal-store.dashboard');
    }

    public function jdaConnection()
    {
        return view('pages.royal-store.jda-connection');
    }

    public function shopifyPull()
    {
        return view('pages.royal-store.shopify-pull');
    }

    public function locations()
    {
        return view('pages.royal-store.locations');
    }

    public function products()
    {
        return view('pages.royal-store.products');
    }

    public function inventory()
    {
        return view('pages.royal-store.inventory');
    }

    public function prices()
    {
        return view('pages.royal-store.prices');
    }

    public function syncHistory()
    {
        return view('pages.royal-store.sync-history');
    }
}

