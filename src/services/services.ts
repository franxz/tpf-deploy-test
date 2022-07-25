export const API_URL = "http://localhost:8181/api/excel";

export type FileType = "cheques" | "ctasCorrientes" | "cobros" | "facturacion";

const typeToEndpoint: Record<FileType, string> = {
  cheques: "/upload",
  ctasCorrientes: "/uploadCC",
  cobros: "/uploadCobros",
  facturacion: "/uploadFacturacion",
};

export async function uploadFile(file: File, type: FileType): Promise<boolean> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${API_URL}${typeToEndpoint[type]}`, {
      method: "POST",
      body: formData,
    });

    // TODO: ver que respuesta estan dando las chicas y dar feedback al user
    console.log(response);
    const jsonRes = await response.json();
    console.log(jsonRes);

    return response.ok;
  } catch (e) {
    console.error(e);
    return false;
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

export async function getCCdias() {
  try {
    const response = await fetch(`${API_URL}/deltadiaspago`);
    return await response.json();
  } catch (e) {
    console.error(e);
  }
}

export async function getCantFacturasImpagas() {
  try {
    const response = await fetch(`${API_URL}/facturassinpagar`);
    return await response.json();
  } catch (e) {
    console.error(e);
  }
}

export async function getFechasFacturaImpaga() {
  try {
    const response = await fetch(`${API_URL}/facturasinpagar`);
    return await response.json();
  } catch (e) {
    console.error(e);
  }
}

export async function getSaldos() {
  try {
    const response = await fetch(`${API_URL}/saldoclientes`);
    return await response.json();
  } catch (e) {
    console.error(e);
  }
}
