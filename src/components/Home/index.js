import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import Slider from 'react-slick'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import Header from '../Header'
import TopRatedBookItem from '../TopRatedBookItem'
import Footer from '../Footer'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILULRE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    topRatedBooks: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getBooksData()
  }

  getBooksData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = 'https://apis.ccbp.in/book-hub/top-rated-books'
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.books.map(book => ({
        id: book.id,
        authorName: book.author_name,
        coverPic: book.cover_pic,
        title: book.title,
      }))

      this.setState({
        topRatedBooks: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderTopRatedBooksSuccessView = () => {
    const {topRatedBooks} = this.state
    const settings = {
      dots: false,
      slidesToShow: 5,
      slidesToScroll: 1,
      infinite: true,
      arrows: true,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
      ],
    }
    return (
      <div className="home-container">
        <Header />
        <h1 className="home-heading">Find Your Next Favourite Books?</h1>
        <p className="home-paragraph">
          You are in the right place, Tell us what titles or genres you have
          enjoyed in the past, and we will give you surprinsingly insightful
          recommendations.
        </p>
        <div className="books-container">
          <div className="books-detail-container">
            <h1 className="books-detail-heading">Top Rated Books</h1>
            <Link to="/books">
              <button type="button" className="books-detail-button">
                Find Books
              </button>
            </Link>
          </div>
          <div className="slider-container">
            <Slider {...settings}>
              {topRatedBooks.map(eachBook => (
                <TopRatedBookItem key={eachBook.id} bookDetails={eachBook} />
              ))}
            </Slider>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  onRetryBookDetailsAgain = () => {
    this.getBooksData()
  }

  renderTopRatedBooksFailureView = () => (
    <div className="books-failure-view">
      <img
        src="https://res.cloudinary.com/dahdfe5do/image/upload/v1767067447/Home_page_failure._desktop_lmor2r.png"
        alt="failure view"
      />
      <p className="books-failure-paragraph">
        Something went wrong, Please try again
      </p>
      <button
        type="button"
        className="books-failure-button"
        onClick={this.onRetryBookDetailsAgain}
      >
        Try Again
      </button>
    </div>
  )

  renderTopRatedBooksLoadingView = () => (
    <div className="books-loader" data-testid="loader">
      <Loader type="Oval" color="#0284c7" height="50" width="50" />
    </div>
  )

  renderHomePage = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderTopRatedBooksSuccessView()
      case apiStatusConstants.failure:
        return this.renderTopRatedBooksFailureView()
      case apiStatusConstants.inProgress:
        return this.renderTopRatedBooksLoadingView()
      default:
        null
    }
  }

  render() {
    return <>{this.renderHomePage()}</>
  }
}

export default Home
