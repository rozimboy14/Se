import { Component } from "react";
import { Box, Typography, Button } from "@mui/material";
import Lottie from "lottie-react";
import errorAnimation from "../public/images/Animation - 1733980208810.json";
import PropTypes from "prop-types";
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Xatolik yuz berdi:", error);
    console.error("Xatolik haqida qo‘shimcha ma‘lumot:", errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            bgcolor: "#fefefe",
            p: 2,
          }}
        >
          <Lottie
            animationData={errorAnimation}
            loop={true}
            style={{ width: "300px", height: "300px" }}
          />
          <Typography variant="h3" color="error" gutterBottom>
            Что-то пошло не так!
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Произошла непредвиденная ошибка. Попробуйте обновить страницу.
          </Typography>
          <Button variant="contained" onClick={this.handleReload}>
            Обновить страницу
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};
export default ErrorBoundary;
