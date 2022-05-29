import React, { useContext, useState } from "react";
import { UserContext } from "../../App";

const usuariosRegistrados: any = {
  "franco.martucci": "1234",
  "jessi.miguel": "1234",
  "coti.pellegrini": "1234",
};

export function Login(): JSX.Element {
  const [errorNode, setErrorNode] = useState("");
  function handleSubmit(data: any) {
    if (!data.username || data.username === "")
      return setErrorNode("Ingresar nombre de usuario valido");
    if (!data.password || data.password.lenght <= 3)
      return setErrorNode("Ingresar password valido");
    if (usuariosRegistrados[data.username] !== data.password)
      return setErrorNode("Nombre de usuario o password incorrecto");
    // estoy logueado
    setErrorNode("");
    const newUser = { username: data.username, isLoggedIn: true };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  }

  const { user, setUser } = useContext(UserContext);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {user.isLoggedIn && (
        <div
          style={{
            padding: 16,
            borderRadius: 10,
            marginBottom: 32,
            border: "solid 1px green",
          }}
        >
          ✅ Has ingresado con exito
        </div>
      )}
      <div style={{ position: "relative" }}>
        {user.isLoggedIn && (
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundColor: "rgba(255,255,255,0.7)",
            }}
          />
        )}
        <Form onSubmit={handleSubmit} />
      </div>
      <div
        style={
          errorNode
            ? {
                padding: 16,
                borderRadius: 10,
                marginTop: 32,
                border: "solid 1px red",
              }
            : {}
        }
      >
        {errorNode && "❌ "}
        {errorNode}
      </div>
    </div>
  );
}

const appStyle = {
  height: "250px",
  display: "flex",
};

const formStyle = {
  margin: "auto",
  padding: "10px",
  border: "1px solid #c9c9c9",
  borderRadius: "5px",
  background: "#f5f5f5",
  width: "220px",
  display: "block",
};

const labelStyle = {
  margin: "10px 0 5px 0",
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: "15px",
};

const inputStyle: any = {
  margin: "5px 0 10px 0",
  padding: "5px",
  border: "1px solid #bfbfbf",
  borderRadius: "3px",
  boxSizing: "border-box",
  width: "100%",
};

const submitStyle = {
  margin: "10px 0 0 0",
  padding: "7px 10px",
  border: "1px solid #efffff",
  borderRadius: "3px",
  background: "#3085d6",
  width: "100%",
  fontSize: "15px",
  color: "white",
  display: "block",
};

const Field = React.forwardRef(({ label, type }: any, ref: any) => {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input ref={ref} type={type} style={inputStyle} />
    </div>
  );
});

const Form = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const usernameRef = React.useRef();
  const passwordRef = React.useRef();
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const data = {
      username: usernameRef?.current?.["value"] || "",
      password: passwordRef?.current?.["value"] || "",
    };
    onSubmit(data);
  };
  return (
    <form style={formStyle} onSubmit={handleSubmit}>
      <Field ref={usernameRef} label="Usuario" type="text" />
      <Field ref={passwordRef} label="Password" type="password" />
      <div>
        <button style={submitStyle} type="submit">
          Ingresar
        </button>
      </div>
    </form>
  );
};
