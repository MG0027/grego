import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';

function Signup() {
  const navigate = useNavigate();
  const fullNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [error, setError] = useState(''); 

  const handleSignup = async(e) => {
    e.preventDefault();

    const fullName = fullNameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      
      const response = await fetch('http://localhost:2000/user/signup', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, email, password }), 
      });

      const data = await response.json();
    
      if (response.ok) {
      
        navigate('/login');  
      } else {
        setError(data.message || 'Signup failed'); 
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  return (
    <>
    
      <section className="vh-100" style={{ position: 'relative', overflow: 'hidden' }}>
        <img 
          src="/images/pexels-lennart-wittstock-94105-316681.jpg"
          alt="Signup Background" 
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
        <div className="container-fluid h-100 d-flex align-items-center justify-content-center">
          <div className="row w-100">
            <div className="col-sm-6 text-white" style={{ position: 'relative', zIndex: 1 , backgroundColor:'transparent'}} >
              <form style={{ width: "23rem", backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: '2rem', borderRadius: '1.3rem' }} onSubmit={handleSignup}>
                <h3 className="fw-normal mb-3 pb-3" style={{ letterSpacing: "0px", backgroundColor:'transparent', color: 'whitesmoke' }}>SIGNUP</h3>

                <div className="form-outline mb-4" style={{backgroundColor:'transparent'}}>
                  <input 
                    type="text" 
                    ref={fullNameRef} 
                    className="form-control form-control-lg" 
                    style={{ borderRadius: '0.6rem',backgroundColor:'transparent',color:'whitesmoke' }} 
                    required
                  />
                  <label className="form-label" htmlFor="fullName" style={{ backgroundColor:'transparent', color: 'whitesmoke', opacity: '0.9' }}>FULL NAME</label>
                </div>

                <div className="form-outline mb-4" style={{backgroundColor:'transparent'}}>
                  <input 
                    type="email" 
                    ref={emailRef} 
                    className="form-control form-control-lg" 
                    style={{ borderRadius: '0.6rem', backgroundColor:'transparent',color:'whitesmoke'}} 
                    required
                  />
                  <label className="form-label" htmlFor="email" style={{ fontFamily: 'Futura, sansSerif', color: 'whitesmoke', opacity: '0.9',backgroundColor:'transparent',color:'whitesmoke' }}>EMAIL ADDRESS</label>
                </div>

                <div className="form-outline mb-4" style={{backgroundColor:'transparent'}}>
                  <input 
                    type="password" 
                    ref={passwordRef} 
                    className="form-control form-control-lg" 
                    style={{ borderRadius: '0.6rem',backgroundColor:'transparent',color:'whitesmoke' }} 
                    required
                  />
                  <label className="form-label" htmlFor="password" style={{ fontFamily: 'Futura, sansSerif', color: 'whitesmoke', opacity: '0.9',backgroundColor:'transparent',color:'whitesmoke' }}>PASSWORD</label>
                </div>

                <div className="pt-1 mb-3" style={{backgroundColor:'transparent'}}>
                  <button type="submit" className="btn btn-light" style={{ borderRadius: '1.7rem', textAlign: 'center', backgroundColor:'transparent',color:'whitesmoke' }}>SIGNUP</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer></Footer>
    </>
  );
}

export default Signup;
