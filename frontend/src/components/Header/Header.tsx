import logo from "../../assets/logo.png";

export const Header = () => {
  return (
    <div className="header py-5 px-30">
      <div className="header-info flex place-content-between">
        <div className="header-info-left flex gap-5 text-gray-600 text-sm">
          <button>English</button>
          <button>Support</button>
        </div>
        <div className="header-info-right flex gap-5 text-gray-600 text-sm">
          <button>Blog</button>
          <button>About us</button>
        </div>
      </div>
      <div className="header-options">
        <div className="header-options-left">
          <img src={logo}></img>
          <button>Features</button>
          <button>Case Studies</button>
          <button>Pricing</button>
          <button>Applications</button>
        </div>
        <div className="header-options-right">
          <button>Get Start</button>
        </div>
      </div>
    </div>
  );
};
