/* eslint-disable react/prop-types */
import { useApolloClient } from '@apollo/client'
import { Link, useNavigate } from 'react-router-dom'

const LogoutButton = ({setToken}) => {
const client = useApolloClient()
const navigate = useNavigate()
const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    navigate('/authors')
}
  return (
    <Link onClick={logout}><button>logout </button></Link>
  )
}

export default LogoutButton