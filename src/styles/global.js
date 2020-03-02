import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    outline: 0;
    /* Utilizado para que a margin e o padding sejam somados a largura do componente*/
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%
  }

  body {
    background: #7159c1;
    /* Deixa as fontes mais definidas*/
    -webkit-font-smoothing: antialiased !important
  }

  body, input, button {
    color: #222;
    font-size: 14px;
    font-family: Arial, Helvetica, sans-serif;
  }

  button {
    cursor: pointer;
  }

`;
