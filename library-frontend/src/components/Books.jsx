import { useQuery } from "@apollo/client"
import { ALL_BOOKS, GENRES } from "../queries"
import { useState } from 'react'

const Books = () => {
  const [genre, setGenre] = useState('')
  const result = useQuery(ALL_BOOKS , {
    variables: { genre: genre }
  })
  const resultGenres = useQuery(GENRES)
  
  if (result.loading) {
    return <div>loading...</div>
  }
  const books = result.data.allBooks
  const refetchCache = () => {
    result.refetch({ fetchPolicy: "cache-only" })
  }
  refetchCache()
  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {resultGenres.data.existingGenres.map((g,index) =>
          <button onClick={() => {setGenre(g) }} key={index}>{g}</button>)}
          <button onClick={() => {setGenre('') }}>all genres</button>
      </div>
    </div>
  )
}

export default Books
