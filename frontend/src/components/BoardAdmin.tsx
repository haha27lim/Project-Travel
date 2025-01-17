import React from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Button, Table } from "antd";
import "../styles/components/BoardAdmin.css";

const { Title } = Typography;

export const BoardAdmin: React.FC = () => {
  const navigate = useNavigate();

  const adminFunctions = [
    {
      key: "users",
      function: "View and manage user accounts",
      action: (
        <Button type="primary" onClick={() => navigate("/admin/users")}>
          Manage Users
        </Button>
      ),
    },
    {
      key: "trips",
      function: "Manage users' travel plans and itineraries",
      action: (
        <Button type="primary" onClick={() => navigate("/admin/trips")}>
          Travel Management Dashboard
        </Button>
      ),
    },
  ];

  const columns = [
    {
      title: "Functions",
      dataIndex: "function",
      key: "function",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
  ];

  return (
    <div className="admin-dashboard">
      <div className="container">
        <Title level={2} className="text-center mb-4">
          Admin Board
        </Title>
        <div className="functions-table">
          <Table
            columns={columns}
            dataSource={adminFunctions}
            pagination={false}
            bordered
          />
        </div>
      </div>
    </div>
  );
};

export default BoardAdmin;
