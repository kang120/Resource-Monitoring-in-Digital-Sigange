import { useNavigate } from "react-router-dom";
import useSettingStore from "../../stores/SettingsStore"

const DeleteUserForm = ({ actionUser }) => {
    const { settings } = useSettingStore();

    const navigate = useNavigate();

    const deleteUser = async () => {
        navigate(0);
        window.localStorage.setItem('visited', false)
        window.localStorage.setItem('alert_message_type', 'success')
        window.localStorage.setItem('alert_message', 'Successfully delete user ' + actionUser['username'])

        const url = settings['api'][`${process.env.NODE_ENV}_base_url`] + settings['api']['deleteUser']

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Type': 'application/json'
            },
            body: JSON.stringify({
                user: {
                    user_id: actionUser['id'],
                }
            })
        })
    }

    return (
        <div id='delete-modal' class="modal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Delete user</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>Are you sure to delete user <strong>{actionUser['username']}</strong>?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal" onClick={deleteUser}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeleteUserForm;
