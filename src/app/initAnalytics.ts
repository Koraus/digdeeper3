import { init, setOptOut as _setOptOut, Types } from "@amplitude/analytics-browser";
import { appVersion } from "./appVersion";


const amplitudeApiKey = import.meta.env["VITE_AMPLITUDE_API_KEY"];
const analyticsEnabled = !!amplitudeApiKey && import.meta.env.PROD;
init(amplitudeApiKey ?? "stub", undefined, {
    appVersion: appVersion,
    optOut: !analyticsEnabled,
    attribution: {
        trackPageViews: true,
    },

    ...(import.meta.env.DEV && {
        logLevel: Types.LogLevel.Verbose,
    }),
});

export const setOptOut = (optOut: boolean) =>
    _setOptOut(optOut && !analyticsEnabled);