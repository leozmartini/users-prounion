import { useState } from "react";
import {
  ModalBackground,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalInput,
  ModalButton,
} from "./styles";
import CustomButton from "../CustomButton/CustomButton";

interface ModalProps {
  title: string;
  description: string | JSX.Element;
  buttonText?: string;
  buttoncolor?: string;
  input1?: string;
  input2?: string;
  input3?: string;
  onClose?: () => void;
  onConfirm: (input1Value?: string, input2Value?: string, input3Value?: string) => void;
}

const Modal: React.FC<ModalProps> = ({
  title,
  description,
  buttonText,
  buttoncolor,
  input1,
  input2,
  input3,
  onClose,
  onConfirm,
}) => {
  const [input1Value, setInput1Value] = useState("");
  const [input2Value, setInput2Value] = useState("");
  const [input3Value, setInput3Value] = useState("");

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(input1Value, input2Value, input3Value);
  };

  return (
    <ModalBackground>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          {onClose && <CustomButton onClick={onClose} text="X" color="red" />}
        </ModalHeader>
        <ModalDescription>{description}</ModalDescription>
        <form onSubmit={handleConfirm}>
          <ModalBody>
            {input1 && (
              <ModalInput
                type="text"
                placeholder={input1}
                value={input1Value}
                onChange={e => setInput1Value(e.target.value)}
              />
            )}
            {input2 && (
              <ModalInput
                type="email"
                placeholder={input2}
                value={input2Value}
                onChange={e => setInput2Value(e.target.value)}
              />
            )}
            {input3 && (
              <ModalInput
                type="password"
                placeholder={input3}
                value={input3Value}
                onChange={e => setInput3Value(e.target.value)}
              />
            )}
          </ModalBody>
          <ModalButton type="submit" buttoncolor={buttoncolor}>
            {buttonText || "OK"}
          </ModalButton>
        </form>
      </ModalContainer>
    </ModalBackground>
  );
};

export default Modal;
