import ReactGA from "react-ga4";

let isInitialized = false;

export const initGA = () => {
  const trackingId =
    process.env.NEXT_PUBLIC_TRACKING_ID || process.env.GA_MEASUREMENT_ID;
  if (trackingId && !isInitialized) {
    ReactGA.initialize(trackingId);
    isInitialized = true;
  }
};

export const trackPageView = (page, title) => {
  if (isInitialized) {
    ReactGA.send({ hitType: "pageview", page, title });
  }
};

export const trackEvent = (category, action, label) => {
  if (isInitialized) {
    ReactGA.event({
      category,
      action,
      label,
    });
  }
};
