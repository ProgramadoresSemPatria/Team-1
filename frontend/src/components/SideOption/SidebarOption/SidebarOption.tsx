import "./SidebarOption.css";

import arrowRight from "../../../assets/icons/arrow_right.png";
import arrowDown from "../../../assets/icons/arrow_down.png";

export const SidebarOption = (props: {
  icon: string;
  text: string;
  arrowNeeded: boolean;
  arrowDirection?: "right" | "left";
}) => {
  const { icon, text, arrowNeeded = false, arrowDirection = "right" } = props;
  return (
    <div className="sidebar-option">
      <div className="sidebar-option-content">
        <img src={icon}></img>
        <p>{text}</p>
      </div>

      {arrowNeeded ? (
        <button className="sidebar-option-button">
          {arrowDirection == "right" ? (
            <img src={arrowRight}></img>
          ) : (
            <img src={arrowDown}></img>
          )}
        </button>
      ) : (
        <></>
      )}
    </div>
  );
};
