<x-auth-layout>

    <!--begin::Form-->
    <form class="form w-100" novalidate="novalidate" id="kt_sign_in_form" data-kt-redirect-url="{{ route('dashboard') }}" action="{{ route('login') }}">
        @csrf
        <!--begin::Heading-->
        <div class="text-center mb-11">
            <!--begin::Logo-->
            <div class="mb-5">
                <h1 class="text-royal-primary fw-bolder mb-3" style="font-size: 2.5rem; letter-spacing: 2px;">
                    ROYAL
                </h1>
            </div>
            <!--end::Logo-->
            
            <!--begin::Title-->
            <h2 class="text-gray-900 fw-bolder mb-3">
                Employee Portal
            </h2>
            <!--end::Title-->

            <!--begin::Subtitle-->
            <div class="text-gray-500 fw-semibold fs-6">
                Sign in to access your workspace
            </div>
            <!--end::Subtitle--->
        </div>
        <!--begin::Heading-->

        @if($errors->any())
            <div class="alert alert-danger">
                <ul class="mb-0">
                    @foreach($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <!--begin::Input group--->
        <div class="fv-row mb-8">
            <!--begin::Email-->
            <input type="email" placeholder="Email" name="email" autocomplete="off" class="form-control bg-transparent" value="{{ old('email') }}" required/>
            <!--end::Email-->
        </div>
        <!--end::Input group--->

        <!--end::Input group--->
        <div class="fv-row mb-3">
            <!--begin::Password-->
            <input type="password" placeholder="Password" name="password" autocomplete="off" class="form-control bg-transparent" required/>
            <!--end::Password-->
        </div>
        <!--end::Input group--->

        <!--begin::Wrapper-->
        <div class="d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>
                <label class="form-check-label" for="remember">
                    Remember me
                </label>
            </div>

            <!--begin::Link-->
            <a href="{{ route('password.request') }}" class="link-royal-primary">
                Forgot Password?
            </a>
            <!--end::Link-->
        </div>
        <!--end::Wrapper-->

        <!--begin::Submit button-->
        <div class="d-grid mb-10">
            <button type="submit" id="kt_sign_in_submit" class="btn btn-royal-primary">
                @include('partials/general/_button-indicator', ['label' => 'Sign In'])
            </button>
        </div>
        <!--end::Submit button-->
    </form>
    <!--end::Form-->

</x-auth-layout>
