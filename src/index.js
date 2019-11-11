import React from 'react';
import ReactDOM from 'react-dom';
import './style/index.css';
import * as serviceWorker from './serviceWorker';
import {Provider} from 'react-redux';
import {UIRouter, UIView, pushStateLocationPlugin} from '@uirouter/react';
import {router} from './router/router';
import store from './store';



ReactDOM.render(
    <Provider store={store}>
        <UIRouter router={router} plugins={[pushStateLocationPlugin]}>
            <div><UIView/></div>
        </UIRouter>
    </Provider>,
    document.getElementById('root'));
serviceWorker.register();
