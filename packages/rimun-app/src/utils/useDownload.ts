import { useStateDispatch } from "src/store";
import { DeviceActions } from "src/store/reducers/device";

const STATIC_ENDPOINT = "/static";

export default function useDownload() {
  const dispatch = useStateDispatch();

  return async function (path: string, fileName: string = `${Date.now()}`) {
    const res = await fetch(`${STATIC_ENDPOINT}/${path}`);

    if (!res.ok) {
      dispatch(
        DeviceActions.displayAlert({
          status: "error",
          message: "Something went wrong. Contact the maintainers.",
        })
      );
      return;
    }

    const blob = await res.blob();
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.href = (window.URL || window.webkitURL).createObjectURL(blob);
    a.download = `${fileName}.pdf`;
    a.click();
    a.remove();
  };
}
