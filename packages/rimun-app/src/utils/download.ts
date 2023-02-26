import { CDN_ENDPOINT } from "src/config";

export async function downloadDocument(
  path: string,
  _name: string = "download.pdf"
) {
  window.open(`${CDN_ENDPOINT}/${path}`);
}
