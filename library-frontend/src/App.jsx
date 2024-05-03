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
const App = () => {
  const [token, setToken] = useState(null)

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
        <LogoutButton setToken={setToken} />
        </>
        } 
      </div>
      <Routes>
        <Route path="/" element={<Authors />} />
        <Route path="/authors" element={<Authors />} />
        <Route path="/books" element={<Books />} />
        <Route path="/add" element={<NewBook />} />
        <Route path="/login" element={<LoginForm setToken={setToken}/>} />
      </Routes>
    </Router>
  )
}

export default App
