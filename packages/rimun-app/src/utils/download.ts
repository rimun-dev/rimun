import { CDN_ENDPOINT } from "src/config";

export async function downloadDocument(
  path: string,
  _name: string = "download.pdf"
) {
  window.open(`${CDN_ENDPOINT}/${path}`);
}

export function downloadBase64File(contentBase64: string) {
  const win = window.open();
  const blob = base64ToBlob(contentBase64, "application/pdf");
  win?.document.write(
    '<iframe src="' +
      URL.createObjectURL(blob) +
      '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>'
  );
}

function base64ToBlob(base64: string, type = "application/octet-stream") {
  const binStr = atob(base64);
  const len = binStr.length;
  const arr = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    arr[i] = binStr.charCodeAt(i);
  }
  return new Blob([arr], { type: type });
}
