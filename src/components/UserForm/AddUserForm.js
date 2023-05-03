import { useEffect, useState } from "react";
import './index.css'
import useSettingStore from "../../stores/SettingsStore";

const AddUserForm = ({ userType, users }) => {
    const { settings } = useSettingStore();

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')

    const [usernameError, setUsernameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [password2Error, setPassword2Error] = useState('')

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const insertNewUser = async () => {
        const url = settings['api'][`${process.env.NODE_ENV}_base_url`] + settings['api']['addUser']
        console.log(url)

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Type': 'application/json'
            },
            body: JSON.stringify({
                user: {
                    username: username,
                    email: email,
                    password: password,
                    userType: userType
                }
            })
        })

        const data = await res.json();

        if (data.message == 'Success') {
            console.log('added user successfully')
            window.localStorage.setItem('visited', false)
            window.localStorage.setItem('alert_message_type', 'success')
            window.localStorage.setItem('alert_message', 'Successfully added user')
        }
    }

    const submitForm = () => {
        let submitFlag = true;
        let userExist = false;
        let emailExist = false;

        users['admin'].forEach(user => {
            if (user['username'] == username) {
                userExist = true
            }

            if (user['email'] == email) {
                emailExist = true
            }
        })

        users['user'].forEach(user => {
            if (user['username'] == username) {
                userExist = true
            }

            if (user['email'] == email) {
                emailExist = true
            }
        })

        if (username == '') {
            setUsernameError('Please fill in this field')
            submitFlag = false;
        } else if (username.length < 8 || username.length > 20) {
            setUsernameError('Username length must between 8 and 20')
            submitFlag = false;
        } else if (userExist) {
            setUsernameError('Username exists')
            submitFlag = false;
        } else {
            setUsernameError('')
        }

        if (email == '') {
            setEmailError('Please fill in this field')
            submitFlag = false;
        } else if (!validateEmail(email)) {
            setEmailError('Please fill in valid email')
            submitFlag = false;
        } else if (emailExist) {
            setEmailError('Email exist')
            submitFlag = false;
        } else {
            setEmailError('')
        }

        if (password == '') {
            setPasswordError('Please fill in this field')
            submitFlag = false;
        } else if (password.length < 8 || password.length > 12) {
            setPasswordError('Username length must between 8 and 12')
            submitFlag = false;
        } else {
            setPasswordError('')
        }

        if (password2 == '') {
            setPassword2Error('Please fill in this field')
            submitFlag = false;
        } else if (password2 != password) {
            setPassword2Error('Please fill in same password')
            submitFlag = false;
        } else {
            setPassword2Error('')
        }

        if (submitFlag) {
            document.getElementById("add-submit-btn").click();
            insertNewUser();
        }
    }

    useEffect(() => {
        const forms = document.querySelectorAll('.needs-validation')

        // Loop over them and prevent submission
        Array.from(forms).forEach(form => {
            form.addEventListener('submit', event => {
                if (!form.checkValidity() || usernameError != '' || emailError != '' || passwordError != '' || password2Error != '') {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
    }, [])

    return (
        <div class="modal fade" id="add-modal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Add New {userType.charAt(0).toUpperCase() + userType.slice(1)}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id='add-form' class="needs-validation" noValidate>
                            <div class="mb-3">
                                <label for="add-username" class="form-label">Username</label>
                                <input type="text" class={`form-control ${usernameError != '' ? 'is-invalid' : ''}`} id="add-username" placeholder="username"
                                    onChange={(e) => setUsername(e.target.value)} value={username} required />
                                <div class="invalid-feedback">
                                    {usernameError}
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="add-email" class="form-label">Email</label>
                                <input type="email" class={`form-control ${emailError != '' ? 'is-invalid' : ''}`} id="add-email" placeholder="email@gmail.com"
                                    onChange={(e) => setEmail(e.target.value)} value={email} required />
                                <div class="invalid-feedback">
                                    {emailError}
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="add-password" class="form-label">Password</label>
                                <input type="password" class={`form-control ${passwordError != '' ? 'is-invalid' : ''}`} id="add-password" placeholder="password"
                                    onChange={(e) => setPassword(e.target.value)} value={password} required />
                                <div class="invalid-feedback">
                                    {passwordError}
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="add-password2" class="form-label">Confirmed Password</label>
                                <input type="password" class={`form-control ${password2Error != '' ? 'is-invalid' : ''}`} id="add-password2" placeholder="confirmed password"
                                    onChange={(e) => setPassword2(e.target.value)} value={password2} required />
                                <div class="invalid-feedback">
                                    {password2Error}
                                </div>
                            </div>

                            <button id='add-submit-btn' class="btn btn-primary d-none" type="submit">Submit form</button>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onClick={submitForm}>Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddUserForm;
