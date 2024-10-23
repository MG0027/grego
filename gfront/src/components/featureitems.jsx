import { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './featureitems.module.css';

gsap.registerPlugin(ScrollTrigger);

function Featuresitems() {
  const parentRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);
  const card4Ref = useRef(null);

  useEffect(() => {
    const cards = [
        { ref: card1Ref, direction: -1 },
        { ref: card2Ref, direction: 1 },
        { ref: card3Ref, direction: -1 },
        { ref: card4Ref, direction: 1 },
    ];

    const isSmallScreen = window.innerWidth <= 768;

    cards.forEach(({ ref, direction }) => {
        // Check if ref is defined
        if (ref.current) {
            gsap.from(ref.current, {
                scrollTrigger: {
                    trigger: ref.current,
                    start: "top 80%", // Start animation when cards are in the viewport
                    scrub: 1,
                    markers: false,
                },
                x: isSmallScreen ? 100 * direction : 500 * direction, // Smaller movement for small screens
                opacity: 0,
                duration: 1.5,
            });
        } else {
            console.error("Target element not found");
        }
    });

    // Cleanup function to kill all scroll triggers
    return () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
}, []); // Dependency array can include refs if needed

  return (
    <div ref={parentRef} className={styles.featureitems}>
      <div ref={card1Ref} className={styles.card1}>
        <span className={styles.texttask}>Task & workflow Manager</span>
        <img src="/images/task-manager-vector-design-concept.jpg" alt="Task Manager" className={styles.imgtask} />
      </div>
      <div ref={card2Ref} className={styles.card2}>
        <img src="/images/bot-says-hello-users-welcome-chatbot-online-consultation-vector-illustration_476325-708.avif" alt="Personal Assistant" className={styles.imgbot} />
        <span className={styles.textbot}>Personal Assistant: Grego</span>
      </div>
      <div ref={card3Ref} className={styles.card3}>
        <img src="/images/depositphotos_91339136-stock-illustration-hand-with-pen-mark-calendar.jpg" alt="Interactive Calendar" className={styles.imgcal} />
        <span className={styles.textcal}>Interactive Visual Calendar</span>
      </div>
      <div ref={card4Ref} className={styles.card4}>
        <span className={styles.textexp}>Track Expenses and Budget Management</span>
        <img src="/images/postImage.jpeg" alt="Expense Tracking" className={styles.imgexp} />
      </div>
    </div>
  );
}

export default Featuresitems;