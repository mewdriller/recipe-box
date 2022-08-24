import createCache from "@emotion/cache";

export const createEmotionCache = () => {
  if (typeof document === "undefined") {
    return createCache({ key: "mui-style" });
  }

  return createCache({
    insertionPoint:
      document.querySelector<HTMLElement>(
        'meta[name="emotion-insertion-point"]'
      ) ?? undefined,
    key: "mui-style",
  });
};
