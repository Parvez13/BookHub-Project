import './index.css'

const TopRatedBookItem = props => {
  const {bookDetails} = props
  const {authorName, coverPic, title} = bookDetails

  return (
    <div className="top-rated-book-item-container">
      <img className="book-image" src={coverPic} alt="cover-pic" />
      <h1 className="book-title">{title}</h1>
      <p className="book-author">{authorName}</p>
    </div>
  )
}

export default TopRatedBookItem
