import React, { HTMLProps } from "react";
import CircularButton from "../buttons/CircularButton";

export interface ModalProps extends HTMLProps<HTMLDivElement> {
  isVisible: boolean;
  setIsVisible: (b: boolean) => void;
}

const Modal: React.FC<ModalProps> = (props) => {
  return (
    <>
      <div
        className={`fixed transition-all z-40 left-0 right-0 mx-auto shadow-xl ${
          props.isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        } overflow-y-auto overflow-x-hidden ${props.className}`}
      >
        {props.isVisible && props.children}
      </div>
      <button
        type="button"
        className={`fixed top-0 left-0 w-screen h-screen bg-gray-700 z-30 cursor-default ${
          props.isVisible ? "bg-opacity-90" : "bg-opacity-0 pointer-events-none"
        }`}
        onClick={() => props.setIsVisible(false)}
      />
    </>
  );
};

export default Modal;

interface ModalHeaderProps extends React.HTMLProps<HTMLDivElement> {
  onDismiss: () => void;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  children,
  onDismiss,
  ...props
}) => (
  <div
    {...props}
    className={`border-b border-white border-opacity-5 p-4 flex justify-between items-center ${props.className}`}
  >
    <h2 className="text-xl font-bold">{children}</h2>
    <CircularButton icon="x" onClick={onDismiss} />
  </div>
);
