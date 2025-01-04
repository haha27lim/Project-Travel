import { useEffect, useState } from "react";
import UserService from "../services/user.service";
import { Trip } from "../types/trip.type";
import { Table, Button, Modal, Form, Input, DatePicker, Space, Card, Row, Col, Statistic, message,Typography } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";

const { Title } = Typography;

export const BoardAdmin: React.FC = () => {
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
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: "32px" }}>
        Travel Management Dashboard
      </Title>
      
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Trips"
              value={trips.length}
              prefix={<i className="fas fa-plane" />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Active Trips"
              value={trips.filter(trip => 
                moment(trip.endDate).isAfter(moment())
              ).length}
              prefix={<i className="fas fa-calendar-check" />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Users with Trips"
              value={new Set(trips.map(trip => trip.user.username)).size}
              prefix={<i className="fas fa-users" />}
            />
          </Card>
        </Col>
      </Row>

      <div style={{ 
        marginTop: "24px", 
        marginBottom: "16px",
        display: "flex",
        justifyContent: "center"
      }}>
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

      <div style={{ display: "flex", justifyContent: "center" }}>
        <Table
          columns={columns}
          dataSource={trips}
          rowKey="id"
          loading={loading}
          style={{ width: "100%" }}
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
          <Form.Item style={{ textAlign: "center" }}>
            <Button type="primary" htmlType="submit">
              {editingTrip ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BoardAdmin;
