/* eslint-disable react/prop-types */
import { useApolloClient } from '@apollo/client'
import { useNavigate } from 'react-router-dom'

const LogoutButton = ({setToken}) => {
const client = useApolloClient()
const navigate = useNavigate()
const logout = () => {
    navigate('/books')
    setToken(null)
    localStorage.clear()
    client.resetStore()
}
  return (
    <button onClick={logout}>logout </button>
  )
}

export default LogoutButton