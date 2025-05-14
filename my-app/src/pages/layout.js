/* src/layout.js */
import React, { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, theme } from "antd";
import Aside from "../components/aside";
import MyHeader from "../components/header";
import { RouterAuth } from "../router/routerAuth";
import MyTag from "../components/tag";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const { Content } = Layout;

const MyLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const Collapsed = useSelector((state) => state.tab.isCollapse);
  return (
    <RouterAuth>
      <Layout className="main-container">
        <Aside collapsed={collapsed} Collapsed={Collapsed} />
        <Layout>
          <MyHeader
            collapsed={collapsed}
            Collapsed={Collapsed}
            setCollapsed={setCollapsed}
          />
          <MyTag></MyTag>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </RouterAuth>
  );
};
export default MyLayout;
