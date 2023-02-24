import { saveAs } from "file-saver";
import { API_ENDPOINT } from "src/config";

export async function downloadDocument(path: string, name?: string) {
  const res = await fetch(`${API_ENDPOINT}/static/docs/${path}`);
  console.debug(res, res.ok);
  if (!res.ok) return;
  const defaultName = `Download_${Math.ceil(Date.now())}`;
  const fileName = name ?? defaultName;
  const file = new File([await res.blob()], fileName, {
    type: res.headers.get("Content-Type") ?? "application/pdf",
  });
  saveAs(file, fileName);
}
