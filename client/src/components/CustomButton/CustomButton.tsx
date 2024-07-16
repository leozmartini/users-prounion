import React from "react";
import { Button } from "./styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faTrash, faSyncAlt, faPencilAlt, faPlus } from "@fortawesome/free-solid-svg-icons";

interface CustomButtonProps {
  onClick: () => void;
  color?: string;
  text?: string;
  icon?: "trash" | "reload" | "edit" | "plus";
}

const iconMap = {
  plus: faPlus,
  trash: faTrash,
  reload: faSyncAlt,
  edit: faPencilAlt,
};

const CustomButton: React.FC<CustomButtonProps> = ({ onClick, color, text, icon }) => {
  return (
    <Button onClick={onClick} buttoncolor={color}>
      {icon && <FontAwesomeIcon icon={iconMap[icon]} />}
      {text}
    </Button>
  );
};

export default CustomButton;
