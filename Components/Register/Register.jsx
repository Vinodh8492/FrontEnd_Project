import React, { useState } from 'react';
import styles from './Register.module.css';
import { registerUser } from '../../Apis/user';
import eyeClosed from '../../Assets/EyeClose.png';
import eyeOpen from '../../Assets/EyeOpen.jpeg';
import Cut from '../../Assets/Cut.svg'


function Login() {
    const [formData, setFormData] = useState({ Username: '', Password: '' });
    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleSubmit = async () => {
        if (!formData.Password || !formData.Username) {
            alert("Fields can't be empty");
            return;
        }

        const response = await registerUser({ ...formData });
        alert(response.message);

    };

    return (
        <div>

            <h1 className={styles.head} >Register To Swip Tory</h1> <br />
            <form className={styles.form} >
                <div className={styles.username} >
                    <span className={styles.text} > Username </span>
                    <input className={styles.input1}
                        type="text"
                        placeholder="Enter Username"
                        name="Username"
                        value={formData.Username}
                        onChange={handleChange}
                    />
                </div>
                <br />

                <div className={styles.password}>
                    <span className={styles.text} > Password </span>

                    <input className={styles.input2}
                        type={passwordVisible ? 'text' : 'password'}
                        placeholder="Enter Password"
                        name="Password"
                        value={formData.Password}
                        onChange={handleChange}
                    />
                    <img
                        src={passwordVisible ? eyeOpen : eyeClosed}
                        alt="Toggle password visibility"
                        className={styles.eyeIcon}
                        onClick={togglePasswordVisibility}
                    />
                </div>
                <br />
            </form>
            <div className={styles.container} >
                <button className={styles.button} onClick={handleSubmit}>Register</button>
            </div>
        </div>
    );
}

export default Login;