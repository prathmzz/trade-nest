import React, { useContext } from "react";
import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const {
    loginUser,
    loginError,
    loginInfo,
    updateLoginInfo,
    isLoginLoading,
  } = useContext(AuthContext);

  // Handle Google login success
  const handleGoogleSuccess = (response) => {
    console.log("Google Login Success:", response);
    // Pass the Google login data to your backend or AuthContext for further processing
  };

  // Handle Google login failure
  const handleGoogleFailure = (error) => {
    console.error("Google Login Error:", error);
  };

  return (
    <>
      {/* Add GoogleOAuthProvider to wrap your component */}
      <GoogleOAuthProvider clientId="93647705340-bko11uahe7ni12t51i2skassuaemqvad.apps.googleusercontent.com">
        <Form onSubmit={loginUser}>
          <Row
            style={{
              height: "100vh",
              justifyContent: "center",
              paddingTop: "10%",
            }}
          >
            <Col xs={6}>
              <Stack gap={3}>
                <h2>Login</h2>

                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  onChange={(e) =>
                    updateLoginInfo({ ...loginInfo, email: e.target.value })
                  }
                ></Form.Control>
                <Form.Control
                  type="password"
                  placeholder="Enter your Password"
                  onChange={(e) =>
                    updateLoginInfo({
                      ...loginInfo,
                      password: e.target.value,
                    })
                  }
                ></Form.Control>

                <Button variant="primary" type="submit">
                  {isLoginLoading ? "Getting you in.." : "Login"}
                </Button>

                {/* Google Login Button */}
                <div style={{ textAlign: "center" }}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleFailure}
                  />
                </div>

                {loginError && (
                  <Alert variant="danger">
                    <p>{loginError?.message}</p>
                  </Alert>
                )}
              </Stack>
            </Col>
          </Row>
        </Form>
      </GoogleOAuthProvider>
    </>
  );
};

export default Login;
