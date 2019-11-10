const defaultUser = {
    username: null,
    isLogged: false
};

export default function reducer(state = defaultUser, action) {
    // eslint-disable-next-line default-case
    switch (action.type) {
        case "SET_USER":
            {
                return { ...state, username: action.payload.username, isLogged: action.payload.isLogged };
            }
    }
    return state;
}