import React, { FC } from 'react'
import styled from 'styled-components'

interface Props {
  type: 'name' | 'password' | 'email'
  label: string
  error?: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const InputField: FC<Props> = ({ type, label, error = false, onChange }) => {
  return (
    <>
      <label>{label}</label>
      <StyledInput type={type} error={error} onChange={onChange} />
    </>
  )
}

const StyledInput = styled.input<{ error: boolean }>`
  width: 100%;
  font-size: 1.6rem;
  padding: 1.6rem 0.8rem;
  margin-bottom: 3.2rem;
  outline: none;
  border: none;
  border-bottom: 0.3rem solid #d1d1d1;

  ${(props) =>
    props.error &&
    `
      border-bottom: 0.3rem solid #ff0000;
    `}
`

export default InputField
