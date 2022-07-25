import { ChangeEvent, useEffect, useReducer, useState } from "react";
import { FileType, uploadFile } from "../../../services/services";
import { FilesTable } from "../files-table/files-table";
import sty from "./file-uploader.module.scss";

function reducer(
  state: Record<number, FileType>,
  action: { fileIndex: number; fileType: FileType }
) {
  return { ...state, ...{ [action.fileIndex]: action.fileType } };
}

function reducer2(
  state: Record<number, boolean>,
  action: { fileIndex: number; isSuccess: boolean }
) {
  return { ...state, ...{ [action.fileIndex]: action.isSuccess } };
}

export function FileUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const [fileIdxToType, setFileIdxToType] = useReducer(reducer, {}); // useReducer instead of useState because initial updates were not batched
  const [fileIdxToIsSuccess, setFileIdxToIsSuccess] = useReducer(reducer2, {});

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return;
    const newFiles = Array.from(event.target.files);

    if (!newFiles) return;
    setFiles(files?.concat(newFiles));
  }

  function handleFileTypeSelected(fileIndex: number, fileType: FileType) {
    console.log(fileIndex, fileType, fileIdxToType);
    setFileIdxToType({ fileIndex: fileIndex, fileType: fileType });
  }

  function handleRemove(fileIndex: number) {
    const updatedFiles = files
      .slice(0, fileIndex)
      .concat(files.slice(fileIndex + 1));
    setFiles(updatedFiles);
  }

  function handleUploadClick() {
    files.forEach((file, idx) => {
      uploadFile(file, fileIdxToType[idx]).then((isSuccess) =>
        setFileIdxToIsSuccess({ fileIndex: idx, isSuccess })
      );
    });
  }

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
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
            <span className="fileInputLabel">Click para subir archivos</span>
            <span className="fileInputLabelSm">
              ...o simplemente arraste los archivos a esta zona
            </span>
          </label>
        </div>
      </div>
      <FilesTable
        files={files}
        sucessfullUploads={Array.from(Array(files.length)).map((_, idx) =>
          fileIdxToIsSuccess[idx] ? idx : -1
        )}
        onFileTypeSelected={handleFileTypeSelected}
        onRemove={handleRemove}
      />
      <div className="fileContainer">
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
  );
}
