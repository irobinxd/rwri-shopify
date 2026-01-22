<div class="modal fade" id="kt_modal_edit_role" tabindex="-1" aria-hidden="true" wire:ignore.self>
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered mw-750px">
        <!--begin::Modal content-->
        <div class="modal-content">
            <!--begin::Modal header-->
            <div class="modal-header">
                <!--begin::Modal title-->
                <h2 class="fw-bold">Edit Role</h2>
                <!--end::Modal title-->
                <!--begin::Close-->
                <div class="btn btn-icon btn-sm btn-active-icon-primary" data-bs-dismiss="modal" aria-label="Close">
                    {!! getIcon('cross','fs-1') !!}
                </div>
                <!--end::Close-->
            </div>
            <!--end::Modal header-->
            <!--begin::Modal body-->
            <div class="modal-body scroll-y mx-5 my-7">
                <!--begin::Form-->
                <form id="kt_modal_edit_role_form" class="form" action="#" wire:submit="submit">
                    <!--begin::Input group-->
                    <div class="fv-row mb-7">
                        <!--begin::Label-->
                        <label class="fs-5 fw-bold form-label mb-2">
                            <span class="required">Title</span>
                        </label>
                        <!--end::Label-->
                        <!--begin::Input-->
                        <input class="form-control form-control-solid" placeholder="Enter role title" name="name" wire:model.live="name"/>
                        <!--end::Input-->
                        @error('name')
                        <span class="text-danger">{{ $message }}</span> @enderror
                    </div>
                    <!--end::Input group-->
                    
                    <!--begin::Input group-->
                    <div class="fv-row mb-7">
                        <!--begin::Label-->
                        <label class="fs-5 fw-bold form-label mb-2">
                            <span class="required">Status</span>
                        </label>
                        <!--end::Label-->
                        <!--begin::Input-->
                        <input class="form-control form-control-solid" value="Active" readonly/>
                        <!--end::Input-->
                    </div>
                    <!--end::Input group-->

                    <!--begin::Permissions-->
                    <div class="fv-row">
                        <!--begin::Label-->
                        <label class="fs-5 fw-bold form-label mb-5">Permissions</label>
                        <!--end::Label-->
                        <!--begin::Scroll-->
                        <div class="scroll-y me-n7 pe-7" style="max-height: 500px;">
                            @foreach($menus_by_module ?? [] as $moduleName => $moduleMenus)
                                <!--begin::Module group-->
                                <div class="mb-8">
                                    <!--begin::Module header with toggle-->
                                    <div class="d-flex align-items-center justify-content-between mb-4">
                                        <span class="text-gray-800 fw-bold fs-6">{{ $moduleName }}</span>
                                        <!--begin::Switch-->
                                        <label class="form-check form-switch form-check-custom form-check-solid">
                                            @php
                                                // Convert to collection if it's an array
                                                $moduleMenusCollection = is_array($moduleMenus) ? collect($moduleMenus) : $moduleMenus;
                                                $moduleMenuIds = $moduleMenusCollection->pluck('id')->toArray();
                                                $allModuleMenusChecked = !empty($moduleMenuIds) && empty(array_diff($moduleMenuIds, $this->checked_menus ?? []));
                                            @endphp
                                            <input class="form-check-input module-toggle" type="checkbox" 
                                                   data-module="{{ $moduleName }}" 
                                                   @if($allModuleMenusChecked) checked @endif
                                                   onchange="toggleModulePermissions(this, '{{ $moduleName }}', {{ json_encode($moduleMenuIds) }})"/>
                                            <span class="form-check-label fw-semibold text-gray-700"></span>
                                        </label>
                                        <!--end::Switch-->
                                    </div>
                                    <!--end::Module header-->
                                    
                                    <!--begin::Menu items-->
                                    <div class="d-flex flex-column gap-3 ms-5">
                                        @php
                                            // Convert to collection if it's an array
                                            $moduleMenusCollection = is_array($moduleMenus) ? collect($moduleMenus) : $moduleMenus;
                                        @endphp
                                        @foreach($moduleMenusCollection as $menu)
                                            <!--begin::Checkbox-->
                                            <label class="form-check form-check-custom form-check-solid menu-item" data-module="{{ $moduleName }}">
                                                <input class="form-check-input menu-checkbox" type="checkbox" 
                                                       wire:model.live="checked_menus" 
                                                       value="{{ $menu->id }}"
                                                       @if($check_all) disabled @endif/>
                                                <span class="form-check-label text-gray-700">{{ $menu->name }}</span>
                                            </label>
                                            <!--end::Checkbox-->
                                        @endforeach
                                    </div>
                                    <!--end::Menu items-->
                                </div>
                                <!--end::Module group-->
                            @endforeach
                        </div>
                        <!--end::Scroll-->
                    </div>
                    <!--end::Permissions-->
                    
                    <!--begin::Actions-->
                    <div class="text-center pt-15">
                        <button type="reset" class="btn btn-light me-3" data-bs-dismiss="modal" aria-label="Close" wire:loading.attr="disabled">Cancel</button>
                        <button type="submit" class="btn btn-primary">
                            <span class="indicator-label" wire:loading.remove>Save Changes</span>
                            <span class="indicator-progress" wire:loading wire:target="submit">
                                Please wait...
                                <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                            </span>
                        </button>
                    </div>
                    <!--end::Actions-->
                </form>
                <!--end::Form-->
            </div>
            <!--end::Modal body-->
        </div>
        <!--end::Modal content-->
    </div>
    <!--end::Modal dialog-->
