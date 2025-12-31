import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <div className="not-found-container">
    <img
      src="https://res.cloudinary.com/dahdfe5do/image/upload/v1767004876/not_found_desktop_yn3hmd.png"
      alt="page-not-found"
      className="not-found-desktop-img"
    />
    <img
      src="https://res.cloudinary.com/dahdfe5do/image/upload/v1767004887/not_found_mobile_pdrst7.png"
      alt="page-not-found"
      className="not-found-mobile-img"
    />
    <h1 className="heading">Page Not Found</h1>
    <p className="description">
      We are sorry, the page you requested could not be found,
      <br />
      Please go back to the homepage
    </p>
    <Link to="/" className="link-item">
      <button type="button" className="button">
        Go Back to Home
      </button>
    </Link>
  </div>
)

export default NotFound
