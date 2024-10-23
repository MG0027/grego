import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/footer';
import { useAuth } from '../useauth';
// import { useAuth } from '../useauth';
import API_BASE_URL from '../config';
function Login() {
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [error, setError] = useState(''); 
   const { fetchUserInfo } = useAuth();

  const handleLogin = async(e) => {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    try {
          
      const response = await fetch(`${API_BASE_URL}/user/login`, { 
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), 
      });

      const data = await response.json();
      console.log("Response Status: ", response.status); // Log status code
    console.log("Response Data: ", data); // Log response data

      if (response.ok) {

        
        await fetchUserInfo();
        navigate('/');
      } else {
        console.error("Error: ", data.message);
        setError(data.message || 'Login failed');
       
      }
    } catch (err) {
      console.error("Network or other error: ", err);
      setError('Something went wrong');
    }
  };

   
  
  useEffect(() => {
   
    if (error) {
      alert(error);
    }
  }, [error]);
  return (
    <>
    
      <section className="vh-100" style={{ position: 'relative', overflow: 'hidden' }}>
        <img 
          src="/images/pexels-lennart-wittstock-94105-316681.jpg"
          alt="Login Background" 
          style={{
            width: '100%',
            height: '100vh',         
            objectFit: 'cover',      
            position: 'absolute',     
            top: 0,
            left: 0,
            zIndex: 0              
          }} 
        />
        <div className="container-fluid h-100 d-flex align-items-center justify-content-center ">
          <div className="row w-100">
            <div className="col-sm-6 text-white" style={{ position: 'relative', zIndex: 1 , backgroundColor:'transparent'}}>
              <form style={{ width: "23rem", backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: '2rem', borderRadius: '1.3rem'}} onSubmit={handleLogin}>
                <h3 className="fw-normal mb-3 pb-3" style={{ letterSpacing: "0px",  color: 'whitesmoke' ,backgroundColor:'transparent'}}>LOGIN</h3>

                <div className="form-outline mb-4" style={{backgroundColor:'transparent'}}>
                  <input 
                    type="email" 
                    ref={emailRef} 
                    className="form-control form-control-lg" 
                    style={{ borderRadius: '0.6rem',backgroundColor:'transparent',color:'whitesmoke' }} 
                    required 
                  />
                  <label className="form-label" htmlFor="email" style={{ color: 'whitesmoke', opacity: '1' ,backgroundColor:'transparent'}}>EMAIL ADDRESS</label>
                </div>

                <div className="form-outline mb-4" style={{backgroundColor:'transparent'}}>
                  <input 
                    type="password" 
                    ref={passwordRef} 
                    className="form-control form-control-lg" 
                    style={{ borderRadius: '0.6rem' ,backgroundColor:'transparent',color:'whitesmoke'}} 
                    required 
                  />
                  <label className="form-label" htmlFor="password" style={{  color: 'whitesmoke', opacity: '0.9',backgroundColor:'transparent' }}>PASSWORD</label>
                </div>

                <div className="pt-1 mb-4" style={{backgroundColor:'transparent'}}>
                  <button type="submit" className="btn btn-light" style={{ borderRadius: '1.7rem', backgroundColor:'transparent',color:'whitesmoke' }}>LOGIN</button>
                </div>

                <p style={{backgroundColor:'transparent'}}>Don't have an account? <Link to="/signup" className="link-info" style={{backgroundColor:'transparent'}}>SIGNUP</Link></p>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer></Footer>
    </>
  );
}

export default Login;
