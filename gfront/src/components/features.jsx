import { useRef, useEffect } from 'react';
import styles from './features.module.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Featuresitems from './featureitems';

gsap.registerPlugin(ScrollTrigger);

function Features() {
  const parentRef = useRef();
  const textRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial position of text
      gsap.set(textRef.current, {
        xPercent: 0,
        yPercent: -50,
        top: '50%'
      });

      // Create ScrollTrigger
      ScrollTrigger.create({
        trigger: parentRef.current,
        start: "top top",
        end: "+=150%", // Make the scroll distance equal to the height of the section
        pin: parentRef.current, // Pin the entire parent div
        
        scrub: 3,
        anticipatePin: 1,
        pinSpacing: true,
        animation: gsap.to(textRef.current, {
          xPercent: -80,
          ease: "none"
        })
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div className={styles.features} ref={parentRef}>
        <h1 ref={textRef}>FEATURES</h1>
      </div>
      <Featuresitems />
    </>
  );
}

export default Features;