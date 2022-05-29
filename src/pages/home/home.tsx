import "../../App.css";
import { ChangeEvent, DragEventHandler, useContext, useState } from "react";
import { UserContext } from "../../App";

export function Home(): JSX.Element {
  const { user } = useContext(UserContext);
  const [files, setFiles] = useState<File[]>([]);
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return;
    const newFiles = Array.from(event.target.files);

    if (!newFiles) return;
    setFiles(files?.concat(newFiles));
  }
  return (
    <div>
      {user.isLoggedIn ? (
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
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
                  ...o simplemente arraste los archivos a esta zona!
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
                />
              ))}
          </div>
        </div>
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
};

export default function FileUploadCard({
  name,
  type,
  size,
  lastModified,
}: FileUploadCardProps) {
  const lastModifiedDate = new Date(lastModified);
  return (
    <div className="fileListItem">
      <div>{name}</div>
      <div>{type}</div>
      <div>{`${Math.round(size / 1024)} kB`}</div>
      <div>
        {`${lastModifiedDate.getDate()}/${lastModifiedDate.getMonth()}/${lastModifiedDate.getFullYear()} a las ${lastModifiedDate.getHours()}:${lastModifiedDate.getMinutes()}`}
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
