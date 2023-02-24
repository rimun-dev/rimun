import CancelButton from "src/components/fields/base/CancelButton";
import SubmitButton from "src/components/fields/base/SubmitButton";

interface ModalFooterProps {
  actionTitle?: string;
  setIsVisible: (b: boolean) => void;
  isLoading: boolean;
}

export default function ModalFooter(props: ModalFooterProps) {
  return (
    <div className="flex mt-6 justify-between">
      <CancelButton
        onClick={() => props.setIsVisible(false)}
        className="flex justify-center items-center flex-1 mr-2"
      >
        Cancel
      </CancelButton>
      <SubmitButton isLoading={props.isLoading} className="ml-2 flex-1">
        {props.actionTitle}
      </SubmitButton>
    </div>
  );
}
