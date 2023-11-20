import { css } from 'styled-components'

const typography = css`
  @font-face {
    font-family: 'Rubik';
    src: url('../media/font/Rubik-VariableFont_wght.ttf') format('truetype');
  }

  h1 {
    font-size: 2.4rem;
    font-weight: 700;
  }

  p,
  textarea {
    font-family: Rubik, sans-serif;
    font-size: 1.6rem;
    font-weight: 400;
    line-height: 1.2;
  }

  button {
    font-size: 1.6rem;
    font-weight: 500;
  }

  a.back-button {
    font-size: 1.4rem;
    font-weight: 500;
  }

  h3 {
    font-size: 1.4rem;
    font-weight: 600;
  }

  p.small {
    font-size: 1rem;
    font-weight: 300;
  }

  span.initial {
    font-size: 1.6rem;
    font-weight: 400;
  }

  label {
    font-size: 1.6rem;
    font-weight: 500;
  }

  @media (min-width: 1024px) {
    h1 {
      font-size: 3.6rem;
    }

    p {
      font-size: 2rem;
    }

    button {
      font-size: 2rem;
    }

    h3 {
      font-size: 1.6rem;
    }

    p.small {
      font-size: 1.4rem;
    }

    span.initial {
      font-size: 2rem;
    }
  }
`

export default typography
