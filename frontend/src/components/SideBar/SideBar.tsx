import { ReactNode } from "react";
import logo from "../../assets/logo.png";
import "./SideBar.css";

export const SideBar = (props: { children: ReactNode }) => {
  const { children } = props;
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img className="sidebar-logo-image" src={logo}></img>
        <span className="sidebar-logo-text">Feed AI</span>
      </div>
      <div className="sidebar-content">
        <div className="sidebar-content-section">
          <div className="sidebar-content-section-title">Quick Access</div>
          <div className="sidebar-content-section-content">{children}</div>
        </div>
      </div>
      <div className="sidebar-content-footer"></div>
    </div>
  );
};
