import { useEffect, useState } from 'react'

const useWindowSize = () => {
  const [vh, setVh] = useState<number>(0)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  const handleSize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }

  useEffect(() => {
    handleSize()

    window.addEventListener('resize', handleSize)

    return () => window.removeEventListener('resize', handleSize)
  }, [])

  useEffect(() => {
    setVh(window.innerHeight * 0.01)
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }, [vh])

  return windowSize
}

export default useWindowSize
