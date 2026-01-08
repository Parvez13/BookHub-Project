import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsFillStarFill} from 'react-icons/bs'

import Header from '../Header'
import Footer from '../Footer'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class BookDetails extends Component {
  state = {
    bookDataDetails: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getBookDetails()
  }

  getBookDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    // console.log(`bookUniqueId: ${id}`)

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')
    const bookDetailsApiUrl = `https://apis.ccbp.in/book-hub/books/${id}`
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    const response = await fetch(bookDetailsApiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const bookDetails = fetchedData.book_details
      const updatedData = {
        aboutAuthor: bookDetails.about_author,
        aboutBook: bookDetails.about_book,
        authorName: bookDetails.author_name,
        id: bookDetails.id,
        rating: bookDetails.rating,
        readStatus: bookDetails.read_status,
        title: bookDetails.title,
        coverPic: bookDetails.cover_pic,
      }
      this.setState({
        bookDataDetails: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderBookDetailsSuccessView = () => {
    const {bookDataDetails} = this.state
    const {
      aboutAuthor,
      coverPic,
      aboutBook,
      title,
      rating,
      authorName,
      readStatus,
    } = bookDataDetails
    return (
      <>
        <div className="book-detail-main-container">
          <Header />
          <div className="book-data-container">
            <div className="book-info-container">
              <img src={coverPic} className="book-cover" alt={title} />
              <div className="book-info-data-container">
                <h1 className="book-info-data-heading">{title}</h1>
                <p className="book-info-data-description">{authorName}</p>
                <div className="book-rating">
                  <p className="book-info-data-description">Avg Rating: </p>
                  <BsFillStarFill className="star-icon" />
                  <p className="book-info-data-description">{rating}</p>
                </div>
                <p className="status">
                  Status: <span className="status-highlight">{readStatus}</span>
                </p>
              </div>
            </div>
            <hr className="break" />
            <div className="about-section">
              <h1 className="about-heading">About Author</h1>
              <p className="about-description">{aboutAuthor}</p>
              <h1 className="about-heading">About Book</h1>
              <p className="about-description">{aboutBook}</p>
            </div>
          </div>
          <Footer className="footer" />
        </div>
      </>
    )
  }

  onRetryBookDetail = () => {
    this.getBookDetails()
  }

  renderBookDetailsFailureView = () => (
    <div className="books-detail-failure-view">
      <img
        src="https://res.cloudinary.com/dahdfe5do/image/upload/v1767067447/Home_page_failure._desktop_lmor2r.png"
        alt="failure view"
      />
      <p className="books-detail-failure-paragraph">
        Something went wrong, Please try again
      </p>
      <button
        type="button"
        className="books-detail-failure-button"
        onClick={this.onRetryBookDetail}
      >
        Try Again
      </button>
    </div>
  )

  renderBookDetailsLoadingView = () => (
    <div className="book-details-loader" testid="loader">
      <Loader type="Oval" color="#0284c7" height="50" width="50" />
    </div>
  )

  renderBookDetailsPage = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderBookDetailsSuccessView()
      case apiStatusConstants.failure:
        return this.renderBookDetailsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderBookDetailsLoadingView()
      default:
        return null
    }
  }

  render() {
    return <>{this.renderBookDetailsPage()}</>
  }
}

export default BookDetails
