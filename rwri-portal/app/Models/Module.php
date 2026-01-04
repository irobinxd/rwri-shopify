<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Module extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'icon',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($module) {
            if (empty($module->slug)) {
                $module->slug = Str::slug($module->name);
            }
        });
    }

    public function menus()
    {
        return $this->hasMany(Menu::class)->orderBy('order');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'module_user')
            ->withPivot(['department_id', 'location_id', 'group_id'])
            ->withTimestamps();
    }

    public function settings()
    {
        return $this->hasMany(ModuleSetting::class);
    }

    /**
     * Get a setting value by key
     */
    public function getSetting(string $key, $default = null)
    {
        $setting = $this->settings()->where('key', $key)->first();
        
        if (!$setting) {
            return $default;
        }

        if ($setting->is_encrypted) {
            return decrypt($setting->value);
        }

        if ($setting->type === 'json') {
            return json_decode($setting->value, true);
        }

        return $setting->value;
    }

    /**
     * Set a setting value
     */
    public function setSetting(string $key, $value, string $type = 'string', bool $encrypt = false, string $description = null)
    {
        if ($encrypt) {
            $value = encrypt($value);
        } elseif ($type === 'json') {
            $value = json_encode($value);
        } else {
            $value = (string) $value;
        }

        return $this->settings()->updateOrCreate(
            ['key' => $key],
            [
                'value' => $value,
                'type' => $type,
                'is_encrypted' => $encrypt,
                'description' => $description,
            ]
        );
    }
}
