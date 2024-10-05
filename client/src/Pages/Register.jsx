import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const { registerInfo, updateRegisterInfo, registerUser, registerError, isRegisterLoading } = useContext(AuthContext);
  const [otp, setOtp] = useState(new Array(6).fill("")); // To hold OTP digits
  const [otpSent, setOtpSent] = useState(false); // Flag to track OTP state
  const [email, setEmail] = useState(""); // State to track the entered email

  const handleOtpChange = (element, index) => {
    let otpArray = [...otp];
    otpArray[index] = element.value;
    setOtp(otpArray);
  };

  // Function to handle sending OTP to the given email
  const handleGetOtp = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }), // Send the entered email to backend
      });

      const data = await response.json();
      if (data.success) {
        setOtpSent(true);
        alert("OTP sent to your email"); // Notify the user about OTP status
      } else {
        alert("Failed to send OTP"); // Error alert
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("An error occurred while sending OTP"); // Catch and display any network or server errors
    }
  };

  // Function to handle OTP submission for verification
  const handleSubmitOtp = async () => {
    const otpString = otp.join(""); // Concatenate OTP digits

    try {
      const response = await fetch("http://localhost:5000/api/users/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpString }), // Send OTP and email to backend
      });

      const data = await response.json();
      if (data.success) {
        alert("OTP verified successfully");
      } else {
        alert("Invalid OTP or OTP expired");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("An error occurred while verifying OTP");
    }
  };

  return (
    <>
      <Form onSubmit={registerUser}>
        <Row
          style={{
            height: "100vh",
            justifyContent: "center",
            paddingTop: "10%",
          }}
        >
          <Col xs={6}>
            <Stack gap={3}>
              <h2>Register</h2>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                onChange={(e) =>
                  updateRegisterInfo({ ...registerInfo, name: e.target.value })
                }
              ></Form.Control>

              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  updateRegisterInfo({ ...registerInfo, email: e.target.value });
                }}
              ></Form.Control>

              <h5>Enter OTP</h5>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex">
                  {otp.map((data, index) => (
                    <Form.Control
                      key={index}
                      type="text"
                      maxLength="1"
                      value={data}
                      onChange={(e) => handleOtpChange(e.target, index)}
                      style={{
                        width: "50px",
                        textAlign: "center",
                        marginRight: "5px", // Adjust margin to bring OTP boxes closer
                      }}
                    />
                  ))}
                </div>

                <div className="d-flex" style={{ marginLeft: "10px" }}>
                  <Button 
                    variant="secondary" 
                    onClick={handleGetOtp} 
                    style={{ marginRight: "5px" }} // Adjust margin to bring buttons closer
                  >
                    Get OTP
                  </Button>

                  <Button 
                    variant="primary" 
                    onClick={handleSubmitOtp}
                  >
                    Submit OTP
                  </Button>
                </div>
              </div>

              <Form.Control
                type="password"
                placeholder="Enter your Password"
                onChange={(e) =>
                  updateRegisterInfo({
                    ...registerInfo,
                    password: e.target.value,
                  })
                }
              ></Form.Control>

              <Button variant="primary" type="submit">
                {isRegisterLoading ? "Creating your account " : "Register"}
              </Button>

              {registerError?.error && (
                <Alert variant="danger">
                  <p>{registerError?.message}</p>
                </Alert>
              )}
            </Stack>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default Register;
