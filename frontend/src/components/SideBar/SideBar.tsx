import logo from "../../assets/logo.png";
import "./SideBar.css";
import { SidebarOption } from "../SideOption/SidebarOption/SidebarOption";
import riseChart from "../../assets/icons/rise_chart.png";

const createSidebarOption = (index: number, arrowNeeded: boolean) => {
  return (
    <SidebarOption
      arrowNeeded={arrowNeeded}
      icon={riseChart}
      text={`Page ${index}`}
    />
  );
};

export const SideBar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img className="sidebar-logo-image" src={logo}></img>
        <span className="sidebar-logo-text">Feed AI</span>
      </div>
      <div className="sidebar-content">
        <div className="sidebar-content-section">
          <div className="sidebar-content-section-title">Quick Access</div>
          <div className="sidebar-content-section-content">
            {Array.from(Array(4).keys()).map((_, index) => {
              return createSidebarOption(index, false);
            })}
          </div>
        </div>
        <div className="sidebar-content-section">
          <div className="sidebar-content-section-title">Services</div>
          <div className="sidebar-content-section-content">
            {Array.from(Array(4).keys()).map((_, index) => {
              return createSidebarOption(index, true);
            })}
          </div>
        </div>
      </div>
      <div className="sidebar-content-footer"></div>
    </div>
  );
};
