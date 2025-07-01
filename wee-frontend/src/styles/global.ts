import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
    @import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css");
    * {
        margin: 0;
        box-sizing: border-box;
        font-family: 'Pretendard';
        letter-spacing : -0.02em;
    }
    body, html {
        margin: 0;
        padding: 0;

        &::-webkit-scrollbar {
            display: none;
        }
    }
    .inner {
        margin: 0 auto;
        padding: 0 20px;
        width:100%;
        max-width: 1080px;
    }

    button {
        all:unset;
        cursor:pointer;
        text-align: center;
        transition: all 0.2s ease;
        &:hover, &:focus {
            filter: brightness(0.9);
            // transform: scale(1.01);
        }
    }

    img {
        -webkit-user-drag: none;
        -khtml-user-drag: none;
        -moz-user-drag: none;
        -o-user-drag: none;
        user-drag: none;
    }

    input {
        all: unset;
        box-sizing: border-box;
        padding: 15px;
    }
`;

export default GlobalStyles;