
<!--begin::Search-->
<div id="kt_header_search" class="header-search d-flex align-items-stretch"
	data-kt-menu-trigger="auto"
	data-kt-menu-overflow="false" 
	data-kt-menu-permanent="true" 
	data-kt-menu-placement="bottom-end">
	<!--begin::Search toggle-->
	<div class="d-flex align-items-center" id="kt_header_search_toggle">
		<div
			class="btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px w-md-40px h-md-40px">
			{!! getIcon('magnifier', 'fs-2') !!}
		</div>
	</div>
	<!--end::Search toggle-->
	<!--begin::Menu-->
	<div class="menu menu-sub menu-sub-dropdown p-7 w-325px w-md-375px" id="kt_search_content">
		<!--begin::Wrapper-->
		<div id="kt_search_wrapper">
			@include(config('settings.KT_THEME_LAYOUT_DIR').'/partials/sidebar-layout/search/partials/_form-dropdown')

			@include(config('settings.KT_THEME_LAYOUT_DIR').'/partials/sidebar-layout/search/partials/_results')

		@include(config('settings.KT_THEME_LAYOUT_DIR').'/partials/sidebar-layout/search/partials/_empty')
	</div>
	<!--end::Wrapper-->
	@include(config('settings.KT_THEME_LAYOUT_DIR').'/partials/sidebar-layout/search/partials/_advanced-options')
	</div>
	<!--end::Menu-->
</div>
<!--end::Search-->

