import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <>
      <div className="container-fluid">
        <div className="row flex-nowrap">
          {/* Sidebar */}
          <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
            <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
              <h2 className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                <span className="fs-5 d-none d-sm-inline">Menu</span>
              </h2>
              <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                <li className="nav-item">
                  <Link to="/" className="nav-link px-0 align-middle text-white">
                    <i className="fs-4 bi bi-speedometer2"></i> <span className="ms-1 d-none d-sm-inline">Dashboard</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/task" className="nav-link px-0 align-middle text-white">
                    <i className="bi bi-list-task"></i> <span className="ms-1 d-none d-sm-inline">Task Manager</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/calendar" className="nav-link px-0 align-middle text-white">
                    <i className="bi bi-calendar-event"></i> <span className="ms-1 d-none d-sm-inline">Calendar</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/expenses" className="nav-link px-0 align-middle text-white">
                    <i className="bi bi-cash-coin"></i> <span className="ms-1 d-none d-sm-inline">Expense Tracker</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/bot" className="nav-link px-0 align-middle text-white">
                    <i className="bi bi-robot"></i> <span className="ms-1 d-none d-sm-inline">Grego</span>
                  </Link>
                </li>
              </ul>
              <hr />
            </div>
          </div>

          {/* Content Area */}
          {/* Uncomment this section to display the content */}
          {/* <div className="col py-3">
            Content area...
          </div> */}
        </div>
      </div>
    </>
  );
}

export default Sidebar;
