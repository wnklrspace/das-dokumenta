import React, { createContext, useContext, useMemo, useState } from 'react'
import { UserProps } from '../types'
import http from '../http-common'

interface UserContextProps {
  user: UserProps | undefined
  setUser: React.Dispatch<React.SetStateAction<UserProps | undefined>>
  token: string | undefined
  setToken: React.Dispatch<React.SetStateAction<string | undefined>>
  isLoggedIn: boolean | undefined
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean | undefined>>
}

interface UserProviderProps {
  children: React.ReactNode
}

export const UserContext = createContext<UserContextProps | undefined>(undefined)

const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<UserProps | undefined>(undefined)
  const [token, setToken] = useState<string | undefined>(undefined)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(false)

  function resetCredentials() {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('isLoggedIn')
    setUser(undefined)
    setToken(undefined)
    setIsLoggedIn(false)
  }

  useMemo(() => {
    const userFromStorage = localStorage.getItem('user') || '{}'
    const tokenFromStorage = localStorage.getItem('token') || '{}'
    const statusFromStorage = localStorage.getItem('isLoggedIn') || '{}'

    http
      .get('/auth/login', {
        headers: {
          authorization: `Bearer ${JSON.parse(tokenFromStorage)}`
        }
      })
      .catch((err) => {
        console.log('err', err)
        resetCredentials()
      })
      .then((res) => {
        // @ts-ignore
        console.log(res)
        // @ts-ignore
        if (res.data.isLoggedIn === false) {
          resetCredentials()
        } else {
          setToken(JSON.parse(tokenFromStorage))
          setUser(JSON.parse(userFromStorage))
          setIsLoggedIn(JSON.parse(statusFromStorage))
        }
      })
  }, [])

  const memorizedValue = useMemo(
    () => ({ user, setUser, token, setToken, isLoggedIn, setIsLoggedIn }),
    [user, token, isLoggedIn]
  )

  return <UserContext.Provider value={memorizedValue}>{children}</UserContext.Provider>
}

export default UserProvider

export const useUser = () => {
  const context = useContext(UserContext)

  if (context === undefined) {
    throw new Error('UserContext must be used within a UserContextProvider')
  }
  return {
    user: context.user,
    setUser: context.setUser
  }
}

export const useToken = () => {
  const context = useContext(UserContext)

  if (context === undefined) {
    throw new Error('UserContext must be used within a UserContextProvider')
  }
  return {
    token: context.token,
    setToken: context.setToken
  }
}

export const useStatus = () => {
  const context = useContext(UserContext)

  if (context === undefined) {
    throw new Error('UserContext must be used within a UserContextProvider')
  }
  return {
    isLoggedIn: context.isLoggedIn,
    setIsLoggedIn: context.setIsLoggedIn
  }
}
