import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/components/ForgotPassword.css';

const ForgotPassword: React.FC = () => {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: { email: string }) => {
        setLoading(true);
        try {
            console.log('Sending reset request to:', `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`);
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
                null,
                {
                    params: { email: values.email },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            console.log('Reset request response:', response);
            message.success(response.data.message || 'If an account exists with this email, a password reset link will be sent.');
        } catch (error: any) {
            console.error('Reset request error:', error);
            if (error.response) {
                console.error('Error response:', error.response);
                message.error(error.response.data?.message || 'An error occurred. Please try again later.');
            } else if (error.request) {
                console.error('Error request:', error.request);
                message.error('Could not connect to the server. Please try again later.');
            } else {
                console.error('Error message:', error.message);
                message.error('An unexpected error occurred. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-form">
                <h2>Forgot Password</h2>
                <p>Enter your email address and we'll send you a link to reset your password.</p>
                
                <Form
                    name="forgot-password"
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input 
                            prefix={<MailOutlined />} 
                            placeholder="Email" 
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            loading={loading}
                            block
                            size="large"
                        >
                            Send Reset Link
                        </Button>
                    </Form.Item>

                    <div className="form-footer">
                        <Link to="/login">Back to Login</Link>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default ForgotPassword; 