import "../../App.css";
import {
  ChangeEvent,
  DragEventHandler,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { UserContext } from "../../App";
import { BottomAxis, LeftAxis } from "../../features/dashboard/Axes";
import { Chart } from "../../features/dashboard/Chart";
import {
  getCCdias,
  getCheques,
  uploadFile,
  uploadFileCC,
} from "../../services/services";

type Tabs = "dashboard" | "archivos";

export function Home(): JSX.Element {
  const [idToClientMap, setIdToClientMap] = useState({});
  const [filteredCC, setFilteredCC] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState<Tabs>("dashboard");
  const [radioValue, setRadioValue] = useState("check");
  const { user } = useContext(UserContext);
  const [files, setFiles] = useState<File[]>([]);
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return;
    const newFiles = Array.from(event.target.files);

    if (!newFiles) return;
    setFiles(files?.concat(newFiles));
  }
  function handleRemove(fileIndex: number) {
    const updatedFiles = files
      .slice(0, fileIndex)
      .concat(files.slice(fileIndex + 1));
    setFiles(updatedFiles);
  }
  const tabsStyle = {
    color: "white",
    fontWeight: 600,
    fontSize: 14,
    marginRight: 16,
    padding: 4,
  };
  const tabSeparator = (
    <p style={{ ...tabsStyle, paddingRight: 32, paddingLeft: 32 }}>|</p>
  );

  useEffect(() => {
    getCCdias().then((clients) => {
      const clientes = clients as any[];
      clientes.sort((a, b) => b.DiasPago - a.DiasPago);
      setFilteredCC(clientes.filter((cliente) => cliente.DiasPago));
    });
    getCheques().then((checks) => {
      const cheques = checks as any[];
      console.log(cheques);
      setIdToClientMap(
        cheques.reduce<Record<string, any>>((prev, cheque) => {
          const cliente = prev[cheque.Id_cliente];
          cliente
            ? cliente.cheques.push(cheque)
            : (prev[cheque.Id_cliente] = {
                id: cheque.Id_cliente,
                nombre: cheque.descrip_cliente,
                cheques: [cheque],
              });
          return prev;
        }, {})
      );
    });
  }, []);

  function handleUploadClick() {
    if (radioValue === "cc") {
      uploadFileCC(files[0]);
    } else {
      uploadFile(files[0]);
    }
  }

  return (
    <div>
      {user.isLoggedIn ? (
        <>
          <div
            style={{
              backgroundColor: "black",
              alignItems: "center",
              width: "100%",
              height: 48,
              marginTop: -18,
              marginBottom: 16,
              display: "flex",
              paddingLeft: 32,
            }}
          >
            <p
              style={tabsStyle}
              className="interactiveTab"
              onClick={() => setSelectedTab("dashboard")}
            >
              Dashboard
            </p>
            {tabSeparator}
            <p
              style={tabsStyle}
              className="interactiveTab"
              onClick={() => setSelectedTab("archivos")}
            >
              Archivos
            </p>
          </div>
          {selectedTab === "dashboard" && (
            <Chart idToClientMap={idToClientMap} filteredCC={filteredCC} />
          )}
          {selectedTab === "archivos" && (
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
                onChange={(e) => setRadioValue(e.target.value)}
              >
                <b>Tipo de archivo:</b>
                <div style={{ height: 8 }} />
                <div>
                  <input
                    type="radio"
                    id="check"
                    name="archivos"
                    value="check"
                  />
                  <label for="check">Cheques</label>
                </div>
                <div>
                  <input type="radio" id="cc" name="archivos" value="cc" />
                  <label for="cc">Cuentas Corrientes</label>
                </div>
              </div>

              <div style={{ height: 32 }} />
              <div className="fileInputContainer">
                <input
                  type="file"
                  id="file"
                  multiple
                  onChange={handleChange}
                  className="fileInput"
                />
                <div className="fileInputOverlay">
                  <label htmlFor="file" className="fileInputLabelContainer">
                    <span className="fileInputLabelIcon">📄</span>
                    <span className="fileInputLabel">
                      Click para subir archivos
                    </span>
                    <span className="fileInputLabelSm">
                      ...o simplemente arraste los archivos a esta zona
                    </span>
                  </label>
                </div>
              </div>
              <div className="fileContainer">
                {!!files.length && <FileUploadCardHeader />}
                {files &&
                  files.map((file, idx) => (
                    <FileUploadCard
                      name={file.name}
                      type={file.type}
                      size={file.size}
                      lastModified={file.lastModified}
                      key={idx}
                      onRemove={() => handleRemove(idx)}
                    />
                  ))}
                {!!files.length && (
                  <button
                    onClick={handleUploadClick}
                    style={{
                      marginTop: 16,
                      marginBottom: 32,
                      padding: 8,
                      borderRadius: 6,
                      backgroundColor: "#0074d9",
                      color: "white",
                      fontWeight: 600,
                    }}
                  >
                    Subir Archivo
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <p>❌ Debes iniciar sesion para ver esta seccion</p>
      )}
    </div>
  );
}

type FileUploadCardProps = {
  name: string;
  type: string;
  size: number;
  lastModified: number;
  onRemove?: () => void;
};

export default function FileUploadCard({
  name,
  type,
  size,
  lastModified,
  onRemove,
}: FileUploadCardProps) {
  const lastModifiedDate = new Date(lastModified);
  return (
    <div className="fileListItem">
      <div style={{ overflow: "hidden" }}>
        <span style={{ overflow: "hidden" }}>{name}</span>
      </div>
      <div>{type.length > 20 ? `${type.slice(0, 20)}...` : type}</div>
      <div>{`${Math.round(size / 1024)} kB`}</div>
      <div>
        {`${lastModifiedDate.getDate()}/${lastModifiedDate.getMonth()}/${lastModifiedDate.getFullYear()} a las ${lastModifiedDate.getHours()}:${lastModifiedDate.getMinutes()}`}
      </div>
      <div>
        <button
          onClick={() => {
            if (onRemove) onRemove();
          }}
        >
          ❌
        </button>
      </div>
    </div>
  );
}

function FileUploadCardHeader() {
  return (
    <div className="fileListItemHeader">
      <div>Archivo</div>
      <div>Tipo</div>
      <div>Peso</div>
      <div>Ultima Modificacion</div>
    </div>
  );
}
