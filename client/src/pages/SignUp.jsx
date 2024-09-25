import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBInput,
  MDBRow,
  MDBValidation,
  MDBValidationItem,
} from "mdb-react-ui-kit";
import React, { useRef, useState } from "react";
import authService from "../services/AuthService";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const navaigator = useNavigate()
  const [formValue, setFormValue] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });
  const [file, setFile] = useState(null);
  const fileInput = useRef(null);
  const onChangeForm = (e) => {
    setFormValue({
      ...formValue,
      [e.target.name]: e.target.value,
    });
  };

  const onFileChange = (e) => {
    setFile(e.target.value);
  };

  const handleSubmit = async () => {
    let formData = new FormData();

    for (var key in formValue) {
      formData.append(key, formValue[key]);
    }

    if (fileInput.current.files) {
      formData.append("avatar", fileInput.current.files[0]);
    }
    const response = await authService.signUp(formData);

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
              <h2 className="fw-bold mb-2 text-center">SignUp</h2>
              <p className="text-white-50 mb-3">
                Please enter your login and password!
              </p>

              <MDBValidation className="row g-3">
                <MDBValidationItem className="col-md-12">
                  <MDBInput
                    label="Email address"
                    type="email"
                    required
                    size="lg"
                    value={formValue.email}
                    name="email"
                    onChange={onChangeForm}
                  />
                </MDBValidationItem>
                <MDBValidationItem className="col-md-12">
                  <MDBInput
                    label="Name"
                    type="name"
                    required
                    size="lg"
                    value={formValue.name}
                    name="name"
                    onChange={onChangeForm}
                  />
                </MDBValidationItem>
                <MDBValidationItem className="col-md-12">
                  <MDBInput
                    label="Password"
                    value={formValue.password}
                    required
                    type="password"
                    name="password"
                    size="lg"
                    onChange={onChangeForm}
                  />
                </MDBValidationItem>
                <MDBValidationItem className="col-md-12">
                  <MDBInput
                    label="Confirm password"
                    value={formValue.confirmPassword}
                    required
                    type="password"
                    name="confirmPassword"
                    size="lg"
                    onChange={onChangeForm}
                  />
                </MDBValidationItem>
                <MDBValidationItem className="col-md-12">
                  <input
                    type="file"
                    className="form-control"
                    required
                    onChange={onFileChange}
                    ref={fileInput}
                  />
                </MDBValidationItem>
                <MDBBtn type="submit" className="w-100" onClick={handleSubmit}>
                  SignUp
                </MDBBtn>
              </MDBValidation>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default SignUp;
