import { useEffect, useState } from 'react';

const useBannerVisibility = (localStorageKey: string) => {
  const [isBannerVisible, setIsBannerVisible] = useState(localStorage.getItem(localStorageKey) !== 'true');

  useEffect(() => {
    const isBannerClosed = localStorage.getItem(localStorageKey);
    setIsBannerVisible(isBannerClosed !== 'true');
  }, [localStorageKey]);

  const closeBanner = () => {
    localStorage.setItem(localStorageKey, 'true');
    setIsBannerVisible(false);
  };

  return { isBannerVisible, closeBanner };
};

export { useBannerVisibility };
