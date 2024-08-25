import icon5 from "../../assets/homenew.svg";
import icon6 from "../../assets/cart.svg";
import icon7 from "../../assets/menulist.svg";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { DataContext } from "../../main";
import "../../style.css";
import "../../colors.css";

interface appProps {
  changeMenu?: any;
  selectedMenu?: any;
  // setType?: any;
  // selectType?: number;
}

export default function BottomBar({
  changeMenu,
  selectedMenu,
}: appProps) {
  const { cart, setType, selectType, resname } = useContext(DataContext);
  const [activeBar, setActiveBar] = useState(window.location.pathname.split("/")[3] === 'cart' ? 2 : 1);
  const navigate = useNavigate();
  var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window?.MSStream;

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
        zIndex: "2",
      }}
    >
      <Link to={`/restaurant/${resname}`}
        className={"activeMenu"}
        onClick={() => {
            setType && setType(1);
        }}
      >
        <img className="icon" src={icon5} />
        {(activeBar == 1 && selectType == 1) && <div className="menubutton-underline"></div>}
      </Link>
      <div
        className={"activeMenu"}
        onClick={async () => {
          setType(2);
          navigate(`/restaurant/${resname}`);    
        }}
      >
        <img className="icon" src={icon7} />
        {(activeBar == 1 && selectType == 2) && <div className="menubutton-underline"></div>}
      </div>
      <div onClick={async () => {
        
          const queryString = window.location.search;
          const urlParams = new URLSearchParams(queryString);
          const s = urlParams.get('s');
          if(s){
            navigate(`/cart?s=${s}`);
          } else {
          navigate("/cart");  
          }  
        }} className={"activeMenu"} 
      >
        <img className="icon" src={icon6} />
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
            {cart?.length}
          </div>
        )}
        {activeBar == 2 && <div className="menubutton-underline"></div>}
      </div>
    </div>
  );
}
