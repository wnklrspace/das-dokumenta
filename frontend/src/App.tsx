import { useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import ProtectedScreen from './ProtectedScreen'
import HomeScreen from './screens/Home'
import DocumentScreen from './screens/Document'
import LoginScreen from './screens/Login'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginScreen />
  },
  {
    path: '/app',
    element: (
      <ProtectedScreen>
        <HomeScreen />
      </ProtectedScreen>
    )
  },
  {
    path: '/document/:slug',
    element: (
      <ProtectedScreen>
        <DocumentScreen />
      </ProtectedScreen>
    )
  }
])

function App() {
  const href = window.location.href

  useEffect(() => {
    const user = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    const isLoggedIn = localStorage.getItem('isLoggedIn')

    if (!isLoggedIn || !user || !token) {
      router.navigate('/login')
      return
    }

    if (isLoggedIn === 'false') {
      router.navigate('/login')
      return
    }

    if (!href.includes('/document/')) {
      router.navigate('/app')
    }
  }, [])

  return <RouterProvider router={router} />
}

export default App
