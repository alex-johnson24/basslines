import "es6-promise";
import "es6-promise/auto";
import "es6-object-assign/auto";
import * as React from "react";
import * as ReactDOM from "react-dom";
import App from './components/App';
import { BrowserRouter } from 'react-router-dom';

declare global {
  interface Window {
    __BASENAME__: string;
    __APP_VERSION__: string;
  }
}

const basename = window.__BASENAME__;
const version = window.__APP_VERSION__;

delete window.__BASENAME__;
delete window.__APP_VERSION__;

ReactDOM.render(
    <BrowserRouter basename={basename}>
        <App appName="ChaggarCharts" version={version} basename={basename} />
    </BrowserRouter>,
    document.getElementById('mountNode')
);