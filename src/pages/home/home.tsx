import logo from "../../logo.svg";
import "../../App.css";

export function Home(): JSX.Element {
  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>prueba de deploy</p>
      <p>si estás viendo esto quiere decir que funcionó ✅</p>
    </header>
  );
}
