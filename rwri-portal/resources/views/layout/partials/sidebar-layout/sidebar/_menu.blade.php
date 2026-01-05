<!--begin::sidebar menu-->
<div class="app-sidebar-menu overflow-hidden flex-column-fluid">
	<!--begin::Menu wrapper-->
	<div id="kt_app_sidebar_menu_wrapper" class="app-sidebar-wrapper hover-scroll-overlay-y my-5" data-kt-scroll="true" data-kt-scroll-activate="true" data-kt-scroll-height="auto" data-kt-scroll-dependencies="#kt_app_sidebar_logo, #kt_app_sidebar_footer" data-kt-scroll-wrappers="#kt_app_sidebar_menu" data-kt-scroll-offset="5px" data-kt-scroll-save-state="true">
		<!--begin::Menu-->
		<div class="menu menu-column menu-rounded menu-sub-indention px-3 fw-semibold fs-6" id="#kt_app_sidebar_menu" data-kt-menu="true" data-kt-menu-expand="false">
			@auth
				<!--begin:Menu item - Dashboard-->
				<div class="menu-item">
					<!--begin:Menu link-->
					<a class="menu-link {{ request()->routeIs('dashboard') ? 'active' : '' }}" href="{{ route('dashboard') }}">
						<span class="menu-icon">{!! getIcon('element-11', 'fs-2') !!}</span>
						<span class="menu-title">Dashboard</span>
					</a>
					<!--end:Menu link-->
				</div>
				<!--end:Menu item-->

				@php
					$modules = auth()->user()->getAccessibleModules();
					$menus = auth()->user()->getAccessibleMenus();
				@endphp

				@if($modules->count() > 0)
					<!--begin:Menu item-->
					<div class="menu-item pt-5">
						<!--begin:Menu content-->
						<div class="menu-content">
							<span class="menu-heading fw-bold text-uppercase fs-7">Modules</span>
						</div>
						<!--end:Menu content-->
					</div>
					<!--end:Menu item-->

					@foreach($modules as $module)
						@php
							$moduleMenus = $menus->where('module_id', $module->id);
							$hasActiveMenu = $moduleMenus->contains(function($menu) {
								return $menu->route_name && request()->routeIs($menu->route_name);
							});
						@endphp
						
						<!--begin:Menu item-->
						<div data-kt-menu-trigger="click" class="menu-item menu-accordion {{ $hasActiveMenu ? 'here show' : '' }}">
							<!--begin:Menu link-->
							<span class="menu-link">
								@if($module->icon)
									<span class="menu-icon">{!! $module->icon !!}</span>
								@else
									<span class="menu-icon">{!! getIcon('abstract-28', 'fs-2') !!}</span>
								@endif
								<span class="menu-title">{{ $module->name }}</span>
								@if($moduleMenus->count() > 0)
									<span class="menu-arrow"></span>
								@endif
							</span>
							<!--end:Menu link-->
							
							@if($moduleMenus->count() > 0)
								<!--begin:Menu sub-->
								<div class="menu-sub menu-sub-accordion">
									@foreach($moduleMenus as $menu)
										<!--begin:Menu item-->
										<div class="menu-item">
											<!--begin:Menu link-->
											<a class="menu-link {{ $menu->route_name && request()->routeIs($menu->route_name) ? 'active' : '' }}" 
											   href="{{ $menu->route_name ? route($menu->route_name) : '#' }}">
												<span class="menu-bullet">
													<span class="bullet bullet-dot"></span>
												</span>
												<span class="menu-title">{{ $menu->name }}</span>
											</a>
											<!--end:Menu link-->
										</div>
										<!--end:Menu item-->
									@endforeach
								</div>
								<!--end:Menu sub-->
							@endif
						</div>
						<!--end:Menu item-->
					@endforeach
				@endif

				@if(auth()->user()->hasRole('administrator') || auth()->user()->hasRole('admin') || auth()->user()->hasRole('super-admin'))
					<!--begin:Menu item-->
					<div class="menu-item pt-5">
						<!--begin:Menu content-->
						<div class="menu-content">
							<span class="menu-heading fw-bold text-uppercase fs-7">Administration</span>
						</div>
						<!--end:Menu content-->
					</div>
					<!--end:Menu item-->
					
					<!--begin:Menu item-->
					<div data-kt-menu-trigger="click" class="menu-item menu-accordion {{ request()->routeIs('user-management.*') ? 'here show' : '' }}">
						<!--begin:Menu link-->
						<span class="menu-link">
							<span class="menu-icon">{!! getIcon('abstract-28', 'fs-2') !!}</span>
							<span class="menu-title">User Management</span>
							<span class="menu-arrow"></span>
						</span>
						<!--end:Menu link-->
						<!--begin:Menu sub-->
						<div class="menu-sub menu-sub-accordion">
							<!--begin:Menu item-->
							<div class="menu-item">
								<!--begin:Menu link-->
								<a class="menu-link {{ request()->routeIs('user-management.users.*') ? 'active' : '' }}" href="{{ route('user-management.users.index') }}">
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
								<a class="menu-link {{ request()->routeIs('user-management.roles.*') ? 'active' : '' }}" href="{{ route('user-management.roles.index') }}">
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
								<a class="menu-link {{ request()->routeIs('user-management.permissions.*') ? 'active' : '' }}" href="{{ route('user-management.permissions.index') }}">
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
					
					<!--begin:Menu item-->
					<div data-kt-menu-trigger="click" class="menu-item menu-accordion {{ request()->routeIs('modules.*') || request()->routeIs('menus.*') ? 'here show' : '' }}">
						<!--begin:Menu link-->
						<span class="menu-link">
							<span class="menu-icon">{!! getIcon('setting-2', 'fs-2') !!}</span>
							<span class="menu-title">Module Management</span>
							<span class="menu-arrow"></span>
						</span>
						<!--end:Menu link-->
						<!--begin:Menu sub-->
						<div class="menu-sub menu-sub-accordion">
							<!--begin:Menu item-->
							<div class="menu-item">
								<!--begin:Menu link-->
								<a class="menu-link {{ request()->routeIs('modules.*') ? 'active' : '' }}" href="{{ route('modules.modules.index') }}">
									<span class="menu-bullet">
										<span class="bullet bullet-dot"></span>
									</span>
									<span class="menu-title">Modules</span>
								</a>
								<!--end:Menu link-->
							</div>
							<!--end:Menu item-->
							<!--begin:Menu item-->
							<div class="menu-item">
								<!--begin:Menu link-->
								<a class="menu-link {{ request()->routeIs('menus.*') ? 'active' : '' }}" href="{{ route('menus.menus.index') }}">
									<span class="menu-bullet">
										<span class="bullet bullet-dot"></span>
									</span>
									<span class="menu-title">Menus</span>
								</a>
								<!--end:Menu link-->
							</div>
							<!--end:Menu item-->
						</div>
						<!--end:Menu sub-->
					</div>
					<!--end:Menu item-->
				@endif
			@endauth
		</div>
		<!--end::Menu-->
	</div>
	<!--end::Menu wrapper-->
</div>
<!--end::sidebar menu-->
