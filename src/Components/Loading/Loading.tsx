import { Typography, Spin } from "antd";
import { Content } from "antd/es/layout/layout";
import cheeslogo from '../../Components/Loading/cheeslogo.jpg';

const Loading = () => {
  return (
    <Content
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <img
        src={cheeslogo}
        alt=""
        style={{
          width: "100%",
          height: "100vh",
          objectFit: "cover",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 1,
        }}
      >
        <Spin size="large" />
        <Typography style={{ marginTop: "25px", color: "white" }}>
          Loading ...
        </Typography>
      </div>
    </Content>
  );
};

export default Loading;
