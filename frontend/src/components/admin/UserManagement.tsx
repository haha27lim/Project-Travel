import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Modal, Form, Input, Select } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import UserService from '../../services/user.service';

const { Option } = Select;

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    let mounted = true;

    const loadUsers = async () => {
      setLoading(true);
      try {
        const response = await UserService.getAllUsers();
        if (mounted) {
          console.log('Users response:', response);
          setUsers(response.data);
        }
      } catch (error: any) {
        if (mounted) {
          console.error('Error fetching users:', error);
          message.error(error.response?.data?.message || 'Failed to fetch users');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      mounted = false;
    };
  }, []);

  const handleDeleteUser = async (userId: number) => {
    try {
      await UserService.deleteUser(userId);
      message.success('User deleted successfully');
      const response = await UserService.getAllUsers();
      setUsers(response.data);
    } catch (error: any) {
      console.error('Error deleting user:', error);
      message.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleUpdateUser = async (values: any) => {
    try {
      const updateData = {
        username: values.username,
        email: values.email,
        role: values.roles ? [values.roles] : ['user'],
        password: values.password || ''
      };

      await UserService.updateUser(editingUser.id, updateData);
      message.success('User updated successfully');
      const response = await UserService.getAllUsers();
      setUsers(response.data);
      setModalVisible(false);
      setEditingUser(null);
      form.resetFields();
    } catch (error: any) {
      console.error('Error updating user:', error);
      message.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  const showUpdateModal = (user: any) => {
    setEditingUser(user);
    form.setFieldsValue({
      username: user.username,
      email: user.email,
      roles: user.roles[0]?.name.replace('ROLE_', '').toLowerCase(),
      password: '',
      confirmPassword: ''
    });
    setModalVisible(true);
  };

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: any[]) => roles?.map(role => role.name).join(', ') || 'No roles',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showUpdateModal(record)}
          >
            Update
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteUser(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="container mt-4">
      <h2>User Management</h2>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title="Update User"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingUser(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateUser}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please input username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="New Password"
            rules={[
              {
                min: 6,
                message: 'Password must be at least 6 characters!'
              }
            ]}
            tooltip="Leave blank to keep current password"
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={['password']}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || !getFieldValue('password')) {
                    return Promise.resolve();
                  }
                  if (value === getFieldValue('password')) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
            tooltip="Leave blank to keep current password"
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="roles"
            label="Role"
          >
            <Select>
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>
          <Form.Item style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setModalVisible(false);
                setEditingUser(null);
                form.resetFields();
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}; 