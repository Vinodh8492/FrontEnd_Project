import React, { useState } from 'react';
import styles from './Login.module.css';
import { loginUser } from '../../Apis/user';
import eyeClosed from '../../Assets/EyeClose.png';
import eyeOpen from '../../Assets/EyeOpen.jpeg';

function Login() {
    const [formData, setFormData] = useState({ Username: '', Password: '' });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [message, setMessage] = useState('');


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
            setMessage("Fields can't be empty");
            return;
        }

        try {
            const response = await loginUser({ ...formData });

            if (response?.token) {
                localStorage.setItem("token", response.token);
                console.log("Token :", response.token);
                localStorage.setItem("name", response.name);
                console.log("Name :", response.name);
                alert(response.message);


            } else {
               
                console.error("Invalid Credentials:", response);
                setMessage("Invalid Credentials");
            }
        } catch (error) {
           
            console.error("Error during login:", error);
            setMessage("An error occurred during login");
        }


    };

    return (
        <div>
            <h1 className={styles.head}>Login To Swip Tory</h1>
            <form className={styles.form}>
                <div className={styles.username}>
                    <span className={styles.text}> Username </span>
                    <input
                        className={styles.input1}
                        type="text"
                        placeholder="Enter Username"
                        name="Username"
                        value={formData.Username}
                        onChange={handleChange}
                    />
                </div>
                <br />

                <div className={styles.password}>
                    <span className={styles.text}> Password </span>

                    <input
                        className={styles.input2}
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
            {message && <div className={styles.message}>{message}</div>}
            <div className={styles.container}>
                <button className={styles.button} onClick={handleSubmit}>Login</button>
            </div>
        </div>
    );
}

export default Login;
