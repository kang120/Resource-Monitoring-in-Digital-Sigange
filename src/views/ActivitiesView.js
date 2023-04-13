import { useEffect, useState } from "react";
import Header from "../components/Header";
import useSettingStore from "../stores/SettingsStore";
import ActivitiesTable from "../components/ActivitiesTable";

const ActivitiesView = () => {
    const [isLoading, setLoading] = useState(true)
    const { settings } = useSettingStore()

    const [activities, setActivities] = useState([])

    useEffect(() => {
        const fetchUserActivities = async () => {
            const url = settings['api']['base_url'] + settings['api']['getUserActivities']

            const res = await fetch(url)

            const data = await res.json()

            setActivities(data.data)

            setLoading(false)
        }

        fetchUserActivities()
    }, [])

    return (
        <div>
            <Header />

            <div className="page-body">
                <h2 className="mb-5">Activities Data</h2>

                {
                    isLoading ?
                        <div className="loading-text d-flex align-items-center">
                            <div class="spinner-border text-dark me-5" style={{ width: '5rem', height: '5rem'}} role="status">
                                <span class="visually-hidden">Loading Data...</span>
                            </div>
                            Loading Data
                        </div> :
                        <ActivitiesTable activities={activities} />
                }
            </div>
        </div>
    )
}

export default ActivitiesView;
