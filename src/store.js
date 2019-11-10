import { applyMiddleware, createStore, compose } from "redux";
import * as storage from 'redux-storage';
import createEngine from 'redux-storage-engine-localstorage';
import promise from "redux-promise-middleware";
import reducers from "./reducers";

storage.reducer(reducers);
const engine = createEngine('state');
const storageMiddleware = storage.createMiddleware(engine);

const middleware = applyMiddleware(promise(), storageMiddleware);
const composeEnhancers = compose;

const enhancer = composeEnhancers(middleware);
const store = createStore(reducers, enhancer);
const load = storage.createLoader(engine);

load(store);
export default store;