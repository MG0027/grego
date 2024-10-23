import { Link } from "react-router-dom";
import './footer.css';
import "bootstrap/dist/css/bootstrap.min.css";

function Footer() {
  return (
    <footer className="py-5" style={{ marginLeft: '2rem' }}>
      <div className="row">
        <div className="col-2">
          <h5 className="footer-title">Grego</h5>
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
            <h4 className="nav-link footer-links">Home</h4>
            </li>
            <li className="nav-item mb-2">
            <h4 className="nav-link footer-links">Features</h4>
            </li>
            <li className="nav-item mb-2">
            <h4 className="nav-link footer-links">FAQs</h4>
            </li>
            <li className="nav-item mb-2">
            <h4 className="nav-link footer-links">About</h4>
            </li>
          </ul>
        </div>

        <div className="col-2">
          <h5 className="footer-title">Grego</h5>
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
            <h4 className="nav-link footer-links">Home</h4>
            </li>
            <li className="nav-item mb-2">
            <h4 className="nav-link footer-links">Features</h4>
            </li>
            <li className="nav-item mb-2">
            <h4 className="nav-link footer-links">FAQs</h4>
            </li>
            <li className="nav-item mb-2">
            <h4 className="nav-link footer-links">About</h4>
            </li>
          </ul>
        </div>

        <div className="col-2">
          <h5 className="footer-title">Grego</h5>
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
            <h4 className="nav-link footer-links">Home</h4>
            </li>
            <li className="nav-item mb-2">
            <h4 className="nav-link footer-links">Features</h4>
            </li>
            <li className="nav-item mb-2">
            <h4 className="nav-link footer-links">FAQs</h4>
            </li>
            <li className="nav-item mb-2">
            <h4 className="nav-link footer-links">About</h4>
            </li>
          </ul>
        </div>

        <div className="col-4 offset-1">
          <form>
            <h5 className="footer-title">Subscribe to our newsletter</h5>
            <p className="footer-subscribe-text">Monthly digest of what's new and exciting from us.</p>
            <div className="d-flex w-100 gap-2">
              <label htmlFor="newsletter1" className="visually-hidden">Email address</label>
              <input id="newsletter1" type="text" className="form-control" placeholder="Email address" />
              <button className="btn btn-primary" type="button" style={{ backgroundColor: 'black', border: 'none' }}>Subscribe</button>
            </div>
          </form>
        </div>
      </div>

      <div className="d-flex justify-content-between py-4 my-4 border-top">
        <p>© 2024 Grego, Inc. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
