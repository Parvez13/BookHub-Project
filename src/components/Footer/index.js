import {
  FaGoogle,
  FaTwitter,
  FaInstagram,
  FaYoutube,
} from 'react-icons/fa'

import './index.css'

const Footer = () => (
  <div className="footer-container">
    <div className="icons-container">
      <button type="button" className="icon-button" aria-label="google">
        <FaGoogle className="footer-icon" />
      </button>
      <button type="button" className="icon-button" aria-label="twitter">
        <FaTwitter className="footer-icon" />
      </button>
      <button type="button" className="icon-button" aria-label="instagram">
        <FaInstagram className="footer-icon" />
      </button>
      <button type="button" className="icon-button" aria-label="youtube">
        <FaYoutube className="footer-icon" />
      </button>
    </div>
    <p className="contact-us-text">Contact Us</p>
  </div>
)

export default Footer