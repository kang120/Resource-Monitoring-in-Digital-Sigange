import create from 'zustand'

const useReportStore = create((set) => ({
    monthlyReport: [],
    weeklyReport: [],

    setMonthlyReport: (report) => {
        set({monthlyReport: report})
    },
    setWeeklyReport: (report) => {
        set({weeklyReport: report})
    }
}))

export default useReportStore;
