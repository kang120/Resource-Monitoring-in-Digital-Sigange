import create from 'zustand'

const useSettingStore = create((set) => ({
    settings: {
        "development_base_url": 'http://localhost:3000',
        "production_base_url": '..',
        "api": {
            "development_base_url": 'http://localhost:2020',
            "production_base_url": "http://5345-180-75-93-235.ngrok-free.app",
            "auth": '/api/auth',
            "getUserActivities": '/api/get_user_activities',
            'getMinMaxDate': '/api/get_min_max_date',
            'getUsers': '/api/get_users',
            'addUser': '/api/add_user',
            'updateUser': '/api/update_user',
            'deleteUser': '/api/delete_user',
            'customClustering': '/api/custom_clustering',
            'getMonthCluster': '/api/get_month_cluster',
            'getClusterReport': '/api/get_cluster_report',
            'getClusterReports': '/api/get_cluster_reports',
            'saveReport': '/api/save_report',
            'deleteReport': '/api/delete_report'
        }
    },

    setSettings: (newSettings) => {
        set({settings: newSettings})
    }
}))

export default useSettingStore;
