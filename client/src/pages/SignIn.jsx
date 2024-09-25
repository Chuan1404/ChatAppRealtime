import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBRow,
  MDBValidation,
  MDBValidationItem,
} from "mdb-react-ui-kit";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/AuthService";

function SignIn() {
  const navaigator = useNavigate()
  const [formValue, setFormValue] = useState({
    email: "",
    password: "",
  });

  const onChangeForm = (e) => {
    setFormValue({
      ...formValue,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const response = await authService.signIn(formValue)

    if(!response.error) {
      localStorage.setItem('token', JSON.stringify(response.data))
      return navaigator('/')
    }
    else {
      alert(response.error)
    }
  };
  return (
    <MDBContainer fluid>
      <MDBRow className="d-flex justify-content-center align-items-center h-100">
        <MDBCol col="12">
          <MDBCard
            className="bg-white my-5 mx-auto"
            style={{ borderRadius: "1rem", maxWidth: "500px" }}
          >
            <MDBCardBody className="p-5 w-100 d-flex flex-column">
              <h2 className="fw-bold mb-2 text-center">Sign in</h2>
              <p className="text-white-50 mb-3">
                Please enter your login and password!
              </p>

              <MDBValidation>
                <MDBValidationItem>
                  <MDBInput
                    wrapperClass="mb-4 w-100"
                    label="Email address"
                    id="formControlLg"
                    type="email"
                    required
                    size="lg"
                    value={formValue.email}
                    name="email"
                    onChange={onChangeForm}
                  />
                </MDBValidationItem>
                <MDBValidationItem>
                  <MDBInput
                    wrapperClass="mb-4 w-100"
                    label="Password"
                    id="formControlLg"
                    value={formValue.password}
                    required
                    type="password"
                    name="password"
                    size="lg"
                    onChange={onChangeForm}
                  />
                </MDBValidationItem>
                
                <MDBBtn type="submit" className="w-100" onClick={handleSubmit}>
                  Login
                </MDBBtn>
              </MDBValidation>

              <hr className="my-4" />

              <MDBBtn
                className="mb-2 w-100"
                size="lg"
                style={{ backgroundColor: "#dd4b39" }}
              >
                <MDBIcon fab icon="google" className="mx-2" />
                Sign in with google
              </MDBBtn>

              <MDBBtn
                className="mb-4 w-100"
                size="lg"
                style={{ backgroundColor: "#3b5998" }}
              >
                <MDBIcon fab icon="facebook-f" className="mx-2" />
                Sign in with facebook
              </MDBBtn>
              <div>
                <p className="mb-0">
                  Don't have an account?{" "}
                  <Link to="/sign-up" className="text-black-50 fw-bold">
                    Sign Up
                  </Link>
                </p>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default SignIn;
