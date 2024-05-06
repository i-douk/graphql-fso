/* eslint-disable no-unused-vars */
import { useQuery, useMutation , useSubscription } from '@apollo/client'
import { useState } from "react"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'
import LoginForm from "./components/loginForm"
import LogoutButton from "./components/LogoutButton"
import Recommendations from "./components/Recommendations"
import { BOOK_ADDED , ALL_BOOKS} from './queries'

// function that takes care of manipulating cache
export const updateCache = (cache, query, addedBook) => {
    // helper that is used to eliminate saving same person twice
    const uniqByName = (a) => {
      let seen = new Set()
      return a.filter((item) => {
        let k = item.name
        return seen.has(k) ? false : seen.add(k)
      })  }
  cache.updateQuery(query, ({ allBooks }) => {
    return {
    allBooks: uniqByName(allBooks.concat(addedBook)),
  }
})}

const App = () => {
  const [token, setToken] = useState(null)
  useSubscription(BOOK_ADDED, {
    onData: ({data , client }) => {
        if (data && data.data.bookAdded) {
          const addedBook = data.data.bookAdded
            console.log(data)
            window.alert(`${data.data.bookAdded.title} was added to the library`)
            updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
        } else {
            console.log(`Couldn't access data of added book`)
        }
    }
})
  return (
      <Router>
      <div>
        <Link to="/authors"><button> authors</button></Link>
        <Link to="/books"><button>books</button></Link>
        {
        !token?
          <Link to="/login"><button>login</button></Link>
        :
        <>
          <Link to="/add"><button>add a book</button></Link>
          <Link to="/recommend"><button>recommend</button></Link>
        <LogoutButton setToken={setToken} />
        </>
        } 
      </div>
      <Routes>
        <Route path="/" element={<Authors />} />
        <Route path="/authors" element={<Authors />} />
        <Route path="/books" element={<Books />} />
        <Route path="/add" element={<NewBook />} />
        <Route path="/recommend" element={<Recommendations />} />
        <Route path="/login" element={<LoginForm setToken={setToken}/>} />
      </Routes>
    </Router>
  )
}

export default App
