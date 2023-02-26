import { ArrowSmallLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import SubmitButton from "src/components/buttons/SubmitButton";
import CancelButton from "src/components/fields/base/CancelButton";

interface PageFormFooterProps {
  actionTitle?: string;
  isLoading?: boolean;
}

export default function PageFormFooter({
  isLoading = false,
  actionTitle = "Submit",
}: PageFormFooterProps) {
  const navigate = useNavigate();
  return (
    <div className="flex mt-6 justify-between items-center">
      <CancelButton
        onClick={() => navigate(-1)}
        className="flex justify-center items-center"
      >
        <ArrowSmallLeftIcon className="mr-2 w-4 h-4" />
        <p className="flex-shrink-0">Go back</p>
      </CancelButton>

      <SubmitButton isLoading={isLoading} className="flex-shrink-0">
        {actionTitle}
      </SubmitButton>
    </div>
  );
}
