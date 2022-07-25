import { useEffect, useState } from "react";
import { FileType } from "../../../services/services";
import sty from "./files-table.module.scss";

// TODO: change name to "UploadFilesTable"?
type FilesTableProps = {
  files: File[];
  sucessfullUploads: number[];
  onFileTypeSelected: (fileIndex: number, fileType: FileType) => void;
  onRemove: (fileIndex: number) => void;
};
export function FilesTable({
  files,
  sucessfullUploads,
  onFileTypeSelected,
  onRemove,
}: FilesTableProps) {
  return (
    <div className={sty.tableGrid}>
      {!!files.length && <FileUploadCardHeader />}
      {files &&
        files.map((file, idx) => (
          <FileUploadCard
            name={file.name}
            size={file.size}
            lastModified={file.lastModified}
            isSuccess={sucessfullUploads.includes(idx)}
            key={idx}
            onTypeSelected={(fileType) => onFileTypeSelected(idx, fileType)}
            onRemove={() => onRemove(idx)}
          />
        ))}
    </div>
  );
}

function FileUploadCardHeader() {
  return (
    <div className={sty.header}>
      <div></div>
      <div>nombre</div>
      <div>modificado</div>
      <div>peso</div>
      <div>tipo</div>
      <div></div>
    </div>
  );
}

const defaultType: FileType = "cheques";
const fileTypeKeywords: Record<FileType, string[]> = {
  cheques: ["cheque"],
  cobros: ["cobro", "cobranza"],
  ctasCorrientes: ["cuenta", "corriente", "cc"],
  facturacion: ["facturación", "facturacion", "fact"],
};
function getFileType(fileName: string): FileType | null {
  const name = fileName.toLowerCase();
  let returnFileType = null;

  (Object.keys(fileTypeKeywords) as FileType[]).every((fileType) => {
    return fileTypeKeywords[fileType].every((keyword) => {
      if (name.includes(keyword)) {
        returnFileType = fileType;
        return false;
      }
      return true;
    });
  });

  return returnFileType;
}

const fileOptions: Record<FileType, string> = {
  cheques: "Cheques",
  cobros: "Cobros",
  ctasCorrientes: "Cuentas corrientes",
  facturacion: "Facturación",
};

type FileUploadCardProps = {
  name: string;
  size: number;
  lastModified: number;
  isSuccess: boolean;
  onTypeSelected: (fileType: FileType) => void;
  onRemove?: () => void;
};
export default function FileUploadCard({
  name,
  size,
  lastModified,
  isSuccess = false,
  onTypeSelected,
  onRemove,
}: FileUploadCardProps) {
  const [selectedOption, setSelectedOption] = useState(defaultType);
  const lastModifiedDate = new Date(lastModified);

  useEffect(() => {
    const type = getFileType(name);
    if (type) {
      setSelectedOption(type);
      onTypeSelected(type);
    }
  }, [name]);

  return (
    <div className={sty.row}>
      <input
        name="isGoing"
        type="checkbox"
        checked={false /* this.state.isGoing */}
        onChange={() => {} /* this.handleInputChange */}
      />
      <span
        style={{
          ...(isSuccess && { backgroundColor: "lime" }),
        }}
        className={sty.container}
      >
        {name}
      </span>
      <span>
        {`${lastModifiedDate.toLocaleDateString()} a las ${lastModifiedDate.getHours()}:${lastModifiedDate.getMinutes()}`}
      </span>
      <span>{`${Math.round(size / 1024)} kB`}</span>
      <select
        value={selectedOption}
        onChange={(ev) => setSelectedOption(ev.target.value as FileType)}
      >
        {(Object.keys(fileOptions) as FileType[]).map((fileType) => (
          <option value={fileType}>{fileOptions[fileType]}</option>
        ))}
      </select>
      {isSuccess ? (
        <span>✅</span>
      ) : (
        <button
          onClick={() => {
            if (onRemove) onRemove();
          }}
        >
          ❌
        </button>
      )}
    </div>
  );
}
