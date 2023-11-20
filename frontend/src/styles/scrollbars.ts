import { css } from 'styled-components'

export const ScrollbarGray = css`
  & > ::-webkit-scrollbar {
    width: 14px;
    margin: auto;
  }

  & > ::-webkit-scrollbar-thumb {
    opacity: 0.2;
    background-color: rgb(50, 50, 50);
    background-clip: content-box;
    border: 4px solid #0000;
    border-radius: 4px;
  }
`

export const ScrollbarPurple = css`
  & > ::-webkit-scrollbar {
  width: 12px;
  margin: auto;
  }

  & > ::-webkit-scrollbar-thumb {
  opacity: 0.2;
  background-color: rebeccapurple;
  background-clip: content-box;
  border: 4px solid #0000;
  border-radius: 10px;
`
