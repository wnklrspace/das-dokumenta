import { FC } from 'react'
import styled from 'styled-components'

interface Props {
  title: string
  disabled?: boolean
  onClick: () => void
}

const Button: FC<Props> = ({ title, disabled = false, onClick }) => {
  return (
    <ButtonContainer disabled={disabled} onClick={onClick}>
      {title}
    </ButtonContainer>
  )
}

const ButtonContainer = styled.button<{ disabled: boolean }>`
  height: 60px;
  padding: 0 30px;
  border: none;
  outline: none;
  border-radius: 5px;
  background-color: #6500b5;
  color: #fff;
  font-size: 1.6rem;
  cursor: pointer;
  width: 100%;
  box-shadow: 0 4px 8px rgba(101, 16, 186, 0.32);
  transition: all 0.1s ease-out;

  :hover {
    background-color: #4d0c8f;
    transform: scale(1.02);
    box-shadow: 0 4px 16px rgba(101, 16, 186, 0.32);
  }

  :active {
    transform: scale(1.04);
  }
  @media screen and (min-width: 1024px) {
    width: auto;
  }
`

export default Button
