import { createGlobalStyle } from 'styled-components'
import typography from './styles/typography'
import animation from './styles/animation'
import variables from './styles/variables'

const GlobalStyle = createGlobalStyle`
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-size: 62.5%;
	}

	html,
	body {
		scroll-behavior: smooth;
		overflow-x: clip;
		// overflow-y: hidden;
	}

	body,
	button {
		margin: 0;
		font-family: Rubik, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		overscroll-behavior: none;
	}

	code {
		font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
	}

	.hidden {
		display: none;
	}

	${typography}
	${animation}
	${variables}
`

export default GlobalStyle
