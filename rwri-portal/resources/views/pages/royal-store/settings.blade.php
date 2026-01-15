<x-default-layout>
    @section('title')
        Royal Store Settings
    @endsection

    <div class="card">
        <div class="card-header">
            <h3 class="card-title">Royal Store Settings</h3>
        </div>
        <div class="card-body">
            @if(session('success'))
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    {{ session('success') }}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            @endif

            @if(session('error'))
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    {{ session('error') }}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            @endif

            <form method="POST" action="{{ route('royal-store.settings.update') }}" novalidate id="royal-store-settings-form">
                @csrf
                <input type="hidden" name="active_tab" id="active_tab" value="shopify">

                <!--begin::Nav-->
                <ul class="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bold">
                    <!--begin::Nav item-->
                    <li class="nav-item mt-2">
                        <a class="nav-link text-active-primary ms-0 me-10 py-5 active" data-bs-toggle="tab" href="#kt_tab_shopify">
                            Shopify
                        </a>
                    </li>
                    <!--end::Nav item-->
                        <!--begin::Nav item-->
                        <li class="nav-item mt-2">
                            <a class="nav-link text-active-primary me-10 py-5" data-bs-toggle="tab" href="#kt_tab_connections">
                                Connections
                            </a>
                        </li>
                        <!--end::Nav item-->
                        <!--begin::Nav item-->
                        <li class="nav-item mt-2">
                            <a class="nav-link text-active-primary me-10 py-5" data-bs-toggle="tab" href="#kt_tab_query">
                                Query
                            </a>
                        </li>
                        <!--end::Nav item-->
                    </ul>
                <!--end::Nav-->

                <!--begin::Tab Content-->
                <div class="tab-content" id="myTabContent">
                    <!--begin::Tab pane - Shopify-->
                    <div class="tab-pane fade show active" id="kt_tab_shopify" role="tabpanel">
                        <div class="card-body p-9">
                            <div class="mb-10">
                                <h4 class="fw-bold mb-3">Shopify API Configuration</h4>
                                <p class="text-gray-600">Configure your Shopify store API credentials for data synchronization.</p>
                                <div class="alert alert-info d-flex align-items-center p-5 mt-5">
                                    <i class="ki-duotone ki-information-5 fs-2hx text-info me-4">
                                        <span class="path1"></span>
                                        <span class="path2"></span>
                                        <span class="path3"></span>
                                    </i>
                                    <div class="d-flex flex-column">
                                        <h4 class="mb-1 text-info">Where to find credentials:</h4>
                                        <span>Go to <strong>dev.shopify.com/dashboard</strong> → Select your app (<strong>rwri-portal</strong>) → Click <strong>"Settings"</strong> in the left sidebar → Under <strong>"Credentials"</strong> section, you'll find:</span>
                                        <ul class="mt-2 mb-0">
                                            <li><strong>Client ID</strong> - Copy this value to the "Client ID (API Key)" field below</li>
                                            <li><strong>Secret</strong> - Click the eye icon to reveal, then copy to the "Client Secret (API Secret)" field below</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div class="row mb-7">
                                <label class="col-lg-3 col-form-label fw-semibold required">Store Domain</label>
                                <div class="col-lg-9">
                                    <div class="input-group">
                                        <input type="text" 
                                               name="shopify[store]" 
                                               class="form-control form-control-solid @error('shopify.store') is-invalid @enderror" 
                                               placeholder="your-store"
                                               value="{{ isset($settings['shopify']['store']) ? ($settings['shopify']['store']->is_encrypted ? decrypt($settings['shopify']['store']->value) : $settings['shopify']['store']->value) : '' }}" 
                                               required />
                                        <span class="input-group-text">.myshopify.com</span>
                                    </div>
                                    @error('shopify.store')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                    <div class="form-text">Your Shopify store domain (without .myshopify.com)</div>
                                </div>
                            </div>

                            <div class="row mb-7">
                                <label class="col-lg-3 col-form-label fw-semibold required">Client ID (API Key)</label>
                                <div class="col-lg-9">
                                    <input type="text" 
                                           name="shopify[api_key]" 
                                           class="form-control form-control-solid @error('shopify.api_key') is-invalid @enderror" 
                                           placeholder="Enter Client ID / API Key"
                                           value="{{ isset($settings['shopify']['api_key']) && $settings['shopify']['api_key']->is_encrypted ? decrypt($settings['shopify']['api_key']->value) : (isset($settings['shopify']['api_key']) ? $settings['shopify']['api_key']->value : '') }}" 
                                           required />
                                    @error('shopify.api_key')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                    <div class="form-text">Shopify Client ID from Dev Dashboard → App → Client credentials (will be encrypted)</div>
                                </div>
                            </div>

                            <div class="row mb-7">
                                <label class="col-lg-3 col-form-label fw-semibold required">Client Secret (API Secret)</label>
                                <div class="col-lg-9">
                                    <input type="text" 
                                           name="shopify[api_secret]" 
                                           class="form-control form-control-solid @error('shopify.api_secret') is-invalid @enderror" 
                                           placeholder="Enter Client Secret / API Secret"
                                           value="{{ isset($settings['shopify']['api_secret']) && $settings['shopify']['api_secret']->is_encrypted ? decrypt($settings['shopify']['api_secret']->value) : (isset($settings['shopify']['api_secret']) ? $settings['shopify']['api_secret']->value : '') }}" 
                                           required />
                                    @error('shopify.api_secret')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                    <div class="form-text">Shopify Client Secret from Dev Dashboard → App → Client credentials (will be encrypted)</div>
                                </div>
                            </div>

                            <div class="row mb-7">
                                <label class="col-lg-3 col-form-label fw-semibold">API Version</label>
                                <div class="col-lg-9">
                                    <input type="text" 
                                           name="shopify[api_version]" 
                                           class="form-control form-control-solid @error('shopify.api_version') is-invalid @enderror" 
                                           placeholder="2024-10 (leave empty for latest)"
                                           value="{{ isset($settings['shopify']['api_version']) ? $settings['shopify']['api_version']->value : '' }}" 
                                           pattern="\d{4}-\d{2}" />
                                    @error('shopify.api_version')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                    <div class="form-text">Optional: Enter API version in format YYYY-MM (e.g., 2024-10). Leave empty to use the latest version or auto-detect from your app. <a href="https://shopify.dev/docs/api/admin-graphql#versioning" target="_blank">Check latest versions</a></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--end::Tab pane - Shopify-->

                    <!--begin::Tab pane - Connections-->
                    <div class="tab-pane fade" id="kt_tab_connections" role="tabpanel">
                        <div class="card-body p-9">
                            <div class="mb-10">
                                <h4 class="fw-bold mb-3">JDA Database Connection (IBM DB2 via ODBC)</h4>
                                <p class="text-gray-600">Configure the ODBC connection settings for IBM DB2 database integration.</p>
                            </div>

                            <div class="row mb-7">
                                <label class="col-lg-3 col-form-label fw-semibold">Connection Method</label>
                                <div class="col-lg-9">
                                    <select name="jda[connection_method]" id="jda_connection_method" class="form-select form-select-solid">
                                        <option value="dsn" {{ (isset($settings['connections']['connection_method']) ? $settings['connections']['connection_method']->value : 'dsn') == 'dsn' ? 'selected' : '' }}>ODBC DSN (Data Source Name - Recommended for Windows)</option>
                                        <option value="connection_string" {{ (isset($settings['connections']['connection_method']) ? $settings['connections']['connection_method']->value : '') == 'connection_string' ? 'selected' : '' }}>ODBC Connection String (For Ubuntu/Linux)</option>
                                    </select>
                                    <div class="form-text">
                                        <strong>Connection String</strong> is recommended for Ubuntu/Linux as it doesn't require system-level ODBC configuration. 
                                        <strong>DSN</strong> requires ODBC to be configured in <code>/etc/odbc.ini</code> (Linux) or ODBC Data Source Administrator (Windows).
                                    </div>
                                </div>
                            </div>

                            <!-- ODBC DSN Method -->
                            <div id="jda_dsn_method" class="connection-method">
                                <div class="row mb-7">
                                    <label class="col-lg-3 col-form-label fw-semibold required">ODBC DSN Name</label>
                                    <div class="col-lg-9">
                                        <input type="text" 
                                               name="jda[dsn]" 
                                               class="form-control form-control-solid @error('jda.dsn') is-invalid @enderror" 
                                               placeholder="DB2_DSN"
                                               value="{{ isset($settings['connections']['dsn']) ? ($settings['connections']['dsn']->is_encrypted ? decrypt($settings['connections']['dsn']->value) : $settings['connections']['dsn']->value) : '' }}" 
                                               data-tab-required="connections" />
                                        @error('jda.dsn')
                                            <div class="invalid-feedback">{{ $message }}</div>
                                        @enderror
                                        <div class="form-text">The ODBC Data Source Name configured in your system (e.g., DB2_DSN, JDA_DB2)</div>
                                    </div>
                                </div>

                                <div class="row mb-7">
                                    <label class="col-lg-3 col-form-label fw-semibold required">Username</label>
                                    <div class="col-lg-9">
                                        <input type="text" 
                                               name="jda[username]" 
                                               class="form-control form-control-solid @error('jda.username') is-invalid @enderror" 
                                               placeholder="db2admin"
                                               value="{{ isset($settings['connections']['username']) ? ($settings['connections']['username']->is_encrypted ? decrypt($settings['connections']['username']->value) : $settings['connections']['username']->value) : '' }}" 
                                               data-tab-required="connections" />
                                        @error('jda.username')
                                            <div class="invalid-feedback">{{ $message }}</div>
                                        @enderror
                                        <div class="form-text">DB2 database username (will be encrypted)</div>
                                    </div>
                                </div>

                                <div class="row mb-7">
                                    <label class="col-lg-3 col-form-label fw-semibold required">Password</label>
                                    <div class="col-lg-9">
                                        <input type="text" 
                                               name="jda[password]" 
                                               class="form-control form-control-solid @error('jda.password') is-invalid @enderror" 
                                               placeholder="Enter password"
                                               value="{{ isset($settings['connections']['password']) && $settings['connections']['password']->is_encrypted ? decrypt($settings['connections']['password']->value) : (isset($settings['connections']['password']) ? $settings['connections']['password']->value : '') }}" 
                                               data-tab-required="connections" />
                                        @error('jda.password')
                                            <div class="invalid-feedback">{{ $message }}</div>
                                        @enderror
                                        <div class="form-text">DB2 database password (will be encrypted)</div>
                                    </div>
                                </div>
                            </div>

                            <!-- ODBC Connection String Method -->
                            <div id="jda_connection_string_method" class="connection-method" style="display: none;">
                                <div class="row mb-7">
                                    <label class="col-lg-3 col-form-label fw-semibold required">ODBC Connection String</label>
                                    <div class="col-lg-9">
                                        <textarea name="jda[connection_string]" 
                                                  class="form-control form-control-solid @error('jda.connection_string') is-invalid @enderror" 
                                                  rows="4"
                                                  placeholder="DRIVER={IBM DB2 ODBC DRIVER};DATABASE=JDA_DB;HOSTNAME=192.168.1.100;PORT=50000;PROTOCOL=TCPIP;UID=db2admin;PWD=password;"
                                                  data-tab-required="connections">{{ isset($settings['connections']['connection_string']) && $settings['connections']['connection_string']->is_encrypted ? decrypt($settings['connections']['connection_string']->value) : (isset($settings['connections']['connection_string']) ? $settings['connections']['connection_string']->value : '') }}</textarea>
                                        @error('jda.connection_string')
                                            <div class="invalid-feedback">{{ $message }}</div>
                                        @enderror
                                        <div class="form-text">
                                            Full ODBC connection string for IBM DB2. This method is recommended for Ubuntu/Linux as it doesn't require system-level ODBC configuration.<br>
                                            <strong>Example format:</strong><br>
                                            <code>DRIVER={IBM DB2 ODBC DRIVER};DATABASE=JDA_DB;HOSTNAME=server;PORT=50000;PROTOCOL=TCPIP;UID=username;PWD=password;</code><br><br>
                                            <strong>For Ubuntu/Linux:</strong> Ensure the IBM DB2 ODBC driver is installed. The driver name may vary (e.g., <code>IBM DB2 ODBC DRIVER</code> or <code>IBM DB2 ODBC DRIVER - DB2COPY1</code>). Check available drivers with: <code>odbcinst -q -d</code>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Shared Database Schema Field (for both connection methods) -->
                            <div class="row mb-7">
                                <label class="col-lg-3 col-form-label fw-semibold required">Database Schema</label>
                                <div class="col-lg-9">
                                    <input type="text" 
                                           name="jda[schema]" 
                                           class="form-control form-control-solid @error('jda.schema') is-invalid @enderror" 
                                           placeholder="DB2INST1"
                                           value="{{ isset($settings['connections']['schema']) ? $settings['connections']['schema']->value : '' }}" 
                                           data-tab-required="connections" />
                                    @error('jda.schema')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                    <div class="form-text">Default database schema. If specified, table names in queries will automatically use this schema prefix (e.g., SCHEMA.TABLE_NAME).</div>
                                </div>
                            </div>

                            <div class="row mb-7">
                                <label class="col-lg-3 col-form-label fw-semibold">Connection Timeout</label>
                                <div class="col-lg-9">
                                    <input type="number" 
                                           name="jda[timeout]" 
                                           class="form-control form-control-solid" 
                                           placeholder="30"
                                           value="{{ isset($settings['connections']['timeout']) ? $settings['connections']['timeout']->value : '30' }}" />
                                    <div class="form-text">Connection timeout in seconds (default: 30)</div>
                                </div>
                            </div>

                            <div class="row mb-7">
                                <label class="col-lg-3 col-form-label fw-semibold">Test Connection</label>
                                <div class="col-lg-9">
                                    <button type="button" 
                                            class="btn btn-light-primary" 
                                            id="test-connection-btn">
                                        <span class="indicator-label">
                                            {!! getIcon('check', 'fs-2 me-2') !!}
                                            Test Connection
                                        </span>
                                        <span class="indicator-progress">
                                            Please wait... 
                                            <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                                        </span>
                                    </button>
                                    <div id="connection-test-result" class="mt-3"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--end::Tab pane - Connections-->

                    <!--begin::Tab pane - Query-->
                    <div class="tab-pane fade" id="kt_tab_query" role="tabpanel">
                        <div class="card-body p-9">
                            <div class="mb-10">
                                <h4 class="fw-bold mb-3">Database Query Tool</h4>
                                <p class="text-gray-600">Execute SQL queries against your JDA database using the configured connection.</p>
                            </div>

                            <div class="row mb-7">
                                <label class="col-lg-2 col-form-label fw-semibold">SQL Query</label>
                                <div class="col-lg-10">
                                    <div class="position-relative">
                                        <textarea name="query_sql" 
                                                  id="query_sql" 
                                                  class="form-control form-control-solid font-monospace" 
                                                  rows="8"
                                                  placeholder="SELECT * FROM TABLE_NAME WHERE ..."
                                                  style="font-family: 'Courier New', monospace; font-size: 14px;"></textarea>
                                        <div class="position-absolute top-0 end-0 p-2">
                                            <button type="button" class="btn btn-sm btn-light" id="query_clear_btn" title="Clear">
                                                <i class="ki-duotone ki-cross fs-2">
                                                    <span class="path1"></span>
                                                    <span class="path2"></span>
                                                </i>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="form-text mt-2">
                                        <span class="badge badge-light-info me-2">Ctrl+Enter</span> to execute query
                                        <span class="badge badge-light-info ms-2 me-2">Ctrl+/</span> to comment/uncomment
                                        <span class="badge badge-light-success ms-2">Schema auto-applied</span> if configured in Connections tab
                                    </div>
                                </div>
                            </div>

                            <div class="row mb-7">
                                <label class="col-lg-2 col-form-label fw-semibold">Actions</label>
                                <div class="col-lg-10">
                                    <button type="button" class="btn btn-primary me-2" id="query_execute_btn">
                                        <span class="indicator-label">
                                            <i class="ki-duotone ki-play fs-2 me-2">
                                                <span class="path1"></span>
                                                <span class="path2"></span>
                                            </i>
                                            Execute Query
                                        </span>
                                        <span class="indicator-progress">
                                            Executing... <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                                        </span>
                                    </button>
                                    <button type="button" class="btn btn-light-primary me-2" id="query_export_btn" disabled>
                                        <i class="ki-duotone ki-file-down fs-2 me-2">
                                            <span class="path1"></span>
                                            <span class="path2"></span>
                                        </i>
                                        Export Results
                                    </button>
                                    <button type="button" class="btn btn-light-info" id="query_tables_btn">
                                        <i class="ki-duotone ki-tablet fs-2 me-2">
                                            <span class="path1"></span>
                                            <span class="path2"></span>
                                        </i>
                                        Show Tables
                                    </button>
                                </div>
                            </div>

                            <div id="query_results_container" style="display: none;">
                                <div class="separator separator-dashed my-5"></div>
                                <div class="d-flex justify-content-between align-items-center mb-5">
                                    <h5 class="fw-bold">Query Results</h5>
                                    <div class="d-flex align-items-center">
                                        <span class="text-muted me-3" id="query_result_count"></span>
                                        <select class="form-select form-select-sm w-auto" id="query_page_size">
                                            <option value="10">10 rows</option>
                                            <option value="25" selected>25 rows</option>
                                            <option value="50">50 rows</option>
                                            <option value="100">100 rows</option>
                                            <option value="all">All</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="table-responsive" id="query_results_table_container">
                                    <table class="table table-striped table-row-bordered table-row-gray-300 align-middle gs-0 gy-4" id="query_results_table">
                                        <thead id="query_results_thead"></thead>
                                        <tbody id="query_results_tbody"></tbody>
                                    </table>
                                </div>
                                <div class="d-flex justify-content-between align-items-center mt-5" id="query_pagination_container"></div>
                            </div>

                            <div id="query_error_container" style="display: none;" class="mt-5">
                                <div class="alert alert-danger">
                                    <h5 class="alert-heading">Query Error</h5>
                                    <div id="query_error_message"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--end::Tab pane - Query-->
                </div>
                <!--end::Tab Content-->

                <!--begin::Actions-->
                <div class="card-footer d-flex justify-content-end py-6 px-9" id="settings-footer">
                    <button type="submit" class="btn btn-primary" id="save-changes-btn">Save Changes</button>
                </div>
                <!--end::Actions-->
            </form>
        </div>
    </div>

    @push('scripts')
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Track active tab and only submit data from active tab
            const form = document.getElementById('royal-store-settings-form');
            const activeTabInput = document.getElementById('active_tab');
            
            // Listen for tab changes
            const tabLinks = document.querySelectorAll('[data-bs-toggle="tab"]');
            const saveChangesBtn = document.getElementById('save-changes-btn');
            const settingsFooter = document.getElementById('settings-footer');
            
            function updateFooterVisibility() {
                const activeTab = document.querySelector('.nav-link.active')?.getAttribute('href');
                const queryTabPane = document.getElementById('kt_tab_query');
                const isQueryTabActive = activeTab === '#kt_tab_query' || (queryTabPane && queryTabPane.classList.contains('active'));
                
                if (isQueryTabActive) {
                    // Hide Save Changes button and footer for Query tab
                    if (saveChangesBtn) {
                        saveChangesBtn.style.display = 'none';
                        saveChangesBtn.disabled = true;
                    }
                    if (settingsFooter) settingsFooter.style.display = 'none';
                } else {
                    // Show Save Changes button and footer for other tabs
                    if (saveChangesBtn) {
                        saveChangesBtn.style.display = 'block';
                        saveChangesBtn.disabled = false;
                    }
                    if (settingsFooter) settingsFooter.style.display = 'flex';
                }
            }
            
            tabLinks.forEach(function(tabLink) {
                tabLink.addEventListener('shown.bs.tab', function(e) {
                    const targetTab = e.target.getAttribute('href');
                    if (targetTab === '#kt_tab_shopify') {
                        activeTabInput.value = 'shopify';
                    } else if (targetTab === '#kt_tab_connections') {
                        activeTabInput.value = 'connections';
                    } else if (targetTab === '#kt_tab_query') {
                        activeTabInput.value = 'query';
                    }
                    updateFooterVisibility();
                });
            });
            
            // Initialize footer visibility on page load
            updateFooterVisibility();
            
            // Prevent form submission when Query tab is active
            if (form) {
                form.addEventListener('submit', function(e) {
                    const activeTab = activeTabInput.value;
                    
                    // Don't submit form if Query tab is active
                    if (activeTab === 'query') {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }
                    const formData = new FormData(form);
                    
                    // Remove fields from inactive tab
                    if (activeTab === 'shopify') {
                        // Remove all JDA fields
                        const jdaFields = form.querySelectorAll('[name^="jda["]');
                        jdaFields.forEach(function(field) {
                            formData.delete(field.name);
                        });
                    } else if (activeTab === 'connections') {
                        // Remove all Shopify fields
                        const shopifyFields = form.querySelectorAll('[name^="shopify["]');
                        shopifyFields.forEach(function(field) {
                            formData.delete(field.name);
                        });
                    }
                    
                    // Submit via fetch to have more control
                    e.preventDefault();
                    
                    const submitBtn = form.querySelector('button[type="submit"]');
                    const originalText = submitBtn.innerHTML;
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Saving...';
                    
                    fetch(form.action, {
                        method: 'POST',
                        headers: {
                            'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value,
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        body: formData
                    })
                    .then(response => {
                        if (response.redirected) {
                            window.location.href = response.url;
                        } else if (response.ok) {
                            // Check content type to determine if it's JSON
                            const contentType = response.headers.get('content-type');
                            if (contentType && contentType.includes('application/json')) {
                                return response.json().then(data => {
                                    if (data.success) {
                                        showSuccessMessage(data.message || 'Settings saved successfully!');
                                        setTimeout(() => window.location.reload(), 1500);
                                    } else {
                                        throw new Error(data.message || 'Failed to save settings');
                                    }
                                });
                            } else {
                                // HTML response - reload page (Laravel will show success message)
                                showSuccessMessage('Settings saved successfully!');
                                setTimeout(() => window.location.reload(), 1500);
                            }
                        } else {
                            return response.json().then(data => {
                                throw new Error(data.message || 'Failed to save settings');
                            }).catch(() => {
                                throw new Error('Failed to save settings');
                            });
                        }
                    })
                    .catch(error => {
                        showErrorMessage(error.message || 'An error occurred while saving settings');
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                    });
            
            // Helper function to show success message
            function showSuccessMessage(message) {
                // Remove any existing alerts
                const existingAlerts = form.querySelectorAll('.alert');
                existingAlerts.forEach(alert => alert.remove());
                
                const alertDiv = document.createElement('div');
                alertDiv.className = 'alert alert-success alert-dismissible fade show';
                alertDiv.setAttribute('role', 'alert');
                alertDiv.innerHTML = `
                    <strong>Success!</strong> ${message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                `;
                form.insertBefore(alertDiv, form.firstChild);
                
                // Scroll to top to show message
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            
            // Helper function to show error message
            function showErrorMessage(message) {
                // Remove any existing alerts
                const existingAlerts = form.querySelectorAll('.alert');
                existingAlerts.forEach(alert => alert.remove());
                
                const alertDiv = document.createElement('div');
                alertDiv.className = 'alert alert-danger alert-dismissible fade show';
                alertDiv.setAttribute('role', 'alert');
                alertDiv.innerHTML = `
                    <strong>Error!</strong> ${message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                `;
                form.insertBefore(alertDiv, form.firstChild);
                
                // Scroll to top to show message
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
                });
            }
            
            // Toggle connection method fields
            const connectionMethod = document.getElementById('jda_connection_method');
            if (connectionMethod) {
                function toggleConnectionMethod() {
                    const method = connectionMethod.value;
                    const dsnMethod = document.getElementById('jda_dsn_method');
                    const connectionStringMethod = document.getElementById('jda_connection_string_method');
                    
                    if (method === 'dsn') {
                        dsnMethod.style.display = 'block';
                        connectionStringMethod.style.display = 'none';
                    } else {
                        dsnMethod.style.display = 'none';
                        connectionStringMethod.style.display = 'block';
                    }
                }
                
                connectionMethod.addEventListener('change', toggleConnectionMethod);
                toggleConnectionMethod(); // Initialize on page load
            }
            
            // Test connection button handler
            const testBtn = document.getElementById('test-connection-btn');
            if (!testBtn) return;

            testBtn.addEventListener('click', function() {
                const btn = this;
                const resultDiv = document.getElementById('connection-test-result');
                
                // Get JDA connection values directly from form inputs
                const connectionMethod = document.getElementById('jda_connection_method')?.value || 'connection_string';
                const jdaData = {
                    connection_method: connectionMethod,
                    dsn: document.querySelector('input[name="jda[dsn]"]')?.value || '',
                    connection_string: document.querySelector('textarea[name="jda[connection_string]"]')?.value || '',
                    username: document.querySelector('input[name="jda[username]"]')?.value || '',
                    password: document.querySelector('input[name="jda[password]"]')?.value || '',
                    timeout: document.querySelector('input[name="jda[timeout]"]')?.value || '30'
                };

                // Validate required fields based on connection method
                if (connectionMethod === 'dsn') {
                    if (!jdaData.dsn || !jdaData.username) {
                        resultDiv.innerHTML = '<div class="alert alert-warning">Please fill in DSN Name and Username fields before testing.</div>';
                        return;
                    }
                } else {
                    if (!jdaData.connection_string) {
                        resultDiv.innerHTML = '<div class="alert alert-warning">Please fill in ODBC Connection String field before testing.</div>';
                        return;
                    }
                }

                // Show loading state
                btn.setAttribute('data-kt-indicator', 'on');
                btn.disabled = true;
                resultDiv.innerHTML = '';

                fetch('{{ route('royal-store.settings.update') }}', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': '{{ csrf_token() }}',
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        test_connection: true,
                        jda: jdaData
                    })
                })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(data => {
                            throw new Error(data.message || 'Connection test failed');
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        resultDiv.innerHTML = `
                            <div class="alert alert-success d-flex align-items-center p-5">
                                <i class="ki-duotone ki-check-circle fs-2hx text-success me-4">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                </i>
                                <div class="d-flex flex-column">
                                    <h4 class="mb-1 text-success">Connection Successful!</h4>
                                    <span>Successfully connected to the JDA database.</span>
                                </div>
                            </div>
                        `;
                    } else {
                        resultDiv.innerHTML = `
                            <div class="alert alert-danger d-flex align-items-center p-5">
                                <i class="ki-duotone ki-information-5 fs-2hx text-danger me-4">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>
                                </i>
                                <div class="d-flex flex-column">
                                    <h4 class="mb-1 text-danger">Connection Failed</h4>
                                    <span>${data.message || 'Unknown error occurred'}</span>
                                </div>
                            </div>
                        `;
                    }
                })
                .catch(error => {
                    resultDiv.innerHTML = `
                        <div class="alert alert-danger d-flex align-items-center p-5">
                            <i class="ki-duotone ki-information-5 fs-2hx text-danger me-4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                            <div class="d-flex flex-column">
                                <h4 class="mb-1 text-danger">Error</h4>
                                <span>${error.message || 'An unexpected error occurred'}</span>
                            </div>
                        </div>
                    `;
                })
                .finally(() => {
                    btn.removeAttribute('data-kt-indicator');
                    btn.disabled = false;
                });
            });
        });

        // Query Tab Functionality
        const querySql = document.getElementById('query_sql');
        const queryExecuteBtn = document.getElementById('query_execute_btn');
        const queryExportBtn = document.getElementById('query_export_btn');
        const queryTablesBtn = document.getElementById('query_tables_btn');
        const queryClearBtn = document.getElementById('query_clear_btn');
        const queryResultsContainer = document.getElementById('query_results_container');
        const queryErrorContainer = document.getElementById('query_error_container');
        const queryResultsThead = document.getElementById('query_results_thead');
        const queryResultsTbody = document.getElementById('query_results_tbody');
        const queryPaginationContainer = document.getElementById('query_pagination_container');
        const queryPageSize = document.getElementById('query_page_size');
        const queryResultCount = document.getElementById('query_result_count');

        let currentQuery = '';
        let currentPage = 1;
        let currentSortColumn = null;
        let currentSortDirection = 'asc';
        let queryResults = [];
        let queryColumns = [];
        let queryTotal = 0;
        let queryTotalPages = 0;
        let tablesCache = [];

        // Keyboard shortcuts
        if (querySql) {
            querySql.addEventListener('keydown', function(e) {
                // Ctrl+Enter to execute
                if (e.ctrlKey && e.key === 'Enter') {
                    e.preventDefault();
                    e.stopPropagation();
                    executeQuery();
                }
                // Ctrl+/ to comment/uncomment
                if (e.ctrlKey && e.key === '/') {
                    e.preventDefault();
                    const textarea = this;
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const text = textarea.value;
                    const selectedText = text.substring(start, end);
                    const lines = selectedText.split('\n');
                    const allCommented = lines.every(line => line.trim().startsWith('--'));
                    
                    const newLines = lines.map(line => {
                        if (allCommented) {
                            return line.replace(/^(\s*)--\s*/, '$1');
                        } else {
                            return line.trim() ? '-- ' + line : line;
                        }
                    });
                    
                    const newText = newLines.join('\n');
                    textarea.value = text.substring(0, start) + newText + text.substring(end);
                    textarea.selectionStart = start;
                    textarea.selectionEnd = start + newText.length;
                }
            });
        }

        // Clear button
        if (queryClearBtn) {
            queryClearBtn.addEventListener('click', function() {
                if (querySql) {
                    querySql.value = '';
                    querySql.focus();
                }
            });
        }

        // Execute query
        function executeQuery(page = 1, sortColumn = null, sortDirection = 'asc') {
            if (!querySql || !querySql.value.trim()) {
                Swal.fire({
                    text: 'Please enter a SQL query',
                    icon: 'warning',
                    buttonsStyling: false,
                    confirmButtonText: 'Ok, got it!',
                    customClass: { confirmButton: 'btn btn-primary' }
                });
                return;
            }

            currentQuery = querySql.value.trim();
            currentPage = page;
            currentSortColumn = sortColumn;
            currentSortDirection = sortDirection;

            queryExecuteBtn.setAttribute('data-kt-indicator', 'on');
            queryExecuteBtn.disabled = true;
            queryErrorContainer.style.display = 'none';
            queryResultsContainer.style.display = 'none';

            fetch('{{ route('royal-store.query.execute') }}', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': '{{ csrf_token() }}',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    query: currentQuery,
                    page: currentPage,
                    page_size: queryPageSize.value === 'all' ? 'all' : parseInt(queryPageSize.value),
                    sort_column: sortColumn,
                    sort_direction: sortDirection
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    queryResults = data.data || [];
                    queryColumns = data.columns || [];
                    queryTotal = data.total || 0;
                    queryTotalPages = data.total_pages || 0;

                    displayResults();
                    queryExportBtn.disabled = false;
                } else {
                    showQueryError(data.message || 'Query execution failed');
                }
            })
            .catch(error => {
                showQueryError('Error: ' + error.message);
            })
            .finally(() => {
                queryExecuteBtn.removeAttribute('data-kt-indicator');
                queryExecuteBtn.disabled = false;
            });
        }

        function displayResults() {
            // Build table header
            let theadHtml = '<tr>';
            if (queryColumns.length === 0) {
                // If no columns, show a placeholder
                theadHtml += '<th class="text-center">No columns available</th>';
            } else {
                queryColumns.forEach(col => {
                    const isSorted = col === currentSortColumn;
                    const sortIcon = isSorted 
                        ? (currentSortDirection === 'asc' ? '↑' : '↓')
                        : '⇅';
                    theadHtml += `<th style="cursor: pointer; user-select: none;" onclick="sortColumn('${col}')">
                        ${col} ${isSorted ? sortIcon : ''}
                    </th>`;
                });
            }
            theadHtml += '</tr>';
            queryResultsThead.innerHTML = theadHtml;

            // Build table body
            let tbodyHtml = '';
            if (queryResults.length === 0) {
                const colCount = queryColumns.length || 1;
                tbodyHtml = `<tr><td colspan="${colCount}" class="text-center text-muted">No results found</td></tr>`;
            } else {
                queryResults.forEach(row => {
                    tbodyHtml += '<tr>';
                    if (queryColumns.length === 0) {
                        // If no columns but we have data, show raw data
                        tbodyHtml += '<td class="text-center text-muted">Data available but columns unknown</td>';
                    } else {
                        queryColumns.forEach(col => {
                            const value = row[col] !== null && row[col] !== undefined ? row[col] : '';
                            tbodyHtml += `<td>${escapeHtml(String(value))}</td>`;
                        });
                    }
                    tbodyHtml += '</tr>';
                });
            }
            queryResultsTbody.innerHTML = tbodyHtml;

            // Update result count - check both queryTotal and actual results
            const isAllSelected = queryPageSize.value === 'all';
            if (queryTotal === 0 && queryResults.length === 0) {
                queryResultCount.textContent = 'No results found';
            } else {
                // If total is 0 but we have results, use the actual result count
                const actualTotal = queryTotal > 0 ? queryTotal : queryResults.length;
                if (isAllSelected) {
                    queryResultCount.textContent = `Showing all ${actualTotal} results`;
                } else {
                    const pageSize = parseInt(queryPageSize.value);
                    const startRow = queryResults.length > 0 ? ((currentPage - 1) * pageSize) + 1 : 0;
                    const endRow = queryResults.length > 0 ? Math.min(currentPage * pageSize, actualTotal) : 0;
                    queryResultCount.textContent = `Showing ${startRow} to ${endRow} of ${actualTotal} results`;
                }
            }

            // Build pagination
            buildPagination();

            queryResultsContainer.style.display = 'block';
        }

        function buildPagination() {
            if (queryTotalPages <= 1 || queryTotal === 0) {
                queryPaginationContainer.innerHTML = '';
                return;
            }

            let paginationHtml = '<div class="d-flex align-items-center">';
            
            // Previous button
            paginationHtml += `<button type="button" class="btn btn-sm btn-light ${currentPage === 1 ? 'disabled' : ''}" 
                onclick="event.preventDefault(); event.stopPropagation(); executeQuery(${currentPage - 1}); return false;" ${currentPage === 1 ? 'disabled' : ''}>
                Previous
            </button>`;

            // Page numbers
            paginationHtml += '<span class="mx-3">';
            const maxPages = 7;
            let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
            let endPage = Math.min(queryTotalPages, startPage + maxPages - 1);
            
            if (startPage > 1) {
                paginationHtml += `<button type="button" class="btn btn-sm btn-light me-1" onclick="event.preventDefault(); event.stopPropagation(); executeQuery(1); return false;">1</button>`;
                if (startPage > 2) paginationHtml += '<span class="me-1">...</span>';
            }
            
            for (let i = startPage; i <= endPage; i++) {
                paginationHtml += `<button type="button" class="btn btn-sm ${i === currentPage ? 'btn-primary' : 'btn-light'} me-1" 
                    onclick="event.preventDefault(); event.stopPropagation(); executeQuery(${i}); return false;">${i}</button>`;
            }
            
            if (endPage < queryTotalPages) {
                if (endPage < queryTotalPages - 1) paginationHtml += '<span class="me-1">...</span>';
                paginationHtml += `<button type="button" class="btn btn-sm btn-light me-1" onclick="event.preventDefault(); event.stopPropagation(); executeQuery(${queryTotalPages}); return false;">${queryTotalPages}</button>`;
            }
            
            paginationHtml += '</span>';

            // Next button
            paginationHtml += `<button type="button" class="btn btn-sm btn-light ${currentPage === queryTotalPages ? 'disabled' : ''}" 
                onclick="event.preventDefault(); event.stopPropagation(); executeQuery(${currentPage + 1}); return false;" ${currentPage === queryTotalPages ? 'disabled' : ''}>
                Next
            </button>`;
            
            paginationHtml += '</div>';

            queryPaginationContainer.innerHTML = paginationHtml;
        }

        function sortColumn(column) {
            const newDirection = (currentSortColumn === column && currentSortDirection === 'asc') ? 'desc' : 'asc';
            executeQuery(1, column, newDirection);
        }

        function showQueryError(message) {
            document.getElementById('query_error_message').innerHTML = escapeHtml(message);
            queryErrorContainer.style.display = 'block';
            queryResultsContainer.style.display = 'none';
        }

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        // Export button
        if (queryExportBtn) {
            queryExportBtn.addEventListener('click', function() {
                if (!currentQuery) {
                    Swal.fire({
                        text: 'No query to export',
                        icon: 'warning',
                        buttonsStyling: false,
                        confirmButtonText: 'Ok, got it!',
                        customClass: { confirmButton: 'btn btn-primary' }
                    });
                    return;
                }

                // Create a form to submit for CSV export
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = '{{ route('royal-store.query.export') }}';
                form.target = '_blank';
                
                const csrfInput = document.createElement('input');
                csrfInput.type = 'hidden';
                csrfInput.name = '_token';
                csrfInput.value = '{{ csrf_token() }}';
                form.appendChild(csrfInput);

                const queryInput = document.createElement('input');
                queryInput.type = 'hidden';
                queryInput.name = 'query';
                queryInput.value = currentQuery;
                form.appendChild(queryInput);

                const formatInput = document.createElement('input');
                formatInput.type = 'hidden';
                formatInput.name = 'format';
                formatInput.value = 'csv';
                form.appendChild(formatInput);

                document.body.appendChild(form);
                form.submit();
                document.body.removeChild(form);
            });
        }

        // Show tables button
        if (queryTablesBtn) {
            queryTablesBtn.addEventListener('click', function() {
                fetch('{{ route('royal-store.query.tables') }}', {
                    headers: {
                        'X-CSRF-TOKEN': '{{ csrf_token() }}',
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        tablesCache = data.tables || [];
                        let tablesList = tablesCache.map(t => 
                            `${t.TABSCHEMA ? t.TABSCHEMA + '.' : ''}${t.TABNAME}`
                        ).join('\n');
                        
                        if (querySql) {
                            querySql.value = `-- Available Tables:\n-- ${tablesList.split('\n').join('\n-- ')}\n\nSELECT * FROM `;
                            querySql.focus();
                            querySql.setSelectionRange(querySql.value.length, querySql.value.length);
                        }
                    } else {
                        Swal.fire({
                            text: data.message || 'Failed to load tables',
                            icon: 'error',
                            buttonsStyling: false,
                            confirmButtonText: 'Ok, got it!',
                            customClass: { confirmButton: 'btn btn-primary' }
                        });
                    }
                })
                .catch(error => {
                    Swal.fire({
                        text: 'Error: ' + error.message,
                        icon: 'error',
                        buttonsStyling: false,
                        confirmButtonText: 'Ok, got it!',
                        customClass: { confirmButton: 'btn btn-primary' }
                    });
                });
            });
        }

        // Store references to local functions before creating global wrappers
        const localExecuteQuery = executeQuery;
        const localSortColumn = sortColumn;
        
        // Make functions global for onclick handlers with form submission prevention
        // These wrappers are only for inline onclick handlers in pagination
        window.executeQuery = function(page, sortColumn, sortDirection) {
            // Prevent form submission if called from onclick
            if (window.event) {
                window.event.preventDefault();
                window.event.stopPropagation();
            }
            // Call the local executeQuery function
            localExecuteQuery(page, sortColumn, sortDirection);
            return false;
        };
        window.sortColumn = function(column) {
            // Prevent form submission if called from onclick
            if (window.event) {
                window.event.preventDefault();
                window.event.stopPropagation();
            }
            // Call the local sortColumn function
            localSortColumn(column);
            return false;
        };
        
        // Execute button - use local function directly
        if (queryExecuteBtn) {
            queryExecuteBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                localExecuteQuery();
            });
        }

        // Page size change - use local function directly
        if (queryPageSize) {
            queryPageSize.addEventListener('change', function() {
                if (currentQuery) {
                    localExecuteQuery(1);
                }
            });
        }
    </script>
    @endpush
</x-default-layout>

