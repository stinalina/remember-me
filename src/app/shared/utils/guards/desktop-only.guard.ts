import { PLATFORM_ID, inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { ROUTER_TOKENS } from '@app/app.routes';

const MOBILE_MAX_WIDTH = 767;
const MOBILE_USER_AGENT_PATTERN = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

export const desktopOnlyGuard: CanMatchFn = () => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const isSmallViewport = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`).matches;
  const isMobileUserAgent = MOBILE_USER_AGENT_PATTERN.test(navigator.userAgent || '');

  if (isSmallViewport || isMobileUserAgent) {
    return router.createUrlTree([ROUTER_TOKENS.MOBILE_UNSUPPORTED]);
  }

  return true;
};
