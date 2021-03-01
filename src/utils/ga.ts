// Google Analytics gtag version API
// https://developers.google.com/analytics/devguides/collection/gtagjs

declare global {
  interface Window {
    gtag: any;
  }
}

export const prodTargetId = 'G-BWQ72S5QE8';
export const testTargetId = 'G-17W5VXCYSL';
export const devTargetId = 'G-VCXQ7FY6EV';

// TODO userId bind portal address

export const getTrackId = () => {
  return window.location.hostname.includes('confluxscan.io')
    ? prodTargetId
    : window.location.hostname.includes('confluxnetwork.org')
    ? testTargetId
    : devTargetId;
};

// add additional configuration information to targets
export const trackConfig = (configInfo = {}) => {
  window.gtag && window.gtag('config', getTrackId(), configInfo);
};

interface TrackEventParams {
  action: string;
  category: string;
  label?: string;
  value?: number;
}
// track event data
export const trackEvent = (eventInfo: TrackEventParams) => {
  window.gtag &&
    window.gtag('event', eventInfo.action, {
      event_category: eventInfo.category,
      event_label: eventInfo.label || '',
      value: eventInfo.value || 0,
    });
};

interface TrackScreenViewParams {
  appName: string;
  screenName: string;
  appId?: string;
  appVersion?: string;
  appInstallerId?: string;
}
// track screen view
export const trackScreenView = (screenViewInfo: TrackScreenViewParams) => {
  window.gtag &&
    window.gtag('event', 'screen_view', {
      screen_name: screenViewInfo.screenName,
      app_name: screenViewInfo.appName,
      app_id: screenViewInfo.appId || '',
      app_version: screenViewInfo.appVersion || '',
      app_installer_id: screenViewInfo.appInstallerId || '',
    });
};

interface TrackTimingParams {
  name: string;
  value: number; // milliseconds
  category: string;
  label?: string;
}
// track timing
export const trackTiming = (timingInfo: TrackTimingParams) => {
  window.gtag &&
    window.gtag('event', 'timing_complete', {
      name: timingInfo.name,
      event_category: timingInfo.category,
      event_label: timingInfo.label || '',
      value: timingInfo.value || 0,
    });
};

// track error
// set fatal to true if the error is fatal
export const trackError = (description: string, fatal = false) => {
  window.gtag &&
    window.gtag('event', 'exception', {
      description,
      fatal,
    });
};
