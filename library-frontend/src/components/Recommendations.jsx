import { useQuery } from "@apollo/client"
import { ALL_BOOKS, USER } from "../queries"
import { useEffect, useState } from "react"

const Recommendations = () => {
  const [genre, setGenre] = useState("")
  const userResult = useQuery(USER)
  const result = useQuery(ALL_BOOKS, {
    variables: { genre: genre },
  })

  useEffect(() => {
    if (!result.loading && !userResult.loading) {
      const currentUser = userResult.data.me
      setGenre(currentUser.favoriteGenre)
    }
  }, [result.loading, userResult.loading])

  if (result.loading || userResult.loading) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div>
      <h2>Recommendations</h2>
      <div>Books in your favorite genre: {genre}</div>
      <table>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {result.data.allBooks.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommendations;
