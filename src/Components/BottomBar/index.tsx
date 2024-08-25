import icon5 from "../../assets/homenew.svg";
import icon6 from "../../assets/cart.svg";
import icon7 from "../../assets/menulist.svg";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { DataContext } from "../../main";
import "../../style.css";
import "../../colors.css";

interface appProps {
  changeMenu?: (index: number) => void;
  selectedMenu?: number;
}

export default function BottomBar({
  changeMenu,
  selectedMenu,
}: appProps) {
  const { cart, setType, selectType, resname } = useContext(DataContext);
  const [activeBar, setActiveBar] = useState<number>(() =>
    window.location.pathname.split("/")[3] === "cart" ? 2 : 1
  );
  const navigate = useNavigate();
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window?.MSStream;

  useEffect(() => {
    setActiveBar(window.location.pathname.split("/")[3] === "cart" ? 2 : 1);
  }, [window.location.pathname]);

  const handleNavigation = async (type: number, path: string) => {
    if (setType) setType(type);
    navigate(path);
  };

  return (
    <div
      className="onlyMobile"
      style={{
        background: "#121212",
        width: "100%",
        position: "fixed",
        bottom: "0",
        height: "6dvh",
        color: "white",
        display: "flex",
        alignItems: "center",
        borderRadius: "5px 5px 0 0",
        padding: "0 5%",
        zIndex: 2,
      }}
    >
      <Link
        to={`/restaurant/${resname}`}
        className="activeMenu"
        onClick={() => handleNavigation(1, `/restaurant/${resname}`)}
      >
        <img className="icon" src={icon5} alt="Home" />
        {activeBar === 1 && selectType === 1 && (
          <div className="menubutton-underline"></div>
        )}
      </Link>
      <div
        className="activeMenu"
        onClick={() => handleNavigation(2, `/restaurant/${resname}`)}
      >
        <img className="icon" src={icon7} alt="Menu" />
        {activeBar === 1 && selectType === 2 && (
          <div className="menubutton-underline"></div>
        )}
      </div>
      <div
        className="activeMenu"
        onClick={() => {
          const queryString = window.location.search;
          const urlParams = new URLSearchParams(queryString);
          const s = urlParams.get("s");
          const cartPath = s ? `/cart?s=${s}` : "/cart";
          navigate(cartPath);
        }}
      >
        <img className="icon" src={icon6} alt="Cart" />
        {cart?.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "0px",
              right: "15%",
              fontSize: "11px",
              fontWeight: "bold",
              backgroundColor: "white",
              borderRadius: "10px",
              color: "black",
              padding: "0px 5px",
            }}
          >
            {cart.length}
          </div>
        )}
        {activeBar === 2 && <div className="menubutton-underline"></div>}
      </div>
    </div>
  );
}
