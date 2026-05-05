export {};

declare global {
  interface Window {
    SalesforceInteractions: {
      sendEvent: (event: any) => void;
      // tambahkan method lain sesuai kebutuhan SDK Anda
    };
  }
}
