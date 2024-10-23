import { Link, useNavigate } from "react-router-dom";
import styles from './header.module.css';
import gsap from "gsap";
import { useRef, useEffect } from "react";
import { clearUser } from "../store/userslice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Fetchtask from "./fetchtask";
import Fetchevent from "./fetchevents";
import Fetchexpense from "./fetchexpense";
import Fetchincome from "./fetchincome";
import API_BASE_URL from '../config';
function Header() {
  const titleRef = useRef();
  const partsRef = useRef();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector(state => state.user); 
  const navigate = useNavigate(); 
  const childRef = useRef();

  useEffect(() => {
    const tl = gsap.timeline();

    tl.from(titleRef.current, {
      y: 1000,
      opacity: 0,
      duration: 1,
      delay: 0.6,
      ease: "power4.out",
    })
    .from(partsRef.current.children, {
      x: 1000,
      opacity: 0,
      duration: 1.5,
      stagger: 0.3,
      ease: "power4.out",
    }, "-=1")
    .from(childRef.current, {
      x: 1000,
      opacity: 0,
      duration: 1.5,
      stagger: 0.3,
      ease: "power4.out",
    }, "-=1");
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user/logout`, {}, { withCredentials: true });
  
      if (response.status === 200) {
        dispatch(clearUser());
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        console.error("Logout failed, response status:", response.status);
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className={styles.Header}>
      <div className={styles.tittle}>
        <h1>
          <Link to='/' ref={titleRef} style={{color:'whitesmoke'}}>Grego</Link>
        </h1>
      </div>
      {isLoggedIn ? (
        <div className={styles.loggedInSection}>
          <Fetchtask />
          <Fetchevent/>
          <Fetchincome></Fetchincome>
          <Fetchexpense></Fetchexpense>
          <h3 className={styles.logout} ref={childRef}>
            <Link to='/' onClick={handleLogout} style={{color:'whitesmoke'}}>Logout</Link>
          </h3>
        </div>
      ) : (
        <div className={styles.parts} ref={partsRef}>
          <h3> Features</h3>
          <h3>About</h3>
          <h3 className={styles.log} style={{color:'whitesmoke' }}>
            <Link to='/login' style={{color:'whitesmoke'}}>Login</Link> | <Link to='/signup' style={{color:'whitesmoke'}}>Signup</Link>
          </h3>
        </div>
      )}
    </div>
  );
}

export default Header;
