declare global {
  interface Window {
    chrome: {
      cast: {
        media: {
          DEFAULT_MEDIA_RECEIVER_APP_ID: string;
        };
        AutoJoinPolicy: {
          ORIGIN_SCOPED: string;
        };
      };
    };
    __onGCastApiAvailable: (isAvailable: boolean) => void;
    cast: {
      framework: {
        CastContext: {
          getInstance: () => {
            setOptions: (options: {
              receiverApplicationId: string;
              autoJoinPolicy: string;
            }) => void;
          };
        };
      };
    };
  }
}

export {}; 