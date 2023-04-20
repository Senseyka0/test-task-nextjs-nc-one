import { useEffect, useState } from "react";

export const useWindowWidth = () => {
  const [width, setWidth] = useState(0);

  const isMobile = width <= 630;
  const isMobileAndTablet = width <= 1024;
  const isSmallDesktop = width <= 1400;

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setWidth]);

  return { width, isMobile, isMobileAndTablet, isSmallDesktop };
};
