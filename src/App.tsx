import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import { ROUTES } from "./router/routes";

function App() {
  return (
    <div className="App">
      {/* TODO: remove this div */}
      <Router>
        <div>
          <nav>
            <ul>
              {ROUTES.map((route, idx) => (
                <li key={idx}>
                  <Link to={route.path}>{route.path}</Link>
                </li>
              ))}
            </ul>
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
        </div>
      </Router>
    </div>
  );
}

export default App;
