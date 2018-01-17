import { injectGlobal } from 'styled-components';
// import myFont from '../../public/fonts/SSF4.tff';

injectGlobal`
  @font-face {
    font-family: 'SSF4';
    src: url('../../public/fonts/SSF4.tff') format('truetype');
    font-weight: normal;
    font-style: normal;
  }
  html,
  h1{
    font-family: 'SSF4'
  }
`;

