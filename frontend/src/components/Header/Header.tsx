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
      <div className="header-options flex place-content-between items-center py-5">
        <div className="header-options-left flex items-center gap-10 text-gray-800 ">
          <div className="header-options-left-logo flex items-center">
            <img className="w-16" src={logo}></img>
            <span className="font-bold text-xl">Feed AI</span>
          </div>
          <button>Features</button>
          <button>Case Studies</button>
          <button>Pricing</button>
          <button>Applications</button>
        </div>
        <div className="header-options-right">
          <button className="bg-blue-400 p-2 px-8 rounded-md text-white font-bold">
            Get Start
          </button>
        </div>
      </div>
    </div>
  );
};
