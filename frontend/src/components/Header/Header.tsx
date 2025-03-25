import logo from "../../assets/logo.png";

export const Header = () => {
  return (
    <div className="header">
      <div className="header-info">
        <div className="header-info-left">
          <button>English</button>
          <button>Support</button>
        </div>
        <div className="header-info-right">
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
