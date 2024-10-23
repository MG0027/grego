import { useRef, useEffect, Suspense, lazy } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import styles from "./home.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Lazy load components for optimization
const Features = lazy(() => import("../components/features"));
const Footer = lazy(() => import("../components/footer"));
const Dashboard = lazy(() => import("../components/dashboard"));

function Home() {

  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const textRef = useRef(null);
  const featuresRef = useRef(null);  // Reference for Features section
  const { isLoggedIn } = useSelector((state) => state.user);

  useEffect(() => {
    // Check if the ref is defined
    if (textRef.current) {
        gsap.from(textRef.current, {
            y: -1000,
            opacity: 0,
            duration: 1,
            delay: 1,
        });
    } else {
        console.error("Target element not found");
    }
}, []);

  const initialPath = "M 50 50 Q 700 50 1300 50";

  const handlePath = (e) => {
    if (!svgRef.current || !pathRef.current) return;

    const svgRect = svgRef.current.getBoundingClientRect();
    const y = e.clientY - svgRect.top;

    const newPath = `M 50 50 Q 700 ${y} 1300 50`;

    gsap.to(pathRef.current, {
      attr: { d: newPath },
      duration: 0.3,
      ease: "power3.out",
    });
  };

  const handleLeave = () => {
    if (!pathRef.current) return;

    gsap.to(pathRef.current, {
      attr: { d: initialPath },
      duration: 0.3,
      ease: "elastic.out(1,0.2)",
    });
  };


 

  return (
    <>
      {isLoggedIn ? (
        <Suspense fallback={<div>Loading...</div>}>
          <Dashboard />
        </Suspense>
      ) : (
        <div>
          <svg
            ref={svgRef}
            width="1300"
            height="250"
            xmlns="http://www.w3.org/2000/svg"
            onMouseMove={handlePath}
            onMouseLeave={handleLeave}
          >
            <path
              ref={pathRef}
              d={initialPath}
              stroke="whiteSmoke"
              fill="transparent"
            />
          </svg>
          <div className={styles.trio}>
            <h1 className={styles.text} ref={textRef}>
              Namaste!
            </h1>
            <h3 className={styles.line1}>Grego: Your Digital Sidekick</h3>
            <h3 className={styles.line2}>"Always there, always ahead."</h3>
            <Link to="/login">
              <img
                src="/images/7400715-transformed.webp"
                alt="icon"
                className={styles.img}
              />
            </Link>
          </div>

          {/* Features Section, now referenced */}
          <div ref={featuresRef}>
            <Suspense fallback={<div>Loading features...</div>}>
              <Features />
            </Suspense>
          </div>
          <Suspense fallback={<div>Loading footer...</div>}>
            <Footer />
          </Suspense>
        </div>
      )}
    </>
  );
}

export default Home;
