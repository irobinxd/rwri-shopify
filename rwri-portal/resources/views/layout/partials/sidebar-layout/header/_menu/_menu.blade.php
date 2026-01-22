<!--begin::Menu wrapper-->
<div class="app-header-menu app-header-mobile-drawer align-items-stretch" data-kt-drawer="true" data-kt-drawer-name="app-header-menu" data-kt-drawer-activate="{default: true, lg: false}" data-kt-drawer-overlay="true" data-kt-drawer-width="250px" data-kt-drawer-direction="end" data-kt-drawer-toggle="#kt_app_header_menu_toggle" data-kt-swapper="true" data-kt-swapper-mode="{default: 'append', lg: 'prepend'}" data-kt-swapper-parent="{default: '#kt_app_body', lg: '#kt_app_header_wrapper'}">
	<!--begin::Menu-->
	<div class="menu menu-rounded menu-column menu-lg-row my-5 my-lg-0 align-items-stretch fw-semibold px-2 px-lg-0" id="kt_app_header_menu" data-kt-menu="true">
		<!--begin:Menu item-->
		<div class="menu-item">
			<!--begin:Menu link-->
			<a class="menu-link" href="{{ route('dashboard') }}">
				<span class="menu-title">Dashboard</span>
			</a>
			<!--end:Menu link-->
		</div>
		<!--end:Menu item-->
		<!--begin:Menu item-->
		<div data-kt-menu-trigger="{default: 'click', lg: 'hover'}" data-kt-menu-placement="bottom-start" class="menu-item menu-lg-down-accordion me-0 me-lg-2">
			<!--begin:Menu link-->
			<span class="menu-link">
				<span class="menu-title">Royal Store</span>
				<span class="menu-arrow d-lg-none"></span>
			</span>
			<!--end:Menu link-->
			<!--begin:Menu sub-->
			<div class="menu-sub menu-sub-lg-down-accordion menu-sub-lg-dropdown px-lg-2 py-lg-4 w-lg-200px">
				<!--begin:Menu item-->
				<div class="menu-item">
					<!--begin:Menu link-->
					<a class="menu-link" href="{{ route('royal-store.dashboard') }}">
						<span class="menu-bullet">
							<span class="bullet bullet-dot"></span>
						</span>
						<span class="menu-title">Dashboard</span>
					</a>
					<!--end:Menu link-->
				</div>
				<!--end:Menu item-->
				<!--begin:Menu item-->
				<div class="menu-item">
					<!--begin:Menu link-->
					<a class="menu-link" href="{{ route('royal-store.products') }}">
						<span class="menu-bullet">
							<span class="bullet bullet-dot"></span>
						</span>
						<span class="menu-title">Products</span>
					</a>
					<!--end:Menu link-->
				</div>
				<!--end:Menu item-->
				<!--begin:Menu item-->
				<div class="menu-item">
					<!--begin:Menu link-->
					<a class="menu-link" href="{{ route('royal-store.shopify-pull') }}">
						<span class="menu-bullet">
							<span class="bullet bullet-dot"></span>
						</span>
						<span class="menu-title">Pull Shopify Data</span>
					</a>
					<!--end:Menu link-->
				</div>
				<!--end:Menu item-->
				<!--begin:Menu item-->
				<div class="menu-item">
					<!--begin:Menu link-->
					<a class="menu-link" href="{{ route('royal-store.locations') }}">
						<span class="menu-bullet">
							<span class="bullet bullet-dot"></span>
						</span>
						<span class="menu-title">Location Mapping</span>
					</a>
					<!--end:Menu link-->
				</div>
				<!--end:Menu item-->
				<!--begin:Menu item-->
				<div class="menu-item">
					<!--begin:Menu link-->
					<a class="menu-link" href="{{ route('royal-store.inventory') }}">
						<span class="menu-bullet">
							<span class="bullet bullet-dot"></span>
						</span>
						<span class="menu-title">Inventory Sync</span>
					</a>
					<!--end:Menu link-->
				</div>
				<!--end:Menu item-->
				<!--begin:Menu item-->
				<div class="menu-item">
					<!--begin:Menu link-->
					<a class="menu-link" href="{{ route('royal-store.prices') }}">
						<span class="menu-bullet">
							<span class="bullet bullet-dot"></span>
						</span>
						<span class="menu-title">Price Sync</span>
					</a>
					<!--end:Menu link-->
				</div>
				<!--end:Menu item-->
				<!--begin:Menu item-->
				<div class="menu-item">
					<!--begin:Menu link-->
					<a class="menu-link" href="{{ route('royal-store.sync-history') }}">
						<span class="menu-bullet">
							<span class="bullet bullet-dot"></span>
						</span>
						<span class="menu-title">Sync History</span>
					</a>
					<!--end:Menu link-->
				</div>
				<!--end:Menu item-->
				<!--begin:Menu item-->
				<div class="menu-item">
					<!--begin:Menu link-->
					<a class="menu-link" href="{{ route('royal-store.settings') }}">
						<span class="menu-bullet">
							<span class="bullet bullet-dot"></span>
						</span>
						<span class="menu-title">Settings</span>
					</a>
					<!--end:Menu link-->
				</div>
				<!--end:Menu item-->
			</div>
			<!--end:Menu sub-->
		</div>
		<!--end:Menu item-->
		<!--begin:Menu item-->
		<div data-kt-menu-trigger="{default: 'click', lg: 'hover'}" data-kt-menu-placement="bottom-start" class="menu-item menu-lg-down-accordion me-0 me-lg-2">
			<!--begin:Menu link-->
			<span class="menu-link">
				<span class="menu-title">Web Stores</span>
				<span class="menu-arrow d-lg-none"></span>
			</span>
			<!--end:Menu link-->
			<!--begin:Menu sub-->
			<div class="menu-sub menu-sub-lg-down-accordion menu-sub-lg-dropdown px-lg-2 py-lg-4 w-lg-200px">
				<!--begin:Menu item-->
				<div class="menu-item">
					<!--begin:Menu link-->
					<a class="menu-link" href="{{ route('web-stores.dashboard') }}">
						<span class="menu-bullet">
							<span class="bullet bullet-dot"></span>
						</span>
						<span class="menu-title">Dashboard</span>
					</a>
					<!--end:Menu link-->
				</div>
				<!--end:Menu item-->
				<!--begin:Menu item-->
				<div class="menu-item">
					<!--begin:Menu link-->
					<a class="menu-link" href="{{ route('web-stores.stores.index') }}">
						<span class="menu-bullet">
							<span class="bullet bullet-dot"></span>
						</span>
						<span class="menu-title">Stores</span>
					</a>
					<!--end:Menu link-->
				</div>
				<!--end:Menu item-->
				<!--begin:Menu item-->
				<div class="menu-item">
					<!--begin:Menu link-->
					<a class="menu-link" href="{{ route('web-stores.products.index') }}">
						<span class="menu-bullet">
							<span class="bullet bullet-dot"></span>
						</span>
						<span class="menu-title">Products</span>
					</a>
					<!--end:Menu link-->
				</div>
				<!--end:Menu item-->
				<!--begin:Menu item-->
				<div class="menu-item">
					<!--begin:Menu link-->
					<a class="menu-link" href="{{ route('web-stores.inventory.index') }}">
						<span class="menu-bullet">
							<span class="bullet bullet-dot"></span>
						</span>
						<span class="menu-title">Inventory</span>
					</a>
					<!--end:Menu link-->
				</div>
				<!--end:Menu item-->
				<!--begin:Menu item-->
				<div class="menu-item">
					<!--begin:Menu link-->
					<a class="menu-link" href="{{ route('web-stores.settings') }}">
						<span class="menu-bullet">
							<span class="bullet bullet-dot"></span>
						</span>
						<span class="menu-title">Settings</span>
					</a>
					<!--end:Menu link-->
				</div>
				<!--end:Menu item-->
			</div>
			<!--end:Menu sub-->
		</div>
		<!--end:Menu item-->
		<!--begin:Menu item-->
		<div data-kt-menu-trigger="{default: 'click', lg: 'hover'}" data-kt-menu-placement="bottom-start" class="menu-item menu-lg-down-accordion me-0 me-lg-2">
			<!--begin:Menu link-->
			<span class="menu-link">
				<span class="menu-title">User Management</span>
				<span class="menu-arrow d-lg-none"></span>
			</span>
			<!--end:Menu link-->
			<!--begin:Menu sub-->
			<div class="menu-sub menu-sub-lg-down-accordion menu-sub-lg-dropdown px-lg-2 py-lg-4 w-lg-200px">
				<!--begin:Menu item-->
				<div class="menu-item">
					<!--begin:Menu link-->
					<a class="menu-link" href="{{ route('user-management.users.index') }}">
						<span class="menu-bullet">
							<span class="bullet bullet-dot"></span>
						</span>
						<span class="menu-title">Users</span>
					</a>
					<!--end:Menu link-->
				</div>
				<!--end:Menu item-->
				<!--begin:Menu item-->
				<div class="menu-item">
					<!--begin:Menu link-->
					<a class="menu-link" href="{{ route('user-management.roles.index') }}">
						<span class="menu-bullet">
							<span class="bullet bullet-dot"></span>
						</span>
						<span class="menu-title">Roles</span>
					</a>
					<!--end:Menu link-->
				</div>
				<!--end:Menu item-->
				<!--begin:Menu item-->
				<div class="menu-item">
					<!--begin:Menu link-->
					<a class="menu-link" href="{{ route('user-management.permissions.index') }}">
						<span class="menu-bullet">
							<span class="bullet bullet-dot"></span>
						</span>
						<span class="menu-title">Permissions</span>
					</a>
					<!--end:Menu link-->
				</div>
				<!--end:Menu item-->
			</div>
			<!--end:Menu sub-->
		</div>
		<!--end:Menu item-->
	</div>
	<!--end::Menu-->
</div>
<!--end::Menu wrapper-->
