import { ChangeEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Button from '../../../components/Button/Button'
import InputField from '../../../components/InputField'
import { useStatus, useToken, useUser } from '../../../store/UserProvider'
import { ErrorMessages } from '../../../types/Errors'
import http from '../../../http-common'

const LogIn = () => {
  const [userName, setUserName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<{ userNameError: boolean; passwordError: boolean }>({
    userNameError: false,
    passwordError: false
  })

  let navigate = useNavigate()
  const { setUser } = useUser()
  const { setToken } = useToken()
  const { setIsLoggedIn } = useStatus()

  function handleLoginUser() {
    http
      .post('/auth/login', { userName, password })
      .then((res) => {
        if (res.status === 200) {
          setUser(res.data.user)
          localStorage.setItem('user', JSON.stringify(res.data.user))

          setToken(res.data.token)
          localStorage.setItem('token', JSON.stringify(res.data.token))

          setIsLoggedIn(res.data.isLoggedIn)
          localStorage.setItem('isLoggedIn', JSON.stringify(res.data.isLoggedIn))

          navigate('/app')
        } else {
          console.log(res.data.message)
        }
      })
      .catch((err) => {
        switch (err.response.data.status) {
          case ErrorMessages.USER_NOT_FOUND:
            setError({ userNameError: true, passwordError: false })
            console.log('err = ', err)
            break
          case ErrorMessages.PASSWORD_INCORRECT:
            setError({ userNameError: false, passwordError: true })
            console.log('err = ', err)
            break
          default:
            setError({ userNameError: true, passwordError: true })
            console.log('err = ', err)
            break
        }
      })
  }

  return (
    <FlexContainer>
      <InputWrapper>
        <InputContainer>
          <InputField
            type="name"
            label="User Name"
            error={error.userNameError}
            onChange={(e: ChangeEvent<HTMLInputElement>): void => {
              setUserName(e.target.value)
            }}
          />
          {error.userNameError && <ClientErrorMessage>User could not be found</ClientErrorMessage>}
        </InputContainer>
        <InputContainer>
          <InputField
            type="password"
            label="Password"
            error={error.passwordError}
            onChange={(e: ChangeEvent<HTMLInputElement>): void => {
              setPassword(e.target.value)
            }}
          />
          {error.passwordError && <ClientErrorMessage>Password is incorrect</ClientErrorMessage>}
        </InputContainer>
        <Button
          title="Log In"
          disabled={userName === '' || password === ''}
          onClick={handleLoginUser}
        />
      </InputWrapper>
    </FlexContainer>
  )
}

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;

  @media screen and (min-width: 1024px) {
    align-items: flex-start;
    direction: ltr;
  }
`

const InputContainer = styled.div`
  position: relative;
`

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const ClientErrorMessage = styled.p`
  position: absolute;
  bottom: 1.2rem;
  color: #ff0000;
  font-size: 1rem;
`

export default LogIn
