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
  return window.location.hostname.includes('confluxscan.org')
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
  try {
    const eventObject: any = {
      event_category: eventInfo.category,
    };
    if (typeof eventInfo.label !== 'undefined') {
      eventObject.event_label = eventInfo.label;
    }
    if (typeof eventInfo.value !== 'undefined') {
      eventObject.value = eventInfo.value;
    }
    // if (
    //   window.location.hostname.includes('127.0.0.1') ||
    //   window.location.hostname.includes('localhost')
    // ) {
    //   console.info(`trackEvent`, eventInfo);
    // }
    window.gtag &&
      window.gtag(
        'event',
        `${eventInfo.category}_${eventInfo.action}`,
        eventObject,
      );
  } catch (e) {
    console.error(e);
  }
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
  try {
    window.gtag &&
      window.gtag('event', 'screen_view', {
        screen_name: screenViewInfo.screenName,
        app_name: screenViewInfo.appName,
        app_id: screenViewInfo.appId || '',
        app_version: screenViewInfo.appVersion || '',
        app_installer_id: screenViewInfo.appInstallerId || '',
      });
  } catch (e) {
    console.error(e);
  }
};

interface TrackTimingParams {
  name: string;
  value: number; // milliseconds
  category: string;
  label?: string;
}
// track timing
export const trackTiming = (timingInfo: TrackTimingParams) => {
  try {
    window.gtag &&
      window.gtag('event', 'timing_complete', {
        name: timingInfo.name,
        event_category: timingInfo.category,
        event_label: timingInfo.label || '',
        value: timingInfo.value || 0,
      });
  } catch (e) {
    console.error(e);
  }
};

// track error
// set fatal to true if the error is fatal
export const trackError = (description: string, fatal = false) => {
  try {
    window.gtag &&
      window.gtag('event', 'exception', {
        description,
        fatal,
      });
  } catch (e) {
    console.error(e);
  }
};
