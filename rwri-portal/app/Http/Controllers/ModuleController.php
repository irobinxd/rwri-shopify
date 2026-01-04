<?php

namespace App\Http\Controllers;

use App\Models\Module;
use App\Models\ModuleSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ModuleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $modules = Module::with(['menus', 'settings'])->orderBy('name')->get();
        return view('pages.modules.index', compact('modules'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('pages.modules.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:modules,slug',
            'icon' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        $module = Module::create($validated);

        return redirect()->route('modules.index')
            ->with('success', 'Module created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Module $module)
    {
        $module->load(['menus', 'settings', 'users']);
        return view('pages.modules.show', compact('module'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Module $module)
    {
        $module->load('settings');
        return view('pages.modules.edit', compact('module'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Module $module)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:modules,slug,' . $module->id,
            'icon' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        $module->update($validated);

        return redirect()->route('modules.index')
            ->with('success', 'Module updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Module $module)
    {
        $module->delete();

        return redirect()->route('modules.index')
            ->with('success', 'Module deleted successfully.');
    }

    /**
     * Store a new setting for the module
     */
    public function storeSetting(Request $request, Module $module)
    {
        $validated = $request->validate([
            'key' => 'required|string|max:255|unique:module_settings,key,NULL,id,module_id,' . $module->id,
            'value' => 'nullable|string',
            'type' => 'required|in:string,json,encrypted',
            'description' => 'nullable|string',
            'is_encrypted' => 'boolean',
        ]);

        $module->setSetting(
            $validated['key'],
            $validated['value'],
            $validated['type'],
            $validated['is_encrypted'] ?? false,
            $validated['description'] ?? null
        );

        return redirect()->back()
            ->with('success', 'Setting added successfully.');
    }

    /**
     * Update a module setting
     */
    public function updateSetting(Request $request, Module $module, ModuleSetting $setting)
    {
        $validated = $request->validate([
            'value' => 'nullable|string',
            'type' => 'required|in:string,json,encrypted',
            'description' => 'nullable|string',
            'is_encrypted' => 'boolean',
        ]);

        $setting->update($validated);

        return redirect()->back()
            ->with('success', 'Setting updated successfully.');
    }

    /**
     * Delete a module setting
     */
    public function destroySetting(Module $module, ModuleSetting $setting)
    {
        $setting->delete();

        return redirect()->back()
            ->with('success', 'Setting deleted successfully.');
    }
}

