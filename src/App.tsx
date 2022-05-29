import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import "./styles/globals.css";
import { ROUTES } from "./router/routes";

const defaultUser = { isLoggedIn: false };
export const UserContext = React.createContext<any>(null);

function App() {
  const storageUser = JSON.parse(localStorage.getItem("user") || "{}");
  console.log(storageUser);
  const [user, setUser] = useState(storageUser || defaultUser);

  return (
    <div className="App">
      <UserContext.Provider value={{ user, setUser }}>
        {/* TODO: remove this div */}
        <Router>
          <nav
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: 16,
              marginBottom: 16,
              backgroundColor: "#0074d9",
              borderBottom: "1px solid gray",
            }}
          >
            <Link
              to="/"
              style={{
                color: "white",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Home
            </Link>
            {/* <ul>
              {ROUTES.map((route, idx) => (
                <li key={idx}>
                  <Link to={route.path}>{route.path}</Link>
                </li>
              ))}
            </ul> */}
            {user.isLoggedIn ? (
              <div>
                Has ingresado como{" "}
                <span style={{ fontWeight: 600 }}>{user.username}</span> 👋
                <button
                  style={{
                    background: "none",
                    color: "white",
                    border: "none",
                    padding: 0,
                    font: "inherit",
                    outline: "inherit",
                    fontWeight: 600,
                  }}
                  onClick={() => {
                    setUser({ isLoggedIn: false });
                    localStorage.setItem(
                      "user",
                      JSON.stringify({ isLoggedIn: false })
                    );
                  }}
                >
                  Cerrar sesion
                </button>
              </div>
            ) : (
              <div>
                No has iniciado sesion 👉
                <Link
                  to="/ingresar"
                  style={{
                    color: "white",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Ingresar
                </Link>
              </div>
            )}
          </nav>

          <Routes>
            {ROUTES.map((route, idx) => (
              <Route
                path={route.path}
                element={<route.component />}
                key={idx}
              />
            ))}
          </Routes>
        </Router>
      </UserContext.Provider>
    </div>
  );
}

export default App;
