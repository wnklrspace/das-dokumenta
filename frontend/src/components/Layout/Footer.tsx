import { FC } from 'react'
import styled from 'styled-components'

const Footer: FC = () => {
  const year = new Date().getFullYear()
  return (
    <Container>
      <Inner>
        <P>Copyright @ Dokumenta {year}</P>
        <P>Sommer Semester 2023, Modul: Mobile Web Applications</P>
      </Inner>
    </Container>
  )
}

const Container = styled.footer`
  position: relative;
  min-height: 40px;
  width: 100%;
  border-top: 1px solid #f0f0f0;
  background-color: #fff;

  display: flex;
  align-items: center;
`

const Inner = styled.div`
  width: 100%;
  max-width: 1440px;
  max-height: 100px;
  margin: 0 auto;
  padding: 0 20px;

  display: flex;
  justify-content: space-between;

  @media screen and (min-width: 1024px) {
    padding: 0 60px;
  }
`

const P = styled.p`
  font-size: 12px;
  color: #c0c0c0;
`

export default Footer
