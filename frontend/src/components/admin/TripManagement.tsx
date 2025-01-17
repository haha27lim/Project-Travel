import React, { useState, useEffect } from "react";
import { Typography, Table, Button, Space, Form, Modal, Input, DatePicker, message } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import UserService from "../../services/user.service";
import { Trip } from "../../types/trip.type";
import moment from "moment";

const { Title } = Typography;

export const TripManagement: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const response = await UserService.getAdminTrips();
      setTrips(response.data);
    } catch (error) {
      message.error("Failed to fetch trips");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await UserService.deleteAdminTrip(id);
      message.success("Trip deleted successfully");
      fetchTrips();
    } catch (error) {
      message.error("Failed to delete trip");
    }
  };

  const handleEdit = (trip: Trip) => {
    setEditingTrip(trip);
    form.setFieldsValue({
      ...trip,
      startDate: moment(trip.startDate),
      endDate: moment(trip.endDate),
    });
    setModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingTrip) {
        await UserService.updateAdminTrip(editingTrip.id, {
          ...values,
          startDate: values.startDate.format("YYYY-MM-DD"),
          endDate: values.endDate.format("YYYY-MM-DD"),
        });
        message.success("Trip updated successfully");
      } else {
        await UserService.createAdminTrip({
          ...values,
          startDate: values.startDate.format("YYYY-MM-DD"),
          endDate: values.endDate.format("YYYY-MM-DD"),
        });
        message.success("Trip created successfully");
      }
      setModalVisible(false);
      form.resetFields();
      setEditingTrip(null);
      fetchTrips();
    } catch (error) {
      message.error("Operation failed");
    }
  };

  const columns = [
    {
      title: "Destination",
      dataIndex: "destination",
      key: "destination",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date: string) => moment(date).format("YYYY-MM-DD"),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date: string) => moment(date).format("YYYY-MM-DD"),
    },
    {
      title: "User",
      dataIndex: ["user", "username"],
      key: "user",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Trip) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-dashboard">
      <Title level={2} className="admin-title">
        Travel Management Dashboard
      </Title>

      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-value">{trips.length}</div>
          <div className="stat-label">Total Trips</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {trips.filter(trip => moment(trip.startDate).isAfter(moment())).length}
          </div>
          <div className="stat-label">Upcoming Trips</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {new Set(trips.map(trip => trip.user?.username)).size}
          </div>
          <div className="stat-label">Active Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {new Set(trips.map(trip => trip.destination)).size}
          </div>
          <div className="stat-label">Unique Destinations</div>
        </div>
      </div>

      <div className="table-actions">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingTrip(null);
            form.resetFields();
            setModalVisible(true);
          }}
        >
          Add New Trip
        </Button>
      </div>

      <div className="table-container">
        <Table
          columns={columns}
          dataSource={trips}
          rowKey="id"
          loading={loading}
        />
      </div>

      <Modal
        title={editingTrip ? "Edit Trip" : "Add New Trip"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingTrip(null);
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="destination"
            label="Destination"
            rules={[{ required: true, message: "Please input destination!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="startDate"
            label="Start Date"
            rules={[{ required: true, message: "Please select start date!" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="End Date"
            rules={[{ required: true, message: "Please select end date!" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="notes"
            label="Notes"
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item style={{ textAlign: "right" }}>
            <Space>
              <Button onClick={() => {
                setModalVisible(false);
                form.resetFields();
                setEditingTrip(null);
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingTrip ? "Update" : "Create"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}; 