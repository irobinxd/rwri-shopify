<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" {!! printHtmlAttributes('html') !!}>
<!--begin::Head-->
<head>
    <base href=""/>
    <title>{{ config('app.name', 'Laravel') }}</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta charset="utf-8"/>
    <meta name="description" content=""/>
    <meta name="keywords" content=""/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta property="og:locale" content="en_US"/>
    <meta property="og:type" content="article"/>
    <meta property="og:title" content=""/>
    <link rel="canonical" href="{{ url()->current() }}"/>

    {!! includeFavicon() !!}

    <!--begin::Fonts-->
    {!! includeFonts() !!}
    <!--end::Fonts-->

    <!--begin::Global Stylesheets Bundle(used by all pages)-->
    @foreach(getGlobalAssets('css') as $path)
        {!! sprintf('<link rel="stylesheet" href="%s">', asset($path)) !!}
    @endforeach
    <!--end::Global Stylesheets Bundle-->

    <!--begin::Vendor Stylesheets(used by this page)-->
    @foreach(getVendors('css') as $path)
        {!! sprintf('<link rel="stylesheet" href="%s">', asset($path)) !!}
    @endforeach
    <!--end::Vendor Stylesheets-->

    <!--begin::Custom Stylesheets(optional)-->
    @foreach(getCustomCss() as $path)
        {!! sprintf('<link rel="stylesheet" href="%s">', asset($path)) !!}
    @endforeach
    <!--end::Custom Stylesheets-->

    @livewireStyles
    
    <!--begin::Prevent KTSearch initialization error - must be in head before scripts load-->
    <script>
        // Prevent KTSearch initialization error - create stub before scripts.bundle.js loads
        (function() {
            // Create a comprehensive mock element that prevents all errors
            function createMockElement() {
                return {
                    addEventListener: function() { return; },
                    removeEventListener: function() { return; },
                    querySelector: function() { return null; },
                    querySelectorAll: function() { return []; },
                    getAttribute: function() { return null; },
                    setAttribute: function() { return; },
                    removeAttribute: function() { return; },
                    classList: {
                        add: function() { return; },
                        remove: function() { return; },
                        toggle: function() { return; },
                        contains: function() { return false; }
                    },
                    style: {},
                    innerHTML: '',
                    textContent: ''
                };
            }
            
            var mockElement = createMockElement();
            
            // Create KTSearch constructor that always returns safe object with Proxy
            window.KTSearch = function(element, options) {
                // Always ensure element is never null
                var safeElement = (element && typeof element.addEventListener === 'function') ? element : mockElement;
                
                // Create instance object
                var instance = {
                    init: function() { return this; },
                    on: function() { return this; },
                    off: function() { return this; },
                    trigger: function() { return this; },
                    destroy: function() { return this; },
                    options: options || {}
                };
                
                // Use Proxy to intercept all property access and ensure element is always safe
                return new Proxy(instance, {
                    get: function(target, prop) {
                        if (prop === 'element') {
                            return safeElement;
                        }
                        return target[prop];
                    },
                    set: function(target, prop, value) {
                        if (prop === 'element') {
                            safeElement = (value && typeof value.addEventListener === 'function') ? value : mockElement;
                            return true;
                        }
                        target[prop] = value;
                        return true;
                    }
                });
            };
            
            // Make KTSearch.init return null
            window.KTSearch.init = function(element, options) {
                return null;
            };
            
            // Continuously patch KTSearch
            function patchKTSearch() {
                if (window.KTSearch && typeof window.KTSearch === 'function') {
                    var currentKTSearch = window.KTSearch;
                    
                    // Test if it's safe
                    var isSafe = false;
                    try {
                        var testInstance = new currentKTSearch(null, null);
                        if (testInstance && testInstance.element && typeof testInstance.element.addEventListener === 'function') {
                            isSafe = true;
                        }
                    } catch (e) {
                        isSafe = false;
                    }
                    
                    if (!isSafe) {
                        window.KTSearch = function(element, options) {
                            var safeElement = (element && typeof element.addEventListener === 'function') ? element : createMockElement();
                            var instance = {
                                init: function() { return this; },
                                on: function() { return this; },
                                off: function() { return this; },
                                trigger: function() { return this; },
                                destroy: function() { return this; },
                                options: options || {}
                            };
                            return new Proxy(instance, {
                                get: function(target, prop) {
                                    if (prop === 'element') {
                                        return safeElement;
                                    }
                                    return target[prop];
                                },
                                set: function(target, prop, value) {
                                    if (prop === 'element') {
                                        safeElement = (value && typeof value.addEventListener === 'function') ? value : createMockElement();
                                        return true;
                                    }
                                    target[prop] = value;
                                    return true;
                                }
                            });
                        };
                        window.KTSearch.init = function(element, options) {
                            return null;
                        };
                    }
                }
            }
            
            // Patch immediately and continuously
            patchKTSearch();
            
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function() {
                    setTimeout(patchKTSearch, 5);
                    setTimeout(patchKTSearch, 10);
                    setTimeout(patchKTSearch, 50);
                    setTimeout(patchKTSearch, 100);
                    setTimeout(patchKTSearch, 200);
                });
            } else {
                setTimeout(patchKTSearch, 5);
                setTimeout(patchKTSearch, 10);
                setTimeout(patchKTSearch, 50);
                setTimeout(patchKTSearch, 100);
                setTimeout(patchKTSearch, 200);
            }
            
            var patchCount = 0;
            var patchInterval = setInterval(function() {
                patchKTSearch();
                patchCount++;
                if (patchCount > 200) {
                    clearInterval(patchInterval);
                }
            }, 50);
        })();
    </script>
    <!--end::Prevent KTSearch initialization error-->
</head>
<!--end::Head-->

<!--begin::Body-->
<body {!! printHtmlClasses('body') !!} {!! printHtmlAttributes('body') !!}>

@include('partials/theme-mode/_init')

@yield('content')

<!--begin::Javascript-->
<!--begin::Global Javascript Bundle(mandatory for all pages)-->
@foreach(getGlobalAssets() as $path)
    {!! sprintf('<script src="%s"></script>', asset($path)) !!}
@endforeach
<!--end::Global Javascript Bundle-->


<!--begin::Vendors Javascript(used by this page)-->
@foreach(getVendors('js') as $path)
    {!! sprintf('<script src="%s"></script>', asset($path)) !!}
@endforeach
<!--end::Vendors Javascript-->

<!--begin::Custom Javascript(optional)-->
@foreach(getCustomJs() as $path)
    {!! sprintf('<script src="%s"></script>', asset($path)) !!}
@endforeach
<!--end::Custom Javascript-->
@stack('scripts')
<!--end::Javascript-->

<script>
    document.addEventListener('livewire:init', () => {
        Livewire.on('success', (message) => {
            toastr.success(message);
        });
        Livewire.on('error', (message) => {
            toastr.error(message);
        });

        Livewire.on('swal', (message, icon, confirmButtonText) => {
            if (typeof icon === 'undefined') {
                icon = 'success';
            }
            if (typeof confirmButtonText === 'undefined') {
                confirmButtonText = 'Ok, got it!';
            }
            Swal.fire({
                text: message,
                icon: icon,
                buttonsStyling: false,
                confirmButtonText: confirmButtonText,
                customClass: {
                    confirmButton: 'btn btn-primary'
                }
            });
        });
    });
</script>

@livewireScripts
</body>
<!--end::Body-->

</html>
