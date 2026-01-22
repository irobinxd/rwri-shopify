<!--begin::Form-->
<form class="w-100 position-relative mb-3" autocomplete="off" id="kt_search_form">
<!--begin::Icon-->
{!! getIcon('magnifier', 'fs-2 text-gray-500 position-absolute top-50 translate-middle-y ms-0') !!} 
<!--end::Icon-->
<!--begin::Input-->
<input type="text" class="search-input form-control form-control-flush ps-10" name="search" value="" placeholder="Search..." id="kt_search_input" />
<!--end::Input-->
<!--begin::Spinner-->
<span class="search-spinner position-absolute top-50 end-0 translate-middle-y lh-0 d-none me-1">
	<span class="spinner-border h-15px w-15px align-middle text-gray-500"></span>
</span>
<!--end::Spinner-->
<!--begin::Reset-->
<span class="search-reset btn btn-flush btn-active-color-primary position-absolute top-50 end-0 translate-middle-y lh-0 d-none">{!! getIcon('cross', 'fs-2 fs-lg-1 me-0') !!}</span>
<!--end::Reset-->
<!--begin::Toolbar-->
<div class="position-absolute top-50 end-0 translate-middle-y">
	<!--begin::Advanced search toggle-->
	<div class="btn btn-icon w-20px btn-sm btn-active-color-primary" data-bs-toggle="tooltip" title="Show more search options">{!! getIcon('down', 'fs-2') !!}</div>
	<!--end::Advanced search toggle-->
</div>
<!--end::Toolbar--></form>
<!--end::Form-->
<!--begin::Separator-->
<div class="separator border-gray-200 mb-6"></div>
<!--end::Separator-->
