import { ChangeEvent, useState } from 'react'
import styled from 'styled-components'
import InputField from '../../../components/InputField'

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const SignUp = () => {
  const [name, setName] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [role, setRole] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  return (
    <FlexContainer>
      <div>
        <h1>Log In</h1>
        <InputField
          type="name"
          label="Name"
          onChange={(e: ChangeEvent<HTMLInputElement>): void => {
            setName(e.target.value)
          }}
        />
        <InputField
          type="name"
          label="User Name"
          onChange={(e: ChangeEvent<HTMLInputElement>): void => {
            setUserName(e.target.value)
          }}
        />
        <InputField
          type="email"
          label="Email"
          onChange={(e: ChangeEvent<HTMLInputElement>): void => {
            setEmail(e.target.value)
          }}
        />
        <InputField
          type="name"
          label="Role"
          onChange={(e: ChangeEvent<HTMLInputElement>): void => {
            setRole(e.target.value)
          }}
        />
        <InputField
          type="password"
          label="Password"
          onChange={(e: ChangeEvent<HTMLInputElement>): void => {
            setPassword(e.target.value)
          }}
        />
      </div>
    </FlexContainer>
  )
}

export default SignUp
