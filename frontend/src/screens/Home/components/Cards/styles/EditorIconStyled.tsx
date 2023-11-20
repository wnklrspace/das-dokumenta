import styled from 'styled-components'
export const EditorIcon = styled.div`
  width: 3rem;
  height: 3rem;
  background: ${(props) => props.color || '#EB49EE;'};
  border: 2px solid #ffffff;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  margin-left: -8px;

  @media (min-width: 1024px) {
    font-size: 1.2rem;
    width: 3.5rem;
    height: 3.5rem;
  }
`
