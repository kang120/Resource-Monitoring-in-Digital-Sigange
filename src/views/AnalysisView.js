import { useLocation, useNavigate } from "react-router-dom";
import Alerts from "../components/Alerts";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import PageNotFoundView from "./PageNotFoundView";
import AnalysisTable from "../components/AnalysisTable";

const AnalysisView = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [analysisData, setAnalysisData] = useState([]);
    const [analysisNumericData, setAnalysisNumericData] = useState([]);
    const [analysisMetric, setAnalysisMetric] = useState([]);

    /*
        [
            {
                'Session Count': n,
                'Layout Management Preference': n,
                'View Only Preference': n,
                'Layout Management Spent Times': n
            }
        ]
    */

    useEffect(() => {
        if (location.state === undefined || location.state === null) {
            return;
        }

        const clusters = location.state.clusters;

        const analysisResult = clusters.map((c, index) => {
            return {
                'Cluster': index + 1,
                'Total User': c['total_user'],
                'Session Count': 'low',
                'Layout Management Preference': 'low',
                'View Only Preference': 'low',
                'Layout Management Spent Time': 'low'
            }
        })

        const analysisNumeticResult = clusters.map((c, index) => {
            return {
                'Cluster': index + 1,
                'Total User': c['total_user'],
                'Session Count': -1,
                'Layout Management Preference': -1,
                'View Only Preference': -1,
                'Layout Management Spent Time': -1
            }
        })

        const metric = []

        const sessionAnalysis = () => {
            let max = -1;
            let min = -1;

            clusters.forEach(c => {
                const session = c['average_login_session']

                if (max == -1 || session > max) {
                    max = session
                }

                if (min == -1 || session < min) {
                    min = session
                }
            });

            const range = Math.round(((max - min) / clusters.length) + min)

            /*
                range = 63

                0-63: low
                64-127: moderate
                128-191: high
            */

            clusters.forEach((c, index) => {
                const session = c['average_login_session']

                if (session <= range) {
                    analysisResult[index]['Session Count'] = 'low'
                } else if (session > range && session < range * 2 + 1) {
                    analysisResult[index]['Session Count'] = 'moderate'
                } else {
                    analysisResult[index]['Session Count'] = 'high'
                }

                analysisNumeticResult[index]['Session Count'] = session
            })

            metric.push({
                name: 'Session Count',
                low: `0 - ${range}`,
                moderate: `${range + 1} - ${range * 2 + 1}`,
                high: `${range * 2 + 2} - ${range * 3 + 2}`
            })
        }

        const layoutPreferenceAnalysis = () => {
            const preferences = [];

            let over50Count = 0;

            clusters.forEach((c, index) => {
                const layoutFrequency = c['average_layout_page_frequency']
                const sessionCount = c['average_login_session']

                if (sessionCount == 0) {
                    preferences.push(0)
                    analysisNumeticResult[index]['Layout Management Preference'] = '0%'

                    return
                }

                const preference = Math.round((layoutFrequency / sessionCount) * 100)

                if (preference >= 50) {
                    over50Count += 1
                }

                preferences.push(preference)

                analysisNumeticResult[index]['Layout Management Preference'] = preference + '%'
            })

            preferences.forEach((p, index) => {
                if (over50Count < 2) {
                    if (p <= 25) {
                        analysisResult[index]['Layout Management Preference'] = 'low'
                    } else if (p <= 50) {
                        analysisResult[index]['Layout Management Preference'] = 'moderate'
                    } else {
                        analysisResult[index]['Layout Management Preference'] = 'high'
                    }
                } else {
                    if (p <= 50) {
                        analysisResult[index]['Layout Management Preference'] = 'low'
                    } else if (p <= 70) {
                        analysisResult[index]['Layout Management Preference'] = 'moderate'
                    } else {
                        analysisResult[index]['Layout Management Preference'] = 'high'
                    }
                }
            })

            if (over50Count < 2) {
                metric.push({
                    name: 'Layout Management Preference',
                    low: '0% - 25%',
                    moderate: '26% - 50%',
                    high: '51% - 100%'
                })
            } else {
                metric.push({
                    name: 'Layout Management Preference',
                    low: '0% - 50%',
                    moderate: '51% - 75%',
                    high: '76% - 100%'
                })
            }
        }

        const viewOnlyPreferenceAnalysis = () => {
            const preferences = [];

            let over50Count = 0;

            clusters.forEach((c, index) => {
                const idleFrequency = c['average_idle_frequency']
                const sessionCount = c['average_login_session']

                if (sessionCount == 0) {
                    preferences.push(0)
                    analysisNumeticResult[index]['View Only Preference'] = '0%'

                    return
                }

                const preference = Math.round((idleFrequency / sessionCount) * 100)

                if (preference >= 50) {
                    over50Count += 1
                }

                preferences.push(preference)

                analysisNumeticResult[index]['View Only Preference'] = preference + '%'
            })

            preferences.forEach((p, index) => {
                if (over50Count < 2) {
                    if (p <= 25) {
                        analysisResult[index]['View Only Preference'] = 'low'
                    } else if (p <= 50) {
                        analysisResult[index]['View Only Preference'] = 'moderate'
                    } else {
                        analysisResult[index]['View Only Preference'] = 'high'
                    }
                } else {
                    if (p <= 50) {
                        analysisResult[index]['View Only Preference'] = 'low'
                    } else if (p <= 70) {
                        analysisResult[index]['View Only Preference'] = 'moderate'
                    } else {
                        analysisResult[index]['View Only Preference'] = 'high'
                    }
                }
            })

            if (over50Count < 2) {
                metric.push({
                    name: 'View Only Preference',
                    low: '0% - 25%',
                    moderate: '26% - 50%',
                    high: '51% - 100%'
                })
            } else {
                metric.push({
                    name: 'View Only Preference',
                    low: '0% - 50%',
                    moderate: '51% - 75%',
                    high: '76% - 100%'
                })
            }
        }

        const layoutManagementTimesAnalysis = () => {
            let max = -1;
            let min = -1;

            clusters.forEach(c => {
                const spentTimes = c['average_layout_spent_time']

                if (max == -1 || spentTimes > max) {
                    max = spentTimes
                }

                if (min == -1 || spentTimes < min) {
                    min = spentTimes
                }
            });

            const range = Math.round(((max - min) / clusters.length) + min)

            /*
                range = 63

                0-63: low
                64-127: moderate
                128-191: high
            */

            clusters.forEach((c, index) => {
                const spentTimes = c['average_layout_spent_time']

                if (spentTimes <= range) {
                    analysisResult[index]['Layout Management Spent Time'] = 'low'
                } else if (spentTimes > range && spentTimes < range * 2 + 1) {
                    analysisResult[index]['Layout Management Spent Time'] = 'moderate'
                } else {
                    analysisResult[index]['Layout Management Spent Time'] = 'high'
                }

                analysisNumeticResult[index]['Layout Management Spent Time'] = spentTimes + ' minutes'
            })

            metric.push({
                name: 'Layout Management Spent Time',
                low: `0min - ${range}min`,
                moderate: `${range + 1}min - ${range * 2 + 1}min`,
                high: `${range * 2 + 2}min - ${range * 3 + 2}min`
            })
        }

        sessionAnalysis();
        layoutPreferenceAnalysis();
        viewOnlyPreferenceAnalysis();
        layoutManagementTimesAnalysis();

        setAnalysisData([...analysisResult])
        setAnalysisNumericData([...analysisNumeticResult])
        setAnalysisMetric([...metric])

        console.log(clusters)
    }, [])

    if (location.state === undefined || location.state === null) {
        return <PageNotFoundView />
    }

    return (
        <div>
            <Header />

            <div className="page-body">
                <Alerts />

                <h2 className="mb-5">Cluster Analysis</h2>

                <AnalysisTable analysisData={analysisData} analysisNumericData={analysisNumericData} />

                <div className="mt-5 pt-3">
                    <h5>Metric</h5>
                    <div className="d-flex justify-content-around mt-4">
                        {
                            analysisMetric.map((metric, index) => (
                                <div key={index} className="text-center">
                                    <strong>{metric['name']}</strong>
                                    <div className="mt-3">{metric['low']}: low</div>
                                    <div>{metric['moderate']}: moderate</div>
                                    <div>{metric['high']}: high</div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AnalysisView;
