import {
  MDBBtn,
  MDBCheckbox,
  MDBInput,
  MDBModal,
  MDBModalBody,
  MDBModalContent,
  MDBModalDialog,
  MDBModalFooter,
  MDBModalHeader,
  MDBModalTitle,
  MDBValidation,
  MDBValidationItem,
} from "mdb-react-ui-kit";
import { useContext, useEffect, useRef, useState } from "react";
import userService from "../services/userService";
import { API } from "../constants";
import { AuthContext } from "../context/AuthProvider";
import chatService from "../services/chatService";

const initForm = {
  name: "",
};

const AddGroupPopup = ({ handleAddRoom = () => {} }) => {
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [userList, setUserList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [members, setMembers] = useState([]);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState(initForm);

  const fileInput = useRef(null);

  const { user } = useContext(AuthContext);

  const toggleOpen = () => {
    setIsOpenPopup(!isOpenPopup);
  };

  const handleChange = (e) => {
    if (e.target.checked) {
      setMembers([...members, e.target.value]);
    } else {
      let newMembers = members.filter((item) => item != e.target.value);
      setMembers(newMembers);
    }
  };

  const handleSubmit = async () => {
    let formData = new FormData();

    let body = {
      members: JSON.stringify([user._id, ...members]),
      name: form.name,
      type: 2,
    };

    if (
        form.name == "" ||
        file == null
      ) {
        alert("Trường bắt buộc nhập chưa có giá trị");
        return;
      }

      if (
        members.length == 0
      ) {
        alert("Phải có thành viên trong nhóm");
        return;
      }

    for (var key in body) {
      formData.append(key, body[key]);
    }

    if (fileInput.current.files) {
      formData.append("image", fileInput.current.files[0]);
    }

    let response = await chatService.createRoom(formData);

    if (!response.error) {
      setIsOpenPopup(false);
      handleAddRoom(response.data);
    }
  };

  const onChangeForm = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const onFileChange = (e) => {
    setFile(e.target.value);
  };

  useEffect(() => {
    async function fetchUserList() {
      setIsFetching(true);
      try {
        let response = await userService.getList();
        if (!response.error) setUserList(response.data);
        else console.log(response.error);
      } catch (err) {
        console.log({ err });
      } finally {
        setIsFetching(false);
      }
    }

    if (isOpenPopup) fetchUserList();
    else {
      setMembers([]);
      setForm(initForm);
      setFile(null);
    }
  }, [isOpenPopup]);

  return (
    <>
      <MDBBtn onClick={toggleOpen} style={{ width: "100%" }}>
        Thêm nhóm chat
      </MDBBtn>
      <MDBModal
        open={isOpenPopup}
        onClose={() => setIsOpenPopup(false)}
        tabIndex="-1"
      >
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Thêm thành viên</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleOpen}
              ></MDBBtn>
            </MDBModalHeader>

            
            <MDBModalBody>
              <MDBValidation className="row g-3">
                <MDBValidationItem className="col-md-12 mb-2">
                  <MDBInput
                    label="Tên nhóm"
                    type="name"
                    required
                    size="lg"
                    value={form.name}
                    name="name"
                    onChange={onChangeForm}
                  />
                </MDBValidationItem>
              </MDBValidation>

              <MDBValidationItem className="col-md-12 mb-2  ">
                <input
                  type="file"
                  className="form-control"
                  required
                  onChange={onFileChange}
                  ref={fileInput}
                />
              </MDBValidationItem>

              {isFetching
                ? "...loading"
                : userList?.map((user, index) => (
                    <label
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        paddingBottom: 10,
                      }}
                    >
                      <MDBCheckbox
                        name="userList"
                        value={user._id}
                        id={user._id}
                        onChange={handleChange}
                      />
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginLeft: 10,
                        }}
                      >
                        <img
                          src={user ? `${API}/${user.avatar}` : ""}
                          alt="avatar"
                          className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                          width="60"
                          height="60"
                        />
                        <div className="pt-1">
                          <p className="fw-bold mb-0">
                            {user ? user.name : ""}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
            </MDBModalBody>

            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={toggleOpen}>
                Đóng
              </MDBBtn>
              <MDBBtn type="submit" onClick={handleSubmit}>Xác nhận</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};

export default AddGroupPopup;