@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('kt_search_input');
    const searchResults = document.getElementById('kt_search_results');
    const resultsContainer = document.getElementById('search-results-container');
    const searchSpinner = document.querySelector('#kt_header_search .search-spinner');
    const searchClear = document.querySelector('#kt_header_search .search-reset');
    const searchMain = document.getElementById('kt_search_main');
    const searchEmpty = document.getElementById('kt_search_empty');
    
    let searchTimeout;
    let currentSearchQuery = '';

    if (!searchInput) return;

    function performSearch(query) {
        if (query.length < 2) {
            hideResults();
            hideMain();
            return;
        }

        currentSearchQuery = query;
        showSpinner();
        hideResults();
        hideMain();
        hideEmpty();

        fetch(`{{ route('search') }}?q=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            hideSpinner();
            
            if (data.success && data.results) {
                displayResults(data.results, query);
            } else {
                showEmpty();
            }
        })
        .catch(error => {
            hideSpinner();
            console.error('Search error:', error);
            showEmpty();
        });
    }

    function displayResults(results, query) {
        if (!resultsContainer) return;

        let html = '';
        let hasResults = false;

        // Menus
        if (results.menus && results.menus.length > 0) {
            hasResults = true;
            html += '<h3 class="fs-5 text-muted m-0 pb-5">Menus</h3>';
            results.menus.forEach(menu => {
                const iconHtml = menu.icon ? `<i class="ki-duotone ki-${menu.icon} fs-2 text-primary"><span class="path1"></span><span class="path2"></span></i>` : '<span class="fs-2">📋</span>';
                html += `
                    <a href="${menu.route || '#'}" class="d-flex text-gray-900 text-hover-primary align-items-center mb-5">
                        <div class="symbol symbol-40px me-4">
                            <span class="symbol-label bg-light">
                                ${iconHtml}
                            </span>
                        </div>
                        <div class="d-flex flex-column justify-content-start fw-semibold">
                            <span class="fs-6 fw-semibold">${highlightText(menu.name, query)}</span>
                            <span class="fs-7 fw-semibold text-muted">${menu.module}</span>
                        </div>
                    </a>
                `;
            });
        }

        // Products
        if (results.products && results.products.length > 0) {
            hasResults = true;
            html += '<h3 class="fs-5 text-muted m-0 pt-5 pb-5">Products</h3>';
            results.products.forEach(product => {
                html += `
                    <a href="${product.route || '#'}" class="d-flex text-gray-900 text-hover-primary align-items-center mb-5">
                        <div class="symbol symbol-40px me-4">
                            <span class="symbol-label bg-light">
                                <i class="ki-duotone ki-package fs-2 text-primary"><span class="path1"></span><span class="path2"></span></i>
                            </span>
                        </div>
                        <div class="d-flex flex-column justify-content-start fw-semibold">
                            <span class="fs-6 fw-semibold">${highlightText(product.name, query)}</span>
                            ${product.subtitle ? `<span class="fs-7 fw-semibold text-muted">${product.subtitle}</span>` : ''}
                        </div>
                    </a>
                `;
            });
        }

        // SKUs
        if (results.skus && results.skus.length > 0) {
            hasResults = true;
            html += '<h3 class="fs-5 text-muted m-0 pt-5 pb-5">SKUs</h3>';
            results.skus.forEach(sku => {
                html += `
                    <a href="${sku.route || '#'}" class="d-flex text-gray-900 text-hover-primary align-items-center mb-5">
                        <div class="symbol symbol-40px me-4">
                            <span class="symbol-label bg-light">
                                <i class="ki-duotone ki-barcode fs-2 text-primary"><span class="path1"></span><span class="path2"></span></i>
                            </span>
                        </div>
                        <div class="d-flex flex-column justify-content-start fw-semibold">
                            <span class="fs-6 fw-semibold">${highlightText(sku.name, query)}</span>
                            ${sku.subtitle ? `<span class="fs-7 fw-semibold text-muted">${sku.subtitle}</span>` : ''}
                        </div>
                    </a>
                `;
            });
        }

        // Users
        if (results.users && results.users.length > 0) {
            hasResults = true;
            html += '<h3 class="fs-5 text-muted m-0 pt-5 pb-5">Users</h3>';
            results.users.forEach(user => {
                html += `
                    <a href="${user.route || '#'}" class="d-flex text-gray-900 text-hover-primary align-items-center mb-5">
                        <div class="symbol symbol-40px me-4">
                            <span class="symbol-label bg-light">
                                <i class="ki-duotone ki-profile-circle fs-2 text-primary"><span class="path1"></span><span class="path2"></span></i>
                            </span>
                        </div>
                        <div class="d-flex flex-column justify-content-start fw-semibold">
                            <span class="fs-6 fw-semibold">${highlightText(user.name, query)}</span>
                            ${user.subtitle ? `<span class="fs-7 fw-semibold text-muted">${user.subtitle}</span>` : ''}
                        </div>
                    </a>
                `;
            });
        }

        if (hasResults) {
            resultsContainer.innerHTML = html;
            showResults();
        } else {
            showEmpty();
        }
    }

    function highlightText(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    function showResults() {
        if (searchResults) {
            searchResults.classList.remove('d-none');
        }
        if (searchClear) {
            searchClear.classList.remove('d-none');
        }
    }

    function hideResults() {
        if (searchResults) {
            searchResults.classList.add('d-none');
        }
    }

    function showSpinner() {
        if (searchSpinner) {
            searchSpinner.classList.remove('d-none');
        }
    }

    function hideSpinner() {
        if (searchSpinner) {
            searchSpinner.classList.add('d-none');
        }
    }

    function showMain() {
        if (searchMain) {
            searchMain.classList.remove('d-none');
        }
    }

    function hideMain() {
        if (searchMain) {
            searchMain.classList.add('d-none');
        }
    }

    function showEmpty() {
        if (searchEmpty) {
            searchEmpty.classList.remove('d-none');
        }
        hideResults();
    }

    function hideEmpty() {
        if (searchEmpty) {
            searchEmpty.classList.add('d-none');
        }
    }

    // Handle input
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.trim();
        
        clearTimeout(searchTimeout);
        
        if (query.length >= 2) {
            searchTimeout = setTimeout(() => {
                performSearch(query);
            }, 300); // Debounce 300ms
        } else {
            hideResults();
            hideMain();
            if (searchClear) {
                searchClear.classList.add('d-none');
            }
        }
    });

    // Handle clear
        if (searchClear) {
            searchClear.addEventListener('click', function(e) {
                e.preventDefault();
                searchInput.value = '';
                hideResults();
                hideMain();
                searchClear.classList.add('d-none');
                searchInput.focus();
            });
        }

    // Handle Enter key
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = e.target.value.trim();
            if (query.length >= 2) {
                performSearch(query);
            }
        }
    });
});
</script>
@endpush