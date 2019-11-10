import { UIRouterReact, trace, servicesPlugin, hashLocationPlugin } from '@uirouter/react';

import Login from "../components/Login";
import SignUp from "../components/Signup";
import Chatroom from "../components/Chatroom";

const states = [{
    name: 'login',
    url: '/login',
    component: Login
}, {
    name: 'signup',
    url: '/signup',
    component: SignUp
}, {
    name: 'chatroom',
    url: '/chatroom',
    component: Chatroom
}]

export const router = new UIRouterReact();
router.plugin(servicesPlugin);
router.plugin(hashLocationPlugin);

states.forEach(state => router.stateRegistry.register(state));

router.urlService.rules.initial({ state: 'login' });
router.urlService.rules.otherwise({ state: 'login' });
trace.enable(1);
