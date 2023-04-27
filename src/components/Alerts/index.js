import { useEffect, useState } from "react";

const Alerts = () => {
    const [visited, setVisited] = useState(window.localStorage.getItem('visited') || 'false')
    const [alertMessage, setAlertMessage] = useState(window.localStorage.getItem('alert_message') || '')
    const [alertMessageType, setAlertMessageType] = useState(window.localStorage.getItem('alert_message_type') || '')

    useEffect(() => {
        window.localStorage.setItem('visited', true)
        window.localStorage.setItem('alert_message', '')
        window.localStorage.setItem('alertMessageType', '')
    }, [])

    return (
        <>
            {
                (alertMessage != '' && visited == 'false') ?
                    <div className={`alert alert-${alertMessageType} mb-4`} role="alert">
                        {alertMessage}
                    </div> :
                    null
            }
        </>
    )
}

export default Alerts;
