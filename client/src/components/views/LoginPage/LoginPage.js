import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../actions/userAction";

function LoginPage(props) {
  const dispatch = useDispatch();

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const onChangeEmail = (event) => {
    setEmail(event.currentTarget.value);
  };
  const onChangePassword = (event) => {
    setPassword(event.currentTarget.value);
  };
  const onSubmit = (event) => {
    event.preventDefault();

    // console.log("Email", Email);
    // console.log("Password", Password);

    let body = {
      email: Email,
      password: Password,
    };

    dispatch(loginUser(body)).then((res) => {
      if (res.payload.loginSuccess) {
        props.history.push("/");
      } else {
        alert("Error");
      }
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={onSubmit}
      >
        <label>Email</label>
        <input type="email" value={Email} onChange={onChangeEmail} />
        <label>password</label>
        <input type="password" value={Password} onChange={onChangePassword} />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