</div>

@push('scripts')
<script>
    const modal = document.querySelector('#kt_modal_edit_role');

    modal.addEventListener('show.bs.modal', (e) => {
        const roleId = e.relatedTarget ? e.relatedTarget.getAttribute('data-role-id') : '';
        Livewire.dispatch('modal.show.role_id', [roleId || '']);
    });
    
    // Handle "Add Role" button click
    document.addEventListener('DOMContentLoaded', function() {
        const addRoleBtn = document.querySelector('[data-bs-target="#kt_modal_edit_role"]');
        if (addRoleBtn && !addRoleBtn.hasAttribute('data-role-id')) {
            addRoleBtn.addEventListener('click', function() {
                Livewire.dispatch('modal.show.role_id', ['']);
            });
        }
    });
    
    // Toggle all permissions in a module
    function toggleModulePermissions(toggle, moduleName, menuIds) {
        const isChecked = toggle.checked;
        const menuItems = document.querySelectorAll(`.menu-item[data-module="${moduleName}"] .menu-checkbox`);
        
        menuItems.forEach(checkbox => {
            checkbox.checked = isChecked;
            // Trigger Livewire update
            if (isChecked) {
                // Add to checked_menus if not already there
                if (!checkbox.checked) {
                    checkbox.click();
                }
            } else {
                // Remove from checked_menus
                if (checkbox.checked) {
                    checkbox.click();
                }
            }
        });
        
        // Force Livewire to update
        Livewire.find(document.querySelector('[wire\\:id]').getAttribute('wire:id')).set('checked_menus', function(menus) {
            if (isChecked) {
                // Add all module menu IDs
                return [...new Set([...(menus || []), ...menuIds])];
            } else {
                // Remove all module menu IDs
                return (menus || []).filter(id => !menuIds.includes(id));
            }
        });
    }
    
    // Listen for Livewire updates to sync module toggles
    document.addEventListener('livewire:init', () => {
        Livewire.hook('morph.updated', ({ el, component }) => {
            // Sync module toggles when menus are updated
            const modules = document.querySelectorAll('.module-toggle');
            modules.forEach(toggle => {
                const moduleName = toggle.getAttribute('data-module');
                const menuItems = document.querySelectorAll(`.menu-item[data-module="${moduleName}"] .menu-checkbox`);
                const allChecked = Array.from(menuItems).every(cb => cb.checked);
                toggle.checked = allChecked;
            });
        });
    });
</script>
@endpush
