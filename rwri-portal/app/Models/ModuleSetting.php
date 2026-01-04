<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModuleSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'module_id',
        'key',
        'value',
        'type',
        'description',
        'is_encrypted',
    ];

    protected $casts = [
        'is_encrypted' => 'boolean',
    ];

    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    /**
     * Get the decrypted value if encrypted
     */
    public function getDecryptedValueAttribute()
    {
        if ($this->is_encrypted) {
            return decrypt($this->value);
        }

        if ($this->type === 'json') {
            return json_decode($this->value, true);
        }

        return $this->value;
    }
}
