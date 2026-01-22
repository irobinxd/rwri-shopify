<x-default-layout>

    @section('title')
        Users
    @endsection

    @section('breadcrumbs')
        {{ Breadcrumbs::render('user-management.users.index') }}
    @endsection

    <!--begin::Content container-->
    <div id="kt_app_content_container" class="app-container container-xxl">
        <!--begin::Card-->
        <div class="card">
            <!--begin::Card header-->
            <div class="card-header border-0 pt-6">
                <!--begin::Card title-->
                <div class="card-title">
                    <!--begin::Search-->
                    <div class="d-flex align-items-center position-relative my-1">
                        {!! getIcon('magnifier', 'fs-3 position-absolute ms-5') !!}
                        <input type="text" id="users-search-input" class="form-control form-control-solid w-250px ps-13" placeholder="Search Users" />
                    </div>
                    <!--end::Search-->
                </div>
                <!--end::Card title-->
                <!--begin::Card toolbar-->
                <div class="card-toolbar">
                    <!--begin::Toolbar-->
                    <div class="d-flex justify-content-end">
                        <!--begin::Add user-->
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#kt_modal_add_user">
                            {!! getIcon('plus', 'fs-2 text-white') !!}
                            Add User
                        </button>
                        <!--end::Add user-->
                    </div>
                    <!--end::Toolbar-->
                </div>
                <!--end::Card toolbar-->
            </div>
            <!--end::Card header-->
            <!--begin::Card body-->
            <div class="card-body py-4">
                <!--begin::Table-->
                {!! $dataTable->table(['id' => 'users-table', 'class' => 'table align-middle table-row-dashed fs-6 gy-5']) !!}
                <!--end::Table-->
            </div>
            <!--end::Card body-->
        </div>
        <!--end::Card-->
    </div>
    <!--end::Content container-->

    <!--begin::Modal - Add user-->
    <livewire:user.add-user-modal></livewire:user.add-user-modal>
    <!--end::Modal - Add user-->

@push('scripts')
    <!-- Load DataTables from CDN -->
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.7/css/jquery.dataTables.min.css">
    <script src="https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js"></script>
    
    <script>
        console.log('Users DataTable script loaded');
        
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
                console.log('jQuery and DataTables ready, initializing DataTable...');
                
                // Wait for table element to be available
                function initDataTable() {
                    const tableEl = document.getElementById('users-table');
                    
                    if (!tableEl) {
                        console.log('Table not found, retrying...');
                        setTimeout(initDataTable, 100);
                        return;
                    }
                    
                    // Check if already initialized
                    if ($.fn.dataTable.isDataTable('#users-table')) {
                        console.log('DataTable already initialized');
                        window.usersDataTable = $('#users-table').DataTable();
                        setupSearch();
                        return;
                    }
                    
                    // Initialize DataTable
                    console.log('Initializing Users DataTable...');
                    try {
                        window.usersDataTable = $('#users-table').DataTable({
                            processing: true,
                            serverSide: true,
                            ajax: {
                                url: '{{ route("user-management.users.index") }}',
                                type: 'GET',
                                error: function(xhr, error, thrown) {
                                    console.error('DataTable AJAX error:', error, thrown);
                                    console.error('Status:', xhr.status);
                                    console.error('Response:', xhr.responseText);
                                }
                            },
                            columns: [
                                { data: 'user', name: 'name', orderable: true, searchable: true },
                                { data: 'role', name: 'role', orderable: false, searchable: false },
                                { data: 'last_login_at', name: 'last_login_at', orderable: true, searchable: false },
                                { data: 'created_at', name: 'created_at', orderable: true, searchable: false },
                                { data: 'action', name: 'action', orderable: false, searchable: false }
                            ],
                            order: [[2, 'desc']],
                            pageLength: 10,
                            dom: "<'row'<'col-sm-12 col-md-5'l><'col-sm-12 col-md-7'f>>rt<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>"
                        });
                        
                        console.log('DataTable initialized successfully!');
                        setupSearch();
                    } catch (error) {
                        console.error('Error initializing DataTable:', error);
                    }
                }
                
                function setupSearch() {
                    const searchInput = document.getElementById('users-search-input');
                    if (searchInput && window.usersDataTable) {
                        let searchTimeout;
                        searchInput.addEventListener('keyup', function() {
                            clearTimeout(searchTimeout);
                            searchTimeout = setTimeout(function() {
                                if (window.usersDataTable) {
                                    window.usersDataTable.search(searchInput.value).draw();
                                }
                            }, 300);
                        });
                    }
                }
                
                // Start initialization
                setTimeout(initDataTable, 300);
            });
        });
        
        // Use event delegation for action buttons (works with dynamically loaded content)
        $(document).on('click', '[data-kt-action="update_row"]', function(e) {
            e.preventDefault();
            const userId = $(this).attr('data-kt-user-id');
            if (userId) {
                // Wait for Livewire to be available
                function dispatchUpdate() {
                    if (typeof Livewire !== 'undefined') {
                        Livewire.dispatch('update_user', [userId]);
                    } else {
                        setTimeout(dispatchUpdate, 100);
                    }
                }
                dispatchUpdate();
            }
        });
        
        $(document).on('click', '[data-kt-action="delete_row"]', function(e) {
            e.preventDefault();
            const userId = $(this).attr('data-kt-user-id');
            if (userId) {
                Swal.fire({
                    text: 'Are you sure you want to remove?',
                    icon: 'warning',
                    buttonsStyling: false,
                    showCancelButton: true,
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',
                    customClass: {
                        confirmButton: 'btn btn-danger',
                        cancelButton: 'btn btn-secondary',
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Wait for Livewire
                        function dispatchDelete() {
                            if (typeof Livewire !== 'undefined') {
                                Livewire.dispatch('delete_user', [userId]);
                            } else {
                                setTimeout(dispatchDelete, 100);
                            }
                        }
                        dispatchDelete();
                    }
                });
            }
        });
        
        // Listen for refresh event to reload DataTable
        // Wait for Livewire to be available
        function setupLivewireListeners() {
            if (typeof Livewire !== 'undefined') {
                Livewire.on('refresh-users-table', function() {
                    if (window.usersDataTable) {
                        window.usersDataTable.ajax.reload(null, false);
                    }
                });
                
                // Listen for success event to reload DataTable
                Livewire.on('success', function(message) {
                    if (window.usersDataTable) {
                        window.usersDataTable.ajax.reload(null, false);
                    }
                });
            } else {
                setTimeout(setupLivewireListeners, 100);
            }
        }
        setupLivewireListeners();
    </script>
@endpush

</x-default-layout>
