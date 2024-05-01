import {  useMutation, useQuery } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'
import { useState } from 'react'

const Authors = () => {
  const result = useQuery(ALL_AUTHORS)
  const [ editAuthorBirthYear ] = useMutation(EDIT_AUTHOR , { refetchQueries: [ { query: ALL_AUTHORS } ]} )
  const [name, setName] = useState('')
  const [year, setYear] = useState('')
  if (result.loading) {
    return <div>loading...</div>
  }
  const authors = result.data.allAuthors
  const submit = (event) => {
    event.preventDefault()
    editAuthorBirthYear({ variables: { name, setBornTo : year} })
    setName('')
    setYear('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
      <h2>Set Birth Year</h2>
      <form onSubmit={submit}>
      <select name="select author" onChange={(event) => setName(event.
      target.value)}>
        {authors.map(author =><option key={author.id}>{author.name}</option>)}
      </select>
        <div>
          Birth Year <input
            value={year}
            onChange={({ target }) => setYear(Number(target.value))}
          />
        </div>
        <button type='submit'>change number</button>
      </form>
    </div>
    </div>
  )
}

export default Authors
