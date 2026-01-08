import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import {BsFillStarFill} from 'react-icons/bs'

import Footer from '../Footer'
import Header from '../Header'

import './index.css'

const bookshelvesList = [
  {
    id: '22526c8e-680e-4419-a041-b05cc239ece4',
    value: 'ALL',
    label: 'All',
  },
  {
    id: '37e09397-fab2-46f4-9b9a-66b2324b2e22',
    value: 'READ',
    label: 'Read',
  },
  {
    id: '2ab42512-3d05-4fba-8191-5122175b154e',
    value: 'CURRENTLY_READING',
    label: 'Currently Reading',
  },
  {
    id: '361d5fd4-9ea1-4e0c-bd47-da2682a5b7c8',
    value: 'WANT_TO_READ',
    label: 'Want to Read',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class BookShelves extends Component {
  state = {
    activeShelfId: bookshelvesList[0].id,
    activeShelfValue: bookshelvesList[0].value,
    searchInput: '',
    booksList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getBooks()
  }

  getBooks = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {activeShelfValue, searchInput} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/book-hub/books?shelf=${activeShelfValue}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.books.map(eachBook => ({
        id: eachBook.id,
        title: eachBook.title,
        authorName: eachBook.author_name,
        readStatus: eachBook.read_status,
        rating: eachBook.rating,
        coverPic: eachBook.cover_pic,
      }))
      this.setState({
        booksList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSearch = () => {
    this.getBooks()
  }

  onClickShelf = (id, value) => {
    this.setState({activeShelfId: id, activeShelfValue: value}, this.getBooks)
  }

  renderBooksListSuccessView = () => {
    const {booksList, searchInput} = this.state
    if (booksList.length === 0) {
      return (
        <div className="no-books-view">
          <img
            src="https://res.cloudinary.com/dahdfe5do/image/upload/v1767434095/bookshelves_failure_mw8cyk.png"
            alt="no books"
          />
          <p>Your search for {searchInput} did not find any matches.</p>
        </div>
      )
    }

    return (
      <ul className="books-list">
        {booksList.map(eachBook => (
          <li key={eachBook.id} className="book-item">
            <Link to={`/books/${eachBook.id}`} className="link-item">
              <img
                src={eachBook.coverPic}
                alt={eachBook.title}
                className="book-cover"
              />
              <div className="book-info">
                <h1 className="book-title">{eachBook.title}</h1>
                <p className="author-name">{eachBook.authorName}</p>
                <div className="rating-container">
                  <p>Avg Rating</p>
                  <BsFillStarFill className="star-icon" />
                  <p>{eachBook.rating}</p>
                </div>
                <p className="status">
                  Status:{' '}
                  <span className="status-highlight">
                    {eachBook.readStatus}
                  </span>
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  onRetryBooksListAgain = () => {
    this.getBooks()
  }

  renderBooksListFailureView = () => (
    <div className="books-list-failure-view">
      <img
        src="https://res.cloudinary.com/dahdfe5do/image/upload/v1767067447/Home_page_failure._desktop_lmor2r.png"
        alt="failure view"
      />
      <p className="books-list-failure-paragraph">
        Something went wrong, Please try again
      </p>
      <button
        type="button"
        className="books-list-failure-button"
        onClick={this.onRetryBooksListAgain}
      >
        Try Again
      </button>
    </div>
  )

  renderBooksListLoadingView = () => (
    <div className="books-loader" testid="loader">
      <Loader type="Oval" color="#0284c7" height="50" width="50" />
    </div>
  )

  renderAllViews = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderBooksListSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderBooksListLoadingView()
      case apiStatusConstants.failure:
        return this.renderBooksListFailureView()
      default:
        return null
    }
  }

  render() {
    const {activeShelfId, searchInput} = this.state

    const activeShelfObject = bookshelvesList.find(
      eachShelf => eachShelf.id === activeShelfId,
    )

    return (
      <div className="bookshelves-container">
        <Header />
        <div className="components-container">
          <div className="label-container">
            <h1 className="bookshelves-title">Bookshelves</h1>
            <ul className="shelves-list">
              {bookshelvesList.map(each => {
                const activeClassName =
                  activeShelfId === each.id ? 'active-link' : ''

                return (
                  <li key={each.id} className="shelf-item">
                    <button
                      type="button"
                      className={`bookshelves-section ${activeClassName}`}
                      onClick={() => this.onClickShelf(each.id, each.value)}
                    >
                      {each.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="search-content-container">
            <div className="search-header-container">
              <h1 className="selected-shelf-name">
                {activeShelfObject.label} Books
              </h1>
              <div className="search-input-container">
                <input
                  type="search"
                  className="search-input"
                  placeholder="Search"
                  value={searchInput}
                  onChange={this.onChangeSearchInput}
                />
                <button
                  type="button"
                  testid="searchButton"
                  className="search-button"
                  onClick={this.onSearch}
                >
                  <BsSearch />
                </button>
              </div>
            </div>
            <div className="label-mobile-container">
              <h1 className="bookshelves-mobile-heading">Bookshelves</h1>
              <ul className="shelves-mobile-list">
                {bookshelvesList.map(each => {
                  const activeClassName =
                    activeShelfId === each.id ? 'active-link' : ''

                  return (
                    <li key={each.id} className="shelf-item">
                      <button
                        type="button"
                        className={`bookshelves-section ${activeClassName}`}
                        onClick={() => this.onClickShelf(each.id, each.value)}
                      >
                        {each.label}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
            {this.renderAllViews()}
            <Footer />
          </div>
        </div>
      </div>
    )
  }
}

export default BookShelves
