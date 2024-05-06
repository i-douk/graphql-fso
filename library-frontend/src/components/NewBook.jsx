import { useState } from 'react'
import { ADD_BOOK, ALL_BOOKS , ALL_AUTHORS } from '../queries'
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { updateCache } from '../App'
const NewBook = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
 
  const [addBook] = useMutation(ADD_BOOK, {
    update: (cache, response) => {
      const { addAuthor, addBook } = response.data
      
      updateCache(cache, { query: ALL_BOOKS }, addBook)
  
      if (addAuthor) {
        cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
          console.log(addAuthor)
          return {
            allAuthors: allAuthors.concat(addAuthor)
          }
        })
      }
    }
  })
  

  const submit = async (event) => {
    event.preventDefault()
    addBook({  variables: { title, author, published, genres } })
    console.log('add book...')
    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
    navigate('/books')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(Number(target.value))}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook