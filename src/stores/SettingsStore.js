import create from 'zustand'

const useSettingStore = create((set) => ({
    settings: {
        "development_base_url": 'http://localhost:3000',
        "production_base_url": '..',
        "api": {
            "base_url": 'http://localhost:2020',
            "getUserActivities": '/api/get_user_activities',
            'getMinMaxDate': '/api/get_min_max_date',
            'getUsers': '/api/get_users',
            'addUser': '/api/add_user',
            'updateUser': '/api/update_user',
            'deleteUser': '/api/delete_user'
        }
    },

    setSettings: (newSettings) => {
        set({settings: newSettings})
    }
}))

export default useSettingStore;
