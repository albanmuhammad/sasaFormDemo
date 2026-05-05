"use client";

import Script from "next/script";

export default function SalesforceSDK() {
    return (
        <Script
            src="https://cdn.c360a.salesforce.com/beacon/c360a/c6d94c7a-5f85-494c-808c-5a8071e9e408/scripts/c360a.min.js"
            strategy="afterInteractive"
            onLoad={() => {
                const sdk =
                    (window as any).SalesforceInteractions ??
                    (window as any).getSalesforceInteractions?.() ??
                    (window as any).DataCloudInteractions;

                if (!sdk) {
                    console.error("SDK not found");
                    return;
                }

                sdk.init({
                    cookieDomain: window.location.hostname,
                    consents: [
                        {
                            provider: "Default",
                            purpose: "Tracking",
                            status: "Opt In",
                        },
                    ],
                }).then(() => {
                    (window as any).__sfsdk_ready = sdk;
                    console.log("✅ SDK initialized & ready");
                });
                sdk.setLoggingLevel(4);
            }}
        />
    );
}