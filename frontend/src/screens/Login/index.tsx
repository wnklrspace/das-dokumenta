import { useState } from 'react'
import styled from 'styled-components'
import Layout from '../../components/Layout'
import LogIn from './components/LogIn'
import SignUp from './components/SignUp'

const LoginScreen = () => {
  const [view] = useState<string>('login')
  return (
    <Layout>
      <Container>
        <LoginScreenWrapper>
          <LoginContentWrapper>
            <LoginImage>
              <img
                src="/login_image.png"
                alt="Person on their phone enjoying our app"
                className="LoginImg"
              />
            </LoginImage>
            <LoginFormWrapper>
              <h1>Review your documents live with others.</h1>
              <Inner>{view === 'login' ? <LogIn /> : <SignUp />}</Inner>
            </LoginFormWrapper>
          </LoginContentWrapper>
        </LoginScreenWrapper>
      </Container>
    </Layout>
  )
}

const Inner = styled.div`
  display: flex;
  max-width: 400px;
  margin-top: 6.4rem;
`

const Container = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 2rem;

  @media screen and (min-width: 1024px) {
    padding: 0 4rem 4rem 4rem;
    height: calc(100vh - 80px);
  }
`

const LoginScreenWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  height: 100%;
`

const LoginContentWrapper = styled.div`
  display: grid;
  grid-template-rows: max-content auto;
  grid-gap: 6.8rem;
  align-items: center;
  width: 100%;

  @media (max-width: 1023px) {
    > :first-child {
      max-height: 350px;
    }
  }

  @media (min-width: 1024px) {
    display: grid;
    grid-template-rows: 100%;
    grid-template-columns: 50% 50%;
    height: 100%;
    grid-gap: 0;
    grid-auto-flow: column;
    direction: rtl;
  }
`

const LoginFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  max-width: 500px;

  h1 {
    text-align: center;
  }

  @media screen and (min-width: 1024px) {
    align-items: flex-start;
    direction: ltr;
    padding-right: 4rem;

    h1 {
      text-align: left;
    }
  }
`

const LoginImage = styled.div`
  height: 300px;
  width: 100%;
  border-radius: 1rem;
  background-color: #f1f1f1;
  overflow: hidden;

  .LoginImg {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  @media screen and (min-width: 1024px) {
    height: 100%;
    width: 100%;
    border-radius: 2rem;
  }
`

export default LoginScreen
