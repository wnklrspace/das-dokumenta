import styled from 'styled-components'

const LoginScreen = () => {
  return (
    <Container>
      <LoginScreenWrapper>
        <LoginContentWrapper>
          <LoginImage />
          <LoginFormWrapper>
            <h1>ABC</h1>
            <p> Lorem Ipsum </p>
          </LoginFormWrapper>
        </LoginContentWrapper>
      </LoginScreenWrapper>
    </Container>
  )
}

const Container = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 100vh;

  @media screen and (min-width: 1024px) {
    padding: 0 4rem;
    height: 100vh;
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
  grid-gap: 4rem;
  align-items: center;
  width: 100%;

  @media (max-width: 999px) {
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

  @media screen and (min-width: 1024px) {
    justify-content: start;
    align-items: flex-start;
  }
`

const LoginImage = styled.div`
  height: 300px;
  width: 100%;
  border-radius: 1rem;

  background: red;

  @media screen and (min-width: 1024px) {
    height: 100%;
    width: 100%;
    border-radius: 2rem;
  }
`

export default LoginScreen
