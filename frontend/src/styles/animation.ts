import { css } from 'styled-components'

const animation = css`
  .blink {
    animation: flicker 1s;
  }

  @keyframes flicker {
    0% {
      opacity: 100%;
    }
    12.5% {
      opacity: 50%;
    }
    25% {
      opacity: 100%;
    }
    37.5% {
      opacity: 50%;
    }
    50% {
      opacity: 100%;
    }
    62.5% {
      opacity: 50%;
    }
    75% {
      opacity: 100%;
    }
    87.5% {
      opacity: 50%;
    }
    100% {
      opacity: 100%;
    }
  }
`

export default animation
