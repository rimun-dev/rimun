import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { DeviceActions } from "src/store/reducers/device";

interface FieldItemProps {
  touched?: boolean;
  error?: string | object;
}

const FieldItem: React.FC<FieldItemProps> = ({ children, error, touched = false }) => {
  const hasError = !!error && touched;

  const dispatch = useDispatch();

  useEffect(() => {
    if (hasError) {
      dispatch(
        DeviceActions.displayAlert({
          status: "error",
          message: typeof error === "string" ? error : Object.values(error)[0],
        })
      );
    }
    // eslint-disable-next-line
  }, [error, hasError]);

  return <>{children}</>;
};

export default FieldItem;
