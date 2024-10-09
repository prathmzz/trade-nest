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
      <GoogleOAuthProvider clientId="340332118319-acgt2fhhn525e9f7hfqj6pqccg548scd.apps.googleusercontent.com">
        <Form onSubmit={loginUser}>
          <Row
            style={{
              height: "100vh",
              justifyContent: "center",
              alignItems: "center", // Center vertically
              padding: "20px", // Add padding for better spacing
            }}
          >
            <Col xs={12} md={6} lg={4}> {/* Adjusted the column size for responsiveness */}
              <Stack gap={3} className="border p-4 rounded shadow"> {/* Added border, padding, and shadow for better visuals */}
                <h2 className="text-center">Login</h2> {/* Centered the title */}

                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  onChange={(e) =>
                    updateLoginInfo({ ...loginInfo, email: e.target.value })
                  }
                />
                <Form.Control
                  type="password"
                  placeholder="Enter your Password"
                  onChange={(e) =>
                    updateLoginInfo({
                      ...loginInfo,
                      password: e.target.value,
                    })
                  }
                />

                <Button variant="primary" type="submit">
                  {isLoginLoading ? "Getting you in.." : "Login"}
                </Button>

                {/* Google Login Button */}
                <div style={{ textAlign: "center" }}>
                  <GoogleLogin
                    onSuccess={(credentialResponse) => {
                      console.log(credentialResponse);
                      handleGoogleSuccess(credentialResponse);
                    }}
                    onError={() => {
                      console.log('Login Failed');
                      handleGoogleFailure();
                    }}
                  />
                </div>

                {loginError && (
                  <Alert variant="danger" className="text-center">
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
