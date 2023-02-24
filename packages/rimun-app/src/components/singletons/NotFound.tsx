import React from "react";
import { useNavigate } from "react-router-dom";
import CancelButton from "../fields/base/CancelButton";
import Icon from "../icons/Icon";

interface NotFoundProps {}

const NotFound: React.FC<NotFoundProps> = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center text-center gap-4">
      <Icon name="exclamation-circle" className="h-12 w-12" />
      <div>
        Ooops, There is nothing here. The link you have used may be broken.{" "}
        <br />
        If you can&apos;t find what you are looking for, you can contact us at{" "}
        <a
          href="mailto:info@rimun.com"
          className="text-blue-500 hover:underline"
        >
          info@rimun.com
        </a>
      </div>

      <CancelButton onClick={() => navigate(-1)} className="flex items-center">
        <Icon name="arrow-sm-left" className="mr-2" />
        Go back
      </CancelButton>
    </div>
  );
};

export default NotFound;
