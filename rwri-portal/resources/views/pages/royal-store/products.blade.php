<x-default-layout>
    @section('title')
        Products
    @endsection

    <div class="card">
        <div class="card-header border-0 pt-6">
            <div class="card-title">
                <h3 class="card-title">Products</h3>
            </div>
            <div class="card-toolbar">
                <button type="button" class="btn btn-sm btn-primary me-2" id="pullShopifyBtn">
                    <i class="ki-duotone ki-cloud-download fs-2">
                        <span class="path1"></span>
                        <span class="path2"></span>
                    </i>
                    Pull from Shopify
                </button>
                <button type="button" class="btn btn-sm btn-success" id="importSkusBtn">
                    <i class="ki-duotone ki-file-up fs-2">
                        <span class="path1"></span>
                        <span class="path2"></span>
                    </i>
                    Import SKUs
                </button>
            </div>
        </div>
        <div class="card-body pt-0">
            <div class="table-responsive">
                <table class="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4" id="productsTable">
                    <thead>
                        <tr class="fw-bold text-muted">
                            <th class="min-w-150px">Product Title</th>
                            <th class="min-w-100px">SKU</th>
                            <th class="min-w-100px">JDA SKU</th>
                            <th class="min-w-100px">JDA Price</th>
                            <th class="min-w-100px">JDA Inventory</th>
                            <th class="min-w-100px">Status</th>
                            <th class="min-w-100px">Vendor</th>
                            <th class="min-w-100px">Type</th>
                            <th class="min-w-100px text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($products as $product)
                            <tr>
                                <td>
                                    <div class="d-flex align-items-center">
                                        <div class="d-flex justify-content-start flex-column">
                                            <span class="text-dark fw-bold text-hover-primary mb-1 fs-6">{{ $product->title }}</span>
                                            <span class="text-muted fw-semibold text-muted d-block fs-7">{{ $product->handle }}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span class="text-dark fw-semibold d-block fs-7">{{ $product->shopify_product_id ?? 'N/A' }}</span>
                                </td>
                                <td>
                                    <span class="text-dark fw-semibold d-block fs-7">{{ $product->jda_sku ?? '-' }}</span>
                                </td>
                                <td>
                                    <span class="text-dark fw-semibold d-block fs-7">
                                        @if($product->jda_price)
                                            ${{ number_format($product->jda_price, 2) }}
                                        @else
                                            -
                                        @endif
                                    </span>
                                </td>
                                <td>
                                    <span class="text-dark fw-semibold d-block fs-7">
                                        @if($product->jda_inventory !== null)
                                            {{ $product->jda_inventory }}
                                        @else
                                            -
                                        @endif
                                    </span>
                                </td>
                                <td>
                                    @if($product->jda_status)
                                        <span class="badge badge-{{ $product->jda_status === 'processed' ? 'success' : ($product->jda_status === 'pending' ? 'warning' : 'danger') }}">
                                            {{ ucfirst($product->jda_status) }}
                                        </span>
                                    @else
                                        <span class="badge badge-light">No JDA Data</span>
                                    @endif
                                </td>
                                <td>
                                    <span class="text-muted fw-semibold text-muted d-block fs-7">{{ $product->vendor ?? '-' }}</span>
                                </td>
                                <td>
                                    <span class="text-muted fw-semibold text-muted d-block fs-7">{{ $product->product_type ?? '-' }}</span>
                                </td>
                                <td class="text-end">
                                    @php
                                        $module = \App\Models\Module::where('slug', 'royal-store')->first();
                                        $shopifyStore = $module ? $module->getSetting('shopify.store') : '';
                                        $shopifyStore = preg_replace('/^https?:\/\//', '', $shopifyStore);
                                        $shopifyStore = rtrim($shopifyStore, '/');
                                    @endphp
                                    @if($shopifyStore)
                                        <a href="https://{{ $shopifyStore }}/admin/products/{{ $product->shopify_product_id }}" target="_blank" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1">
                                    @else
                                        <span class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1" title="Shopify store not configured">
                                    @endif
                                        <i class="ki-duotone ki-eye fs-2">
                                            <span class="path1"></span>
                                            <span class="path2"></span>
                                            <span class="path3"></span>
                                        </i>
                                    @if($shopifyStore)
                                        </a>
                                    @else
                                        </span>
                                    @endif
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="9" class="text-center py-10">
                                    <div class="text-muted">No products found. Click "Pull from Shopify" to import products.</div>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

            @if($products->hasPages())
                <div class="d-flex justify-content-between align-items-center flex-wrap mt-5">
                    <div class="fs-7 fw-bold text-muted">
                        Showing {{ $products->firstItem() }} to {{ $products->lastItem() }} of {{ $products->total() }} entries
                    </div>
                    <div>
                        {{ $products->links() }}
                    </div>
                </div>
            @endif
        </div>
    </div>

    <!-- Import SKUs Modal -->
    <div class="modal fade" id="importSkusModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="fw-bold">Import SKUs from Excel</h2>
                    <div class="btn btn-icon btn-sm btn-active-icon-primary" data-bs-dismiss="modal">
                        <i class="ki-duotone ki-cross fs-1">
                            <span class="path1"></span>
                            <span class="path2"></span>
                        </i>
                    </div>
                </div>
                <form id="importSkusForm" enctype="multipart/form-data">
                    @csrf
                    <div class="modal-body">
                        <div class="mb-5">
                            <label class="required fw-semibold fs-6 mb-2">Excel File</label>
                            <input type="file" class="form-control" name="file" accept=".xlsx,.xls" required>
                            <div class="form-text">Upload Excel file (.xlsx or .xls) with SKU data. Maximum file size: 10MB</div>
                        </div>
                        <div class="alert alert-info d-flex align-items-center p-5">
                            <i class="ki-duotone ki-information-5 fs-2hx text-info me-4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                            </i>
                            <div class="d-flex flex-column">
                                <h4 class="mb-1">Import Instructions</h4>
                                <span>The Excel file should contain columns such as: SKU, Product Name, Price, Inventory, etc. Products will be created in Shopify if they don't exist.</span>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary" id="importSkusSubmitBtn">
                            <span class="indicator-label">Import</span>
                            <span class="indicator-progress">Please wait...
                                <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    @push('scripts')
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Pull from Shopify button
            document.getElementById('pullShopifyBtn').addEventListener('click', function() {
                const btn = this;
                const originalHtml = btn.innerHTML;
                
                btn.disabled = true;
                btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Pulling...';

                fetch('{{ route("royal-store.products.pull-shopify") }}', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': '{{ csrf_token() }}'
                    }
                })
                .then(response => response.json())
                .then(data => {
                    btn.disabled = false;
                    btn.innerHTML = originalHtml;
                    
                    if (data.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: data.message || 'Products pulled successfully',
                            timer: 3000,
                            showConfirmButton: false
                        }).then(() => {
                            location.reload();
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: data.message || 'Failed to pull products'
                        });
                    }
                })
                .catch(error => {
                    btn.disabled = false;
                    btn.innerHTML = originalHtml;
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'An error occurred while pulling products'
                    });
                });
            });

            // Import SKUs button
            document.getElementById('importSkusBtn').addEventListener('click', function() {
                const modal = new bootstrap.Modal(document.getElementById('importSkusModal'));
                modal.show();
            });

            // Import SKUs form submission
            document.getElementById('importSkusForm').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const form = this;
                const formData = new FormData(form);
                const submitBtn = document.getElementById('importSkusSubmitBtn');
                const indicator = submitBtn.querySelector('.indicator-progress');
                const label = submitBtn.querySelector('.indicator-label');
                
                submitBtn.setAttribute('data-kt-indicator', 'on');
                submitBtn.disabled = true;
                label.style.display = 'none';
                indicator.style.display = 'inline-block';

                fetch('{{ route("royal-store.products.import-skus") }}', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRF-TOKEN': '{{ csrf_token() }}'
                    }
                })
                .then(response => response.json())
                .then(data => {
                    submitBtn.removeAttribute('data-kt-indicator');
                    submitBtn.disabled = false;
                    label.style.display = 'inline-block';
                    indicator.style.display = 'none';

                    if (data.success) {
                        const modal = bootstrap.Modal.getInstance(document.getElementById('importSkusModal'));
                        modal.hide();
                        
                        let message = data.message || 'SKUs imported successfully';
                        if (data.imported || data.updated) {
                            message += `\nImported: ${data.imported || 0}, Updated: ${data.updated || 0}`;
                        }
                        if (data.errors && data.errors.length > 0) {
                            message += `\n\nErrors:\n${data.errors.join('\n')}`;
                        }

                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            html: message.replace(/\n/g, '<br>'),
                            timer: 5000,
                            showConfirmButton: true
                        }).then(() => {
                            location.reload();
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: data.message || 'Failed to import SKUs'
                        });
                    }
                })
                .catch(error => {
                    submitBtn.removeAttribute('data-kt-indicator');
                    submitBtn.disabled = false;
                    label.style.display = 'inline-block';
                    indicator.style.display = 'none';
                    
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'An error occurred while importing SKUs'
                    });
                });
            });
        });
    </script>
    @endpush
</x-default-layout>
