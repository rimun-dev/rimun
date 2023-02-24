import React from "react";
import CancelButton from "../fields/base/CancelButton";
import SubmitButton from "../fields/base/SubmitButton";
import Modal, { ModalHeader, ModalProps } from "./Modal";

interface ConfirmationModalProps extends ModalProps {
  title: string;
  isLoading?: boolean;
  onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title,
  onConfirm,
  children,
  isLoading = false,
  ...props
}) => {
  return (
    <Modal
      {...props}
      className="w-full top-20 max-w-md bg-white shadow-xl rounded-lg"
    >
      <ModalHeader onDismiss={() => props.setIsVisible(false)}>
        {title}
      </ModalHeader>

      <div className="p-4">
        <p>{children}</p>

        <div className="flex mt-4 justify-between">
          <CancelButton
            onClick={() => props.setIsVisible(false)}
            className="flex-1 mr-2"
          >
            Cancel
          </CancelButton>

          <SubmitButton
            isLoading={isLoading}
            onClick={() => {
              onConfirm();
              props.setIsVisible(false);
            }}
            className="flex-1 ml-2"
          >
            Confirm
          </SubmitButton>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
