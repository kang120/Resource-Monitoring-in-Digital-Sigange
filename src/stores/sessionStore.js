import create from 'zustand'

const useSessionStore = create((set) => ({
    auth: {},

    setAuth: (auth) => {
        set({auth: auth})
    }
}))

export default useSessionStore;
