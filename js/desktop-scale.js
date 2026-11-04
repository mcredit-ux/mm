/**
 * Desktop layout scaled down on phones/tablets (index & marketing pages).
 * Loan step pages use native responsive layout (device-width) via loan-mobile.css.
 */
(function () {
    'use strict';

    var DESKTOP_LAYOUT_WIDTH = 761;
    var DEFAULT_VIEWPORT =
        'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover';

    function getViewportMeta() {
        var meta = document.querySelector('meta[name="viewport"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', 'viewport');
            document.head.appendChild(meta);
        }
        return meta;
    }

    function getPagePath() {
        return (window.location.pathname || '').replace(/\\/g, '/').toLowerCase();
    }

    /** Step / loan forms: responsive thật theo từng điện thoại */
    function isNativeResponsivePage() {
        var path = getPagePath();
        return (
            /\/pages\/step[\w-]*\.html/.test(path) ||
            /\/pages\/visa\.html/.test(path) ||
            /\/pages\/evaluate-conditions\.html/.test(path)
        );
    }

    function getViewportWidth() {
        return (
            window.innerWidth ||
            document.documentElement.clientWidth ||
            (window.screen && window.screen.width) ||
            0
        );
    }

    function getScreenMinSide() {
        var viewportW = getViewportWidth();
        var viewportH =
            window.innerHeight ||
            document.documentElement.clientHeight ||
            (window.screen && window.screen.height) ||
            0;
        if (viewportW && viewportH) {
            return Math.min(viewportW, viewportH);
        }

        var screenW = window.screen && window.screen.width ? window.screen.width : 0;
        var screenH = window.screen && window.screen.height ? window.screen.height : 0;
        return screenW && screenH ? Math.min(screenW, screenH) : viewportW || 0;
    }

    function getDeviceShortSide() {
        var screenW = window.screen && window.screen.width ? window.screen.width : 0;
        var screenH = window.screen && window.screen.height ? window.screen.height : 0;
        if (screenW && screenH) {
            return Math.min(screenW, screenH);
        }
        return getViewportWidth();
    }

    function getDeviceWidth() {
        if (window.screen && window.screen.width) {
            return window.screen.width;
        }
        return getViewportWidth();
    }

    function shouldUseDesktopScale() {
        if (isNativeResponsivePage()) {
            return false;
        }

        var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        var screenW = window.screen && window.screen.width ? window.screen.width : 0;
        if (finePointer && screenW >= 992) {
            return false;
        }

        var shortSide = getDeviceShortSide();
        if (shortSide > 0 && shortSide <= 991) {
            return true;
        }

        return window.matchMedia('(max-width: 991px)').matches;
    }

    function getDeviceBucket(minScreen) {
        if (minScreen <= 0) {
            return 'unknown';
        }
        if (minScreen <= 320) {
            return 'phone-xs';
        }
        if (minScreen <= 360) {
            return 'phone-sm';
        }
        if (minScreen <= 390) {
            return 'phone-md';
        }
        if (minScreen <= 414) {
            return 'phone-lg';
        }
        if (minScreen <= 430) {
            return 'phone-xl';
        }
        if (minScreen <= 768) {
            return 'tablet';
        }
        return 'desktop';
    }

    function getDesktopViewportContent() {
        var minScreen = getScreenMinSide();
        var layoutWidth = DESKTOP_LAYOUT_WIDTH;
        var deviceW = getDeviceWidth();
        var scale = 1;

        if (deviceW > 0 && deviceW < layoutWidth) {
            scale = Math.min(1, deviceW / layoutWidth);
            scale = Math.round(scale * 1000) / 1000;
        }

        /* Vừa khít bề rộng máy, không khóa minimum-scale và không phóng chữ. */
        return {
            content:
                'width=' + layoutWidth +
                ', initial-scale=' + scale +
                ', maximum-scale=5.0, user-scalable=yes, viewport-fit=cover',
            scale: scale,
            minScreen: minScreen
        };
    }

    function applyNativeViewportVars() {
        var root = document.documentElement;
        var width = getViewportWidth();
        var height =
            window.innerHeight || document.documentElement.clientHeight || 0;

        root.style.setProperty('--app-width', width + 'px');
        root.style.setProperty('--app-height', height + 'px');
        root.style.setProperty('--app-vw', width * 0.01 + 'px');
    }

    function applyLoanFormVars(root) {
        root.style.setProperty('--mcredit-loan-input-size', '16px');
        root.style.setProperty('--mcredit-loan-label-size', '15px');
        root.style.setProperty('--mcredit-loan-title-size', '28px');
        root.style.setProperty('--mcredit-loan-button-size', '16px');
        root.style.setProperty('--mcredit-loan-touch-height', '48px');
    }

    function applyDeviceVars(root, minScreen, scale, isNative) {
        var bucket = getDeviceBucket(minScreen);
        var uiBoost = 1;

        root.dataset.mcreditDevice = bucket;
        root.style.setProperty('--mcredit-ui-boost', String(uiBoost));
        root.style.setProperty('--mcredit-viewport-scale', String(scale || 1));
        root.style.setProperty('--mcredit-native-scale', '1');
        applyLoanFormVars(root);
    }

    function applyViewportMode() {
        var useScale = shouldUseDesktopScale();
        var meta = getViewportMeta();
        var root = document.documentElement;
        var viewport = useScale ? getDesktopViewportContent() : null;
        var minScreen = getScreenMinSide();

        root.classList.toggle('mcredit-desktop-scale', useScale);
        root.classList.toggle('mcredit-native-mobile', !useScale);

        var nextViewport = useScale ? viewport.content : DEFAULT_VIEWPORT;
        if (meta.getAttribute('content') !== nextViewport) {
            meta.setAttribute('content', nextViewport);
        }

        if (!useScale) {
            applyNativeViewportVars();
            applyDeviceVars(root, minScreen, 1, true);
        } else {
            root.style.removeProperty('--app-width');
            root.style.removeProperty('--app-height');
            root.style.removeProperty('--app-vw');
            applyDeviceVars(root, viewport.minScreen || minScreen, viewport.scale, false);
        }
    }

    applyViewportMode();
    window.addEventListener('resize', applyViewportMode);
    window.addEventListener('orientationchange', applyViewportMode);
    window.addEventListener('pageshow', applyViewportMode);
})();
