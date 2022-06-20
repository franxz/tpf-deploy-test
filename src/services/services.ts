export const API_URL = "http://localhost:8080/api/excel";

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${API_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    console.log(response);
    const jsonRes = await response.json();
    console.log(jsonRes);

    response.ok
      ? console.log("El archivo fue cargado con exito")
      : console.log("[ERROR] El archivo no pudo ser cargado");
  } catch (e) {
    console.error(e);
  }
}

export async function getCheques() {
  try {
    const response = await fetch(`${API_URL}/checks`);
    return await response.json();
  } catch (e) {
    console.error(e);
  }
}
