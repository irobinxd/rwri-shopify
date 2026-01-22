<x-default-layout>

    @section('title')
        Roles List
    @endsection

    @section('breadcrumbs')
        {{ Breadcrumbs::render('user-management.roles.index') }}
    @endsection

    <!--begin::Content container-->
    <div id="kt_app_content_container" class="app-container container-xxl">
        <!--begin::Card-->
        <div class="card">
            <!--begin::Card header-->
            <div class="card-header border-0 pt-6">
                <!--begin::Card title-->
                <div class="card-title">
                    <h2 class="fw-bold">Roles List</h2>
                </div>
                <!--end::Card title-->
                <!--begin::Card toolbar-->
                <div class="card-toolbar">
                    <!--begin::Toolbar-->
                    <div class="d-flex justify-content-end gap-2">
                        <!--begin::Add role-->
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#kt_modal_edit_role" data-role-id="">
                            {!! getIcon('plus', 'fs-2 text-white') !!}
                            Add Role
                        </button>
                        <!--end::Add role-->
                        <!--begin::Export-->
                        <button type="button" class="btn btn-success" id="kt_roles_export_excel">
                            {!! getIcon('file-down', 'fs-2 text-white') !!}
                            Export to Excel
                        </button>
                        <!--end::Export-->
                    </div>
                    <!--end::Toolbar-->
                </div>
                <!--end::Card toolbar-->
            </div>
            <!--end::Card header-->
            <!--begin::Card body-->
            <div class="card-body py-4">
                <!--begin::Table-->
                {!! $dataTable->table(['id' => 'roles-table', 'class' => 'table align-middle table-row-dashed fs-6 gy-5']) !!}
                <!--end::Table-->
            </div>
            <!--end::Card body-->
        </div>
        <!--end::Card-->
    </div>
    <!--end::Content container-->

    <!--begin::Modal - Edit Role-->
    <livewire:permission.role-modal></livewire:permission.role-modal>
    <!--end::Modal - Edit Role-->

@push('scripts')
    <!-- Load DataTables from CDN -->
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.7/css/jquery.dataTables.min.css">
    <script src="https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js"></script>
    
    <script>
        console.log('Roles DataTable script loaded');
        
        document.addEventListener('DOMContentLoaded', function() {
            function waitForDataTables(callback, maxAttempts = 100) {
                let attempts = 0;
                
                function check() {
                    attempts++;
                    console.log('Checking for DataTables... attempt', attempts);
                    
                    if (typeof $ !== 'undefined' && typeof $.fn.dataTable !== 'undefined') {
                        console.log('DataTables library is available!');
                        callback();
                    } else if (attempts < maxAttempts) {
                        setTimeout(check, 100);
                    } else {
                        console.error('DataTables library not loaded after', maxAttempts, 'attempts');
                    }
                }
                
                check();
            }
            
            waitForDataTables(function() {
                console.log('jQuery and DataTables ready, initializing Roles DataTable...');
                
                // Wait for table element to be available
                function initDataTable() {
                    const tableEl = document.getElementById('roles-table');
                    
                    if (!tableEl) {
                        console.log('Table not found, retrying...');
                        setTimeout(initDataTable, 100);
                        return;
                    }
                    
                    // Check if already initialized
                    if ($.fn.dataTable.isDataTable('#roles-table')) {
                        console.log('DataTable already initialized');
                        window.rolesDataTable = $('#roles-table').DataTable();
                        setupExport();
                        return;
                    }
                    
                    // Initialize DataTable
                    console.log('Initializing Roles DataTable...');
                    try {
                        window.rolesDataTable = $('#roles-table').DataTable({
                            processing: true,
                            serverSide: true,
                            ajax: {
                                url: '{{ route("user-management.roles.index") }}',
                                type: 'GET',
                                error: function(xhr, error, thrown) {
                                    console.error('DataTable AJAX error:', error, thrown);
                                    console.error('Status:', xhr.status);
                                    console.error('Response:', xhr.responseText);
                                }
                            },
                            columns: [
                                { data: 'id', name: 'id', orderable: true, searchable: true },
                                { data: 'name', name: 'name', orderable: true, searchable: true },
                                { data: 'status', name: 'status', orderable: false, searchable: false },
                                { data: 'action', name: 'action', orderable: false, searchable: false }
                            ],
                            order: [[0, 'desc']],
                            pageLength: 10,
                            dom: "<'row'<'col-sm-12 col-md-5'l><'col-sm-12 col-md-7'f>>rt<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>"
                        });
                        
                        console.log('Roles DataTable initialized successfully!');
                        setupExport();
                    } catch (error) {
                        console.error('Error initializing DataTable:', error);
                    }
                }
                
                function setupExport() {
                    document.getElementById('kt_roles_export_excel')?.addEventListener('click', function() {
                        // TODO: Implement Excel export
                        alert('Export to Excel functionality will be implemented');
                    });
                }
                
                // Start initialization
                setTimeout(initDataTable, 300);
            });
        });
    </script>
@endpush

</x-default-layout>
