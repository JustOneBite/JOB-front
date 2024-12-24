'use client';

import { useState } from 'react';




const TeacherLogin = () => {
    const [formData, setFormData] = useState({
        userId: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        try {
            const response = await fetch('http://localhost:8080/teacher/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include', // 세션 방식을 사용할 때 쿠키를 포함
            });

            if (response.ok) {
                const result = await response.json();
                setSuccessMessage('Login successful!');
                setIsLoggedIn(true)
                console.log('Login Result:', result); // 필요하면 세부 데이터를 확인
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            console.log(err)
            setError('An error occurred while logging in. Please try again.');
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:8080/teacher/logout', {
                method: 'POST',
                credentials: 'include', // 쿠키를 포함하여 요청 보내기
            });

            if (response.ok) {
                setSuccessMessage('Logout successful!');
                setIsLoggedIn(false);  // 로그아웃 시 상태 변경
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Logout failed. Please try again.');
            }
        } catch (error) {
            setError('An error occurred during logout.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto' }}>
            <h1>Teacher Login</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

            
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="userId">User ID:</label>
                        <input
                            type="text"
                            id="userId"
                            name="userId"
                            value={formData.userId}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
                <div>
                    <button onClick={handleLogout} style={{ display: isLoggedIn ? 'block' : 'none' }}>
                        Logout
                    </button>
                </div>
        </div>
    );
};

export default TeacherLogin;