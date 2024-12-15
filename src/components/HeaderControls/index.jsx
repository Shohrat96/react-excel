import { useEffect, useRef, useState } from "react";
import TimeSelector from "../TimeSelector"
import styles from './HeaderControls.module.css'

export default () => {

    const headerRef = useRef(null);
    const [isHidden, setIsHidden] = useState(false);
    const [isAtBottom, setIsAtBottom] = useState(false);

    const [isVisible, setIsVisible] = useState(true); // Tracks visibility of the header
    const lastScrollY = useRef(0); // Stores the last scroll position
  
    useEffect(() => {
      const handleScroll = () => {
        const currentScrollY = window.scrollY;
        const atBottom =
          window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight;
  
        if (atBottom) {
          setIsVisible(true); // Show the header at the bottom
        } else if (currentScrollY > lastScrollY.current) {
          setIsVisible(false); // Hide the header when scrolling down
        } else {
          setIsVisible(true); // Show the header when scrolling up
        }
  
        lastScrollY.current = currentScrollY; // Update the last scroll position
      };
  
      window.addEventListener("scroll", handleScroll);
  
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, []);
  

    return (
        <div ref={headerRef} className={`${styles.headerControls} ${
            isVisible ? styles.visible : styles.hidden
          }`}>
            <TimeSelector />
        </div>
    )
}