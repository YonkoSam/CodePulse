import React, { useState } from 'react';
import axios from 'axios';

const SuspendedUserNotification = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/contact-admin', { email, message });
            setStatus('Email sent successfully');
        } catch (error) {
            setStatus('Failed to send email');
        }
    };

    return (
        <div>
            <h2>Your account has been suspended</h2>
            <p>Please contact the admin to resolve this issue.</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    required
                />
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your message"
                    required
                />
                <button type="submit">Send</button>
            </form>
            {status && <p>{status}</p>}
        </div>
    );
};

export default SuspendedUserNotification;
