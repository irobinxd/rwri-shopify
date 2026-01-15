<?php

namespace App\Http\Controllers;

use App\Models\Module;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

    public function settings()
    {
        $module = Module::where('slug', 'royal-store')->first();
        
        if (!$module) {
            abort(404, 'Royal Store module not found');
        }

        $module->load('settings');
        
        // Get all settings grouped by category
        $settings = [
            'shopify' => [],
            'connections' => [],
        ];

        foreach ($module->settings as $setting) {
            if (str_starts_with($setting->key, 'shopify.')) {
                $settings['shopify'][str_replace('shopify.', '', $setting->key)] = $setting;
            } elseif (str_starts_with($setting->key, 'jda.')) {
                $settings['connections'][str_replace('jda.', '', $setting->key)] = $setting;
            }
        }

        return view('pages.royal-store.settings', compact('module', 'settings'));
    }

    public function updateSettings(Request $request)
    {
        $module = Module::where('slug', 'royal-store')->first();
        
        if (!$module) {
            if ($request->ajax() || $request->wantsJson()) {
                return response()->json(['success' => false, 'message' => 'Royal Store module not found'], 404);
            }
            return redirect()->back()->with('error', 'Royal Store module not found');
        }

        // Handle test connection request
        if ($request->has('test_connection') && $request->test_connection) {
            return $this->testJdaConnection($request);
        }

        // Get active tab to determine which settings to save
        $activeTab = $request->input('active_tab', 'shopify');
        
        // Only validate and save settings from the active tab
        if ($activeTab === 'shopify') {
            $validated = $request->validate([
                'shopify.*' => 'nullable|string',
            ]);

            // If API version is empty, don't save it (use auto-detect)
            if (isset($validated['shopify']['api_version']) && empty($validated['shopify']['api_version'])) {
                unset($validated['shopify']['api_version']);
                // Remove existing api_version setting if it exists
                $module->settings()->where('key', 'shopify.api_version')->delete();
            }

            // Save Shopify settings (encrypt sensitive data)
            if (isset($validated['shopify'])) {
                $sensitiveKeys = ['api_key', 'api_secret'];
                
                foreach ($validated['shopify'] as $key => $value) {
                    $isEncrypted = in_array($key, $sensitiveKeys);
                    $module->setSetting(
                        "shopify.{$key}",
                        $value ?? '',
                        'string',
                        $isEncrypted,
                        "Shopify setting: {$key}"
                    );
                }
            }
        } elseif ($activeTab === 'connections') {
            $connectionMethod = $request->input('jda.connection_method', 'dsn');
            
            // Common validation rules (schema is required for both methods)
            $validationRules = [
                'jda.connection_method' => 'required|string|in:dsn,connection_string',
                'jda.schema' => 'required|string|max:255',
                'jda.timeout' => 'nullable|numeric',
            ];
            
            // Add method-specific validation rules
            if ($connectionMethod === 'dsn') {
                $validationRules['jda.dsn'] = 'required|string|max:255';
                $validationRules['jda.username'] = 'required|string|max:255';
                $validationRules['jda.password'] = 'nullable|string|max:255';
            } else {
                $validationRules['jda.connection_string'] = 'required|string|max:2000';
            }
            
            $validated = $request->validate($validationRules);

            // Save connection method (common for both)
            $module->setSetting(
                "jda.connection_method",
                $validated['jda']['connection_method'],
                'string',
                false,
                "JDA connection method"
            );
            
            // Save schema (common for both methods)
            $module->setSetting(
                "jda.schema",
                $validated['jda']['schema'],
                'string',
                false,
                "JDA default database schema"
            );
            
            // Save timeout if provided (common for both)
            if (isset($validated['jda']['timeout'])) {
                $module->setSetting(
                    "jda.timeout",
                    $validated['jda']['timeout'],
                    'string',
                    false,
                    "JDA connection timeout"
                );
            }
            
            // Save method-specific settings
            if ($connectionMethod === 'dsn') {
                // Save DSN connection settings (encrypt sensitive data)
                $sensitiveKeys = ['password', 'username', 'dsn'];
                
                foreach (['dsn', 'username', 'password'] as $key) {
                    if (isset($validated['jda'][$key])) {
                        $isEncrypted = in_array($key, $sensitiveKeys);
                        $module->setSetting(
                            "jda.{$key}",
                            $validated['jda'][$key] ?? '',
                            'string',
                            $isEncrypted,
                            "JDA connection setting: {$key}"
                        );
                    }
                }
            } else {
                // Save connection string (encrypt as it contains credentials)
                $module->setSetting(
                    "jda.connection_string",
                    $validated['jda']['connection_string'],
                    'string',
                    true,
                    "JDA ODBC connection string"
                );
            }
        }

        // Check if request is AJAX (has X-Requested-With header)
        if ($request->ajax() || $request->wantsJson() || $request->header('X-Requested-With') === 'XMLHttpRequest') {
            return response()->json([
                'success' => true, 
                'message' => 'Settings updated successfully.',
                'active_tab' => $activeTab
            ]);
        }

        return redirect()->back()->with('success', 'Settings updated successfully.');
    }

    private function testJdaConnection(Request $request)
    {
        try {
            $jda = $request->input('jda', []);
            $connectionMethod = $jda['connection_method'] ?? 'dsn';
            
            if ($connectionMethod === 'dsn') {
                // Validate DSN method
                if (empty($jda['dsn']) || empty($jda['username'])) {
                    return response()->json([
                        'success' => false,
                        'message' => 'DSN Name and Username are required'
                    ], 400);
                }
                
                // Build ODBC DSN connection string
                // For DSN connections, use format: odbc:DSN_NAME
                // Note: Make sure PHP architecture (32/64-bit) matches the ODBC driver architecture
                $dsn = "odbc:" . trim($jda['dsn']);
                $username = $jda['username'] ?? '';
                $password = $jda['password'] ?? '';
                
            } else {
                // Validate connection string method
                if (empty($jda['connection_string'])) {
                    return response()->json([
                        'success' => false,
                        'message' => 'ODBC Connection String is required'
                    ], 400);
                }
                
                // For PDO ODBC, the connection string should include all parameters including UID and PWD
                // Format: odbc:DRIVER={...};DATABASE=...;HOSTNAME=...;PORT=...;PROTOCOL=...;UID=...;PWD=...;
                $connectionString = $jda['connection_string'];
                
                // Ensure the connection string ends with semicolon
                if (!str_ends_with(trim($connectionString), ';')) {
                    $connectionString .= ';';
                }
                
                // Prefix with odbc: for PDO ODBC driver
                $dsn = 'odbc:' . $connectionString;
                
                // For ODBC connection strings, username and password are typically in the connection string
                // But we can also pass them separately if needed (PDO will use connection string values if both are provided)
                $username = null;
                $password = null;
            }
            
            // Test connection with timeout
            set_time_limit((int)($jda['timeout'] ?? '30') + 5);
            
            $startTime = microtime(true);
            
            // Create PDO connection directly for ODBC
            // For DSN: odbc:DSN_NAME
            // For connection string: odbc:DRIVER={...};DATABASE=...;HOSTNAME=...;PORT=...;PROTOCOL=...;
            $pdo = new \PDO(
                $dsn,
                $username,
                $password,
                [
                    \PDO::ATTR_TIMEOUT => (int)($jda['timeout'] ?? '30'),
                    \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
                ]
            );
            
            $connectionTime = round((microtime(true) - $startTime) * 1000, 2);
            
            // Try a simple query to verify the connection works (DB2 specific)
            try {
                $stmt = $pdo->query('SELECT 1 as test FROM SYSIBM.SYSDUMMY1');
                $result = $stmt->fetch(\PDO::FETCH_ASSOC);
            } catch (\Exception $e) {
                // For DB2, try alternative test query
                try {
                    $stmt = $pdo->query('VALUES 1');
                    $result = $stmt->fetch(\PDO::FETCH_ASSOC);
                } catch (\Exception $e2) {
                    // If SELECT fails, connection might still be valid but database might have issues
                    // We'll still consider it a successful connection if PDO was created
                }
            }
            
            return response()->json([
                'success' => true,
                'message' => "Connection successful! Connected in {$connectionTime}ms"
            ]);

        } catch (\PDOException $e) {
            $errorMessage = $e->getMessage();
            
            // Provide more user-friendly error messages for ODBC/DB2
            if (str_contains($errorMessage, 'SQLSTATE[08001]') || str_contains($errorMessage, 'SQLSTATE[08004]')) {
                $errorMessage = 'Cannot connect to database server. Please check your DSN or connection string.';
            } elseif (str_contains($errorMessage, 'SQLSTATE[28000]') || str_contains($errorMessage, 'SQLSTATE[08004]')) {
                $errorMessage = 'Access denied. Please check your username and password.';
            } elseif (str_contains($errorMessage, 'SQLSTATE[08003]')) {
                $errorMessage = 'Connection does not exist. Please verify your DSN configuration.';
            } elseif (str_contains($errorMessage, 'timeout')) {
                $errorMessage = 'Connection timeout. The server may be unreachable or the timeout is too short.';
            } elseif (str_contains($errorMessage, 'DSN')) {
                $errorMessage = 'ODBC DSN not found. Please ensure the DSN is configured in your system.';
            } elseif (str_contains($errorMessage, 'DLL initialization') || str_contains($errorMessage, 'system error 1114') || str_contains($errorMessage, 'SQLSTATE[IM003]')) {
                $errorMessage = 'IBM DB2 ODBC Driver DLL failed to load. This is usually caused by:<br><br>' .
                    '1. <strong>Architecture Mismatch:</strong> Your PHP is 64-bit. Ensure your DSN is configured in the 64-bit ODBC Data Source Administrator (C:\\Windows\\System32\\odbcad32.exe), not the 32-bit version (C:\\Windows\\SysWOW64\\odbcad32.exe).<br><br>' .
                    '2. <strong>Missing Dependencies:</strong> Install Visual C++ Redistributables (both x64 and x86 versions).<br><br>' .
                    '3. <strong>Corrupted Installation:</strong> Reinstall IBM DB2 Client or Data Server Driver for ODBC and CLI.<br><br>' .
                    '4. <strong>Driver Not Found:</strong> Verify the IBM DB2 ODBC driver is properly installed and visible in ODBC Data Source Administrator → Drivers tab.';
            }
            
            return response()->json([
                'success' => false,
                'message' => $errorMessage
            ], 500);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Connection failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function executeQuery(Request $request)
    {
        try {
            $module = Module::where('slug', 'royal-store')->first();
            if (!$module) {
                return response()->json(['success' => false, 'message' => 'Royal Store module not found'], 404);
            }

            $query = $request->input('query');
            $page = (int)($request->input('page', 1));
            $pageSizeInput = $request->input('page_size', 25);
            $pageSize = ($pageSizeInput === 'all' || $pageSizeInput === 'All') ? null : (int)$pageSizeInput;
            $sortColumn = $request->input('sort_column');
            $sortDirection = $request->input('sort_direction', 'asc');

            if (empty($query)) {
                return response()->json(['success' => false, 'message' => 'Query is required'], 400);
            }

            // Get connection settings
            $connectionMethodSetting = $module->settings()->where('key', 'jda.connection_method')->first();
            $connectionMethod = $connectionMethodSetting ? $connectionMethodSetting->value : 'dsn';
            
            $schemaSetting = $module->settings()->where('key', 'jda.schema')->first();
            $defaultSchema = $schemaSetting ? $schemaSetting->value : '';
            $pdo = $this->getJdaConnection($module, $connectionMethod);

            // Apply default schema to table names if schema is configured and table doesn't already have schema
            if (!empty($defaultSchema)) {
                $query = $this->applyDefaultSchema($query, $defaultSchema);
            }

            // Extract user-provided LIMIT/FETCH as maximum row count (Navicat-style)
            // User's LIMIT acts as a cap on total results, but we still paginate through them
            $userMaxRows = null;
            $baseQuery = $query;
            
            // First convert MySQL LIMIT to DB2 FETCH to standardize
            $baseQuery = $this->convertLimitToDb2($baseQuery);
            
            // Extract FETCH FIRST if present (user's maximum row limit)
            if (preg_match('/\bFETCH\s+FIRST\s+(\d+)\s+ROWS\s+ONLY/i', $baseQuery, $matches)) {
                $userMaxRows = (int)$matches[1];
                // Remove FETCH clause - we'll apply our own pagination on top
                $baseQuery = preg_replace('/\s+FETCH\s+FIRST\s+\d+\s+ROWS\s+ONLY(\s+OFFSET\s+\d+\s+ROWS)?/i', '', $baseQuery);
            }
            
            // Execute query with pagination
            $offset = $pageSize !== null ? ($page - 1) * $pageSize : 0;
            
            // For SELECT queries, apply pagination
            $isSelect = preg_match('/^\s*SELECT/i', trim($baseQuery));
            
            if ($isSelect) {
                // Detect if it's DB2 for i5/OS (AS/400) - doesn't support OFFSET
                $isAS400 = false;
                try {
                    $testQuery = "SELECT TABLE_SCHEMA FROM QSYS2.SYSTABLES FETCH FIRST 1 ROWS ONLY";
                    $pdo->query($testQuery);
                    $isAS400 = true;
                } catch (\Exception $e) {
                    $isAS400 = false;
                }
                
                // Get actual total count from base query (without user's LIMIT)
                $actualTotalRows = 0;
                try {
                    $countQuery = "SELECT COUNT(*) as total FROM ({$baseQuery}) as count_query";
                    $countResult = $pdo->query($countQuery);
                    $countRow = $countResult->fetch(\PDO::FETCH_ASSOC);
                    $actualTotalRows = isset($countRow['total']) ? (int)$countRow['total'] : 0;
                } catch (\Exception $e) {
                    // If count query fails, we'll use the result count as fallback
                    $actualTotalRows = 0;
                }
                
                // If user provided a max row limit, cap the total (Navicat behavior)
                $totalRows = ($userMaxRows !== null && $actualTotalRows > $userMaxRows) ? $userMaxRows : $actualTotalRows;

                // Build the final query with sorting and pagination
                $finalQuery = $baseQuery;
                
                // Extract ORDER BY clause if it exists
                $orderByClause = '';
                if (preg_match('/\bORDER\s+BY\s+([^;]+)/i', $finalQuery, $orderMatches)) {
                    $orderByClause = trim($orderMatches[1]);
                }
                
                // Apply sorting if specified
                if ($sortColumn) {
                    $orderByClause = "{$sortColumn} {$sortDirection}";
                    // Remove existing ORDER BY if present (we'll add it back)
                    $finalQuery = preg_replace('/\s+ORDER\s+BY\s+[^;]+/i', '', $finalQuery);
                } elseif (empty($orderByClause) && !preg_match('/\bORDER\s+BY\b/i', $finalQuery)) {
                    // Add default ORDER BY for consistent pagination
                    $orderByClause = "1";
                }
                
                // If no ORDER BY clause was found or created, use default
                if (empty($orderByClause)) {
                    $orderByClause = "1";
                }

                // Apply pagination only if pageSize is not null (not "all")
                if ($pageSize !== null) {
                    // Apply system pagination (Navicat-style: always paginate, even with user LIMIT)
                    // If user provided max rows, ensure we don't exceed it
                    $effectivePageSize = $pageSize;
                    if ($userMaxRows !== null) {
                        // Calculate remaining rows from user's limit
                        $remainingRows = $userMaxRows - $offset;
                        if ($remainingRows <= 0) {
                            // Beyond user's limit, return empty result
                            $effectivePageSize = 0;
                        } elseif ($remainingRows < $pageSize) {
                            // Last page, fetch only remaining rows
                            $effectivePageSize = $remainingRows;
                        }
                    }
                    
                    // Apply pagination
                    if ($effectivePageSize > 0) {
                        if ($isAS400 && $offset > 0) {
                            // DB2 for i5/OS doesn't support OFFSET - use ROW_NUMBER() subquery
                            $startRow = $offset + 1;
                            $endRow = $offset + $effectivePageSize;
                            // Ensure ORDER BY is in the base query for ROW_NUMBER()
                            if (!preg_match('/\bORDER\s+BY\b/i', $finalQuery)) {
                                $finalQuery .= " ORDER BY {$orderByClause}";
                            }
                            $finalQuery = "SELECT * FROM (
                                SELECT ROW_NUMBER() OVER (ORDER BY {$orderByClause}) AS rn, t.*
                                FROM ({$finalQuery}) t
                            ) AS numbered
                            WHERE rn >= {$startRow} AND rn <= {$endRow}";
                        } else {
                            // Regular DB2 or AS/400 with offset = 0
                            if ($offset > 0) {
                                $finalQuery .= " ORDER BY {$orderByClause} FETCH FIRST {$effectivePageSize} ROWS ONLY OFFSET {$offset} ROWS";
                            } else {
                                $finalQuery .= " ORDER BY {$orderByClause} FETCH FIRST {$effectivePageSize} ROWS ONLY";
                            }
                        }
                    } else {
                        // Beyond user's limit, return empty result
                        $finalQuery .= " ORDER BY {$orderByClause} FETCH FIRST 0 ROWS ONLY";
                    }
                } else {
                    // "All" option selected - apply user's LIMIT if provided, otherwise fetch all
                    if ($userMaxRows !== null) {
                        $finalQuery .= " ORDER BY {$orderByClause} FETCH FIRST {$userMaxRows} ROWS ONLY";
                    } elseif (!preg_match('/\bORDER\s+BY\b/i', $finalQuery)) {
                        // Add ORDER BY if not present (for consistency)
                        $finalQuery .= " ORDER BY {$orderByClause}";
                    }
                    // If no user LIMIT, fetch all (no FETCH clause)
                }
                
                $stmt = $pdo->query($finalQuery);
            } else {
                // For non-SELECT queries (INSERT, UPDATE, DELETE)
                $stmt = $pdo->exec($query);
                return response()->json([
                    'success' => true,
                    'message' => 'Query executed successfully. Rows affected: ' . $stmt,
                    'data' => [],
                    'total' => 0,
                    'page' => 1,
                    'page_size' => $pageSize,
                    'total_pages' => 0
                ]);
            }

            $results = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            
            // If count query returned 0 but we have results, use result count as fallback
            if ($totalRows === 0 && !empty($results) && $isSelect) {
                // Estimate total based on current page results
                // If we got a full page, there might be more
                if (count($results) >= $pageSize) {
                    $totalRows = ($page * $pageSize) + 1; // At least this many
                } else {
                    // Last page, so total is offset + result count
                    $totalRows = $offset + count($results);
                }
                
                // If user provided max, cap it
                if ($userMaxRows !== null && $totalRows > $userMaxRows) {
                    $totalRows = $userMaxRows;
                }
            }
            
            // Get column names
            $columns = [];
            if (!empty($results)) {
                $columns = array_keys($results[0]);
            } else {
                // If no results, try to get column info from the base query
                try {
                    $metaQuery = $baseQuery . " FETCH FIRST 0 ROWS ONLY";
                    $metaStmt = $pdo->query($metaQuery);
                    $columnCount = $metaStmt->columnCount();
                    for ($i = 0; $i < $columnCount; $i++) {
                        $colMeta = $metaStmt->getColumnMeta($i);
                        if ($colMeta && isset($colMeta['name'])) {
                            $columns[] = $colMeta['name'];
                        }
                    }
                } catch (\Exception $e) {
                    // If we can't get column info, try to parse from SELECT clause
                    if (preg_match('/SELECT\s+(.+?)\s+FROM/i', $baseQuery, $selectMatch)) {
                        $selectClause = $selectMatch[1];
                        if (trim($selectClause) === '*') {
                            // Can't determine columns from SELECT *, leave empty
                            $columns = [];
                        } else {
                            // Extract column names from SELECT clause
                            $colParts = explode(',', $selectClause);
                            foreach ($colParts as $colPart) {
                                $colPart = trim($colPart);
                                // Remove aliases (AS alias)
                                if (preg_match('/\s+AS\s+([a-zA-Z0-9_]+)/i', $colPart, $aliasMatch)) {
                                    $columns[] = $aliasMatch[1];
                                } elseif (preg_match('/([a-zA-Z0-9_]+)$/', $colPart, $colMatch)) {
                                    $columns[] = $colMatch[1];
                                }
                            }
                        }
                    }
                }
            }

            $totalPages = ($pageSize !== null && $pageSize > 0) ? max(1, ceil($totalRows / $pageSize)) : 1;

            return response()->json([
                'success' => true,
                'data' => $results,
                'columns' => $columns,
                'total' => $totalRows,
                'page' => $page,
                'page_size' => $pageSize,
                'total_pages' => $totalPages
            ]);

        } catch (\PDOException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Database error: ' . $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getTables(Request $request)
    {
        try {
            $module = Module::where('slug', 'royal-store')->first();
            if (!$module) {
                return response()->json(['success' => false, 'message' => 'Royal Store module not found'], 404);
            }

            $connectionMethodSetting = $module->settings()->where('key', 'jda.connection_method')->first();
            $connectionMethod = $connectionMethodSetting ? $connectionMethodSetting->value : 'dsn';
            
            $schemaSetting = $module->settings()->where('key', 'jda.schema')->first();
            $defaultSchema = $schemaSetting ? $schemaSetting->value : '';
            
            $pdo = $this->getJdaConnection($module, $connectionMethod);

            // Detect database type and use appropriate system catalog
            // Try to detect if it's DB2 for i5/OS (AS/400) or regular DB2
            $isAS400 = false;
            try {
                // Try to query QSYS2.SYSTABLES (AS/400 system catalog)
                $testQuery = "SELECT TABLE_SCHEMA, TABLE_NAME FROM QSYS2.SYSTABLES FETCH FIRST 1 ROWS ONLY";
                $pdo->query($testQuery);
                $isAS400 = true;
            } catch (\Exception $e) {
                // Not AS/400, use regular DB2 catalog
                $isAS400 = false;
            }

            if ($isAS400) {
                // DB2 for i5/OS (AS/400) uses QSYS2.SYSTABLES
                if (!empty($defaultSchema)) {
                    $query = "SELECT TABLE_SCHEMA as TABSCHEMA, TABLE_NAME as TABNAME FROM QSYS2.SYSTABLES WHERE TABLE_TYPE = 'T' AND TABLE_SCHEMA = ? ORDER BY TABLE_NAME";
                    $stmt = $pdo->prepare($query);
                    $stmt->execute([strtoupper($defaultSchema)]);
                } else {
                    $query = "SELECT TABLE_SCHEMA as TABSCHEMA, TABLE_NAME as TABNAME FROM QSYS2.SYSTABLES WHERE TABLE_TYPE = 'T' ORDER BY TABLE_SCHEMA, TABLE_NAME";
                    $stmt = $pdo->query($query);
                }
            } else {
                // Regular DB2 uses SYSCAT.TABLES
                if (!empty($defaultSchema)) {
                    $query = "SELECT TABSCHEMA, TABNAME FROM SYSCAT.TABLES WHERE TYPE = 'T' AND TABSCHEMA = ? ORDER BY TABNAME";
                    $stmt = $pdo->prepare($query);
                    $stmt->execute([strtoupper($defaultSchema)]);
                } else {
                    $query = "SELECT TABSCHEMA, TABNAME FROM SYSCAT.TABLES WHERE TYPE = 'T' ORDER BY TABSCHEMA, TABNAME";
                    $stmt = $pdo->query($query);
                }
            }
            
            $tables = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            return response()->json([
                'success' => true,
                'tables' => $tables,
                'default_schema' => $defaultSchema
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getTableColumns(Request $request)
    {
        try {
            $module = Module::where('slug', 'royal-store')->first();
            if (!$module) {
                return response()->json(['success' => false, 'message' => 'Royal Store module not found'], 404);
            }

            $tableName = $request->input('table');
            $schema = $request->input('schema', '');

            if (empty($tableName)) {
                return response()->json(['success' => false, 'message' => 'Table name is required'], 400);
            }

            $connectionMethodSetting = $module->settings()->where('key', 'jda.connection_method')->first();
            $connectionMethod = $connectionMethodSetting ? $connectionMethodSetting->value : 'dsn';
            $pdo = $this->getJdaConnection($module, $connectionMethod);

            // Detect database type (AS/400 or regular DB2)
            $isAS400 = false;
            try {
                $testQuery = "SELECT TABLE_SCHEMA FROM QSYS2.SYSTABLES FETCH FIRST 1 ROWS ONLY";
                $pdo->query($testQuery);
                $isAS400 = true;
            } catch (\Exception $e) {
                $isAS400 = false;
            }

            if ($isAS400) {
                // DB2 for i5/OS (AS/400) uses QSYS2.SYSCOLUMNS
                $query = "SELECT COLUMN_NAME as COLNAME, DATA_TYPE as TYPENAME, LENGTH, NUMERIC_SCALE as SCALE, NULLABLE as NULLS FROM QSYS2.SYSCOLUMNS WHERE TABLE_NAME = ?";
                $params = [strtoupper($tableName)];
                
                if (!empty($schema)) {
                    $query .= " AND TABLE_SCHEMA = ?";
                    $params[] = strtoupper($schema);
                }
                
                $query .= " ORDER BY ORDINAL_POSITION";
            } else {
                // Regular DB2 uses SYSCAT.COLUMNS
                $query = "SELECT COLNAME, TYPENAME, LENGTH, SCALE, NULLS FROM SYSCAT.COLUMNS WHERE TABNAME = ?";
                $params = [$tableName];
                
                if (!empty($schema)) {
                    $query .= " AND TABSCHEMA = ?";
                    $params[] = $schema;
                }
                
                $query .= " ORDER BY COLNO";
            }

            $stmt = $pdo->prepare($query);
            $stmt->execute($params);
            $columns = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            return response()->json([
                'success' => true,
                'columns' => $columns
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    public function exportQueryResults(Request $request)
    {
        try {
            $module = Module::where('slug', 'royal-store')->first();
            if (!$module) {
                return response()->json(['success' => false, 'message' => 'Royal Store module not found'], 404);
            }

            $query = $request->input('query');
            $format = $request->input('format', 'csv');

            if (empty($query)) {
                return response()->json(['success' => false, 'message' => 'Query is required'], 400);
            }

            $connectionMethodSetting = $module->settings()->where('key', 'jda.connection_method')->first();
            $connectionMethod = $connectionMethodSetting ? $connectionMethodSetting->value : 'dsn';
            $pdo = $this->getJdaConnection($module, $connectionMethod);

            $stmt = $pdo->query($query);
            $results = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            if (empty($results)) {
                return response()->json(['success' => false, 'message' => 'No results to export'], 400);
            }

            $columns = array_keys($results[0]);

            if ($format === 'csv') {
                $filename = 'query_results_' . date('Y-m-d_H-i-s') . '.csv';
                $headers = [
                    'Content-Type' => 'text/csv',
                    'Content-Disposition' => 'attachment; filename="' . $filename . '"',
                ];

                $callback = function() use ($columns, $results) {
                    $file = fopen('php://output', 'w');
                    fputcsv($file, $columns);
                    foreach ($results as $row) {
                        fputcsv($file, $row);
                    }
                    fclose($file);
                };

                return response()->stream($callback, 200, $headers);
            } else {
                return response()->json([
                    'success' => true,
                    'data' => $results,
                    'columns' => $columns
                ]);
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    private function getJdaConnection($module, $connectionMethod)
    {
        if ($connectionMethod === 'dsn') {
            $dsn = $module->settings()->where('key', 'jda.dsn')->first();
            $username = $module->settings()->where('key', 'jda.username')->first();
            $password = $module->settings()->where('key', 'jda.password')->first();

            if (!$dsn || !$username) {
                throw new \Exception('DSN and Username are required');
            }

            $dsnValue = $dsn->is_encrypted ? decrypt($dsn->value) : $dsn->value;
            $usernameValue = $username->is_encrypted ? decrypt($username->value) : $username->value;
            $passwordValue = $password && $password->is_encrypted ? decrypt($password->value) : ($password ? $password->value : '');

            return new \PDO("odbc:" . $dsnValue, $usernameValue, $passwordValue, [
                \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
            ]);
        } else {
            $connectionString = $module->settings()->where('key', 'jda.connection_string')->first();
            if (!$connectionString) {
                throw new \Exception('Connection string is required');
            }

            $connStr = $connectionString->is_encrypted ? decrypt($connectionString->value) : $connectionString->value;
            
            if (!str_ends_with(trim($connStr), ';')) {
                $connStr .= ';';
            }

            return new \PDO('odbc:' . $connStr, null, null, [
                \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
            ]);
        }
    }

    /**
     * Apply default schema to table names in query if they don't already have a schema prefix
     */
    private function applyDefaultSchema($query, $defaultSchema)
    {
        if (empty($defaultSchema)) {
            return $query;
        }

        $schema = strtoupper(trim($defaultSchema));
        
        // System schemas and keywords to skip
        $skipSchemas = ['SYSIBM', 'SYSCAT', 'QSYS2', 'SYSFUN', 'SYSPROC', 'SYSSTAT'];
        $skipKeywords = ['DUAL', 'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER', 'ON', 'USING'];
        
        // Pattern to match identifiers (table names): alphanumeric, underscore, $, #, @
        // This pattern matches table names that:
        // 1. Don't already have a schema prefix (no dot before them in the context)
        // 2. Are not in quotes
        // 3. Are not system schemas
        
        // Handle FROM clause: FROM table_name (but not FROM schema.table_name or FROM (subquery))
        $query = preg_replace_callback(
            '/\bFROM\s+([a-zA-Z0-9_$#@]+)(?=\s|$|,|WHERE|JOIN|GROUP|ORDER|HAVING|LIMIT|FETCH|\))/i',
            function($matches) use ($schema, $skipSchemas, $skipKeywords) {
                $tableName = trim($matches[1]);
                $upperTableName = strtoupper($tableName);
                
                // Skip if it's a keyword or system schema
                if (in_array($upperTableName, $skipKeywords) || in_array($upperTableName, $skipSchemas)) {
                    return $matches[0];
                }
                
                // Check if the previous character was a dot (already has schema)
                $pos = strpos($matches[0], $tableName);
                if ($pos > 0 && substr($matches[0], $pos - 1, 1) === '.') {
                    return $matches[0];
                }
                
                return "FROM {$schema}.{$tableName}";
            },
            $query
        );
        
        // Handle JOIN clauses: JOIN table_name (INNER JOIN, LEFT JOIN, etc.)
        $query = preg_replace_callback(
            '/(?:INNER\s+|LEFT\s+|RIGHT\s+|FULL\s+)?JOIN\s+([a-zA-Z0-9_$#@]+)(?=\s|$|ON|USING|WHERE|GROUP|ORDER|HAVING|LIMIT|FETCH|\))/i',
            function($matches) use ($schema, $skipSchemas, $skipKeywords) {
                $tableName = trim($matches[1]);
                $upperTableName = strtoupper($tableName);
                
                if (in_array($upperTableName, $skipKeywords) || in_array($upperTableName, $skipSchemas)) {
                    return $matches[0];
                }
                
                $pos = strpos($matches[0], $tableName);
                if ($pos > 0 && substr($matches[0], $pos - 1, 1) === '.') {
                    return $matches[0];
                }
                
                return str_replace($tableName, "{$schema}.{$tableName}", $matches[0]);
            },
            $query
        );
        
        // Handle UPDATE clause: UPDATE table_name
        $query = preg_replace_callback(
            '/\bUPDATE\s+([a-zA-Z0-9_$#@]+)(?=\s|$|SET)/i',
            function($matches) use ($schema, $skipSchemas, $skipKeywords) {
                $tableName = trim($matches[1]);
                $upperTableName = strtoupper($tableName);
                
                if (in_array($upperTableName, $skipKeywords) || in_array($upperTableName, $skipSchemas)) {
                    return $matches[0];
                }
                
                $pos = strpos($matches[0], $tableName);
                if ($pos > 0 && substr($matches[0], $pos - 1, 1) === '.') {
                    return $matches[0];
                }
                
                return "UPDATE {$schema}.{$tableName}";
            },
            $query
        );
        
        // Handle INSERT INTO clause: INSERT INTO table_name
        $query = preg_replace_callback(
            '/\bINSERT\s+INTO\s+([a-zA-Z0-9_$#@]+)(?=\s|$|\()/i',
            function($matches) use ($schema, $skipSchemas, $skipKeywords) {
                $tableName = trim($matches[1]);
                $upperTableName = strtoupper($tableName);
                
                if (in_array($upperTableName, $skipKeywords) || in_array($upperTableName, $skipSchemas)) {
                    return $matches[0];
                }
                
                $pos = strpos($matches[0], $tableName);
                if ($pos > 0 && substr($matches[0], $pos - 1, 1) === '.') {
                    return $matches[0];
                }
                
                return "INSERT INTO {$schema}.{$tableName}";
            },
            $query
        );
        
        // Handle DELETE FROM clause: DELETE FROM table_name
        $query = preg_replace_callback(
            '/\bDELETE\s+FROM\s+([a-zA-Z0-9_$#@]+)(?=\s|$|WHERE)/i',
            function($matches) use ($schema, $skipSchemas, $skipKeywords) {
                $tableName = trim($matches[1]);
                $upperTableName = strtoupper($tableName);
                
                if (in_array($upperTableName, $skipKeywords) || in_array($upperTableName, $skipSchemas)) {
                    return $matches[0];
                }
                
                $pos = strpos($matches[0], $tableName);
                if ($pos > 0 && substr($matches[0], $pos - 1, 1) === '.') {
                    return $matches[0];
                }
                
                return "DELETE FROM {$schema}.{$tableName}";
            },
            $query
        );
        
        return $query;
    }

    /**
     * Convert MySQL-style LIMIT/OFFSET to DB2 FETCH FIRST ... ROWS ONLY syntax
     */
    private function convertLimitToDb2($query)
    {
        // Remove any existing LIMIT clauses and convert to DB2 syntax
        // Pattern: LIMIT [offset,] row_count or LIMIT row_count OFFSET offset
        
        // First, handle LIMIT with OFFSET: LIMIT 10 OFFSET 20
        $query = preg_replace_callback(
            '/\bLIMIT\s+(\d+)\s+OFFSET\s+(\d+)/i',
            function($matches) {
                $rowCount = $matches[1];
                $offset = $matches[2];
                return "FETCH FIRST {$rowCount} ROWS ONLY OFFSET {$offset} ROWS";
            },
            $query
        );

        // Handle LIMIT with comma: LIMIT 20, 10 (offset, row_count)
        $query = preg_replace_callback(
            '/\bLIMIT\s+(\d+)\s*,\s*(\d+)/i',
            function($matches) {
                $offset = $matches[1];
                $rowCount = $matches[2];
                return "FETCH FIRST {$rowCount} ROWS ONLY OFFSET {$offset} ROWS";
            },
            $query
        );

        // Handle simple LIMIT: LIMIT 10
        $query = preg_replace_callback(
            '/\bLIMIT\s+(\d+)(?!\s+OFFSET|\s*,)/i',
            function($matches) {
                $rowCount = $matches[1];
                return "FETCH FIRST {$rowCount} ROWS ONLY";
            },
            $query
        );

        return $query;
    }
}


