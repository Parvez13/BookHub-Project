import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  renderPasswordField = () => {
    const {password} = this.state
    return (
      <>
        <label className="input-label" htmlFor="password">
          Password*
        </label>
        <input
          type="password"
          id="password"
          className="password-input-field"
          value={password}
          onChange={this.onChangePassword}
        />
      </>
    )
  }

  renderUserInputField = () => {
    const {username} = this.state
    return (
      <>
        <label className="input-label" htmlFor="username">
          Username*
        </label>
        <input
          type="text"
          id="username"
          className="username-input-field"
          value={username}
          onChange={this.onChangeUsername}
        />
      </>
    )
  }

  render() {
    const {showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-page-container">
        <img
          src="https://res.cloudinary.com/dahdfe5do/image/upload/v1766996383/Login_desktop_emhalz.png"
          alt="login-page"
          className="login-desktop-image"
        />
        <img
          src="https://res.cloudinary.com/dahdfe5do/image/upload/v1766996385/Login_mobile_wpcxff.png"
          alt="login-page"
          className="login-mobile-image"
        />
        <div className="login-container">
          <form className="login-details" onSubmit={this.submitForm}>
            <div className="logo-image-container">
              <img
                src="https://res.cloudinary.com/dahdfe5do/image/upload/v1766998073/Login_desktop_logo_wrsd6h.png"
                alt="logo-desktop"
                className="logo-desktop"
              />
              <h1 className="logo-heading">OOK HUB</h1>
            </div>
            <div className="input-container">{this.renderUserInputField()}</div>
            <div className="input-container">{this.renderPasswordField()}</div>
            {showSubmitError && <p className="error-message">{errorMsg}</p>}
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }
}

export default Login
