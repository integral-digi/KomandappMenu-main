import { Link } from "react-router-dom";
import { useContext } from "react";
import { DataContext } from "../../main";
import search from "../../assets/search.png";
import "../../colors.css";

declare global {
  interface Window {
    MSStream: any;
  }
}
var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window?.MSStream;

export function HeaderBar(){
    const {restaurant} = useContext(DataContext);

    return(
        <div
        style={{
          display: "flex",
          flexDirection: "row",
          zIndex: 12,
          color: "#00a99d",
          position: "absolute",
          width: "100%",
          height: "90px",
          justifyContent: "space-between",
          alignItems: "center",
          top: "0",
        }}
      >
        <Link className="cart-icon" to="/" style={{ width: "20%" }}>
          <img
            style={{ width: "30px", height: "30px" }}
            src={"https://admin.komandapp.com/" + restaurant?.logo}
            alt="Logo"
          />
        </Link>
        <h4
        className={isIOS?"heading-cart-ios":"heading-cart"}
          style={{
            margin:"0",
            textAlign: "center",
            color: "var(--primary-color)",
            fontFamily: 'Inter',
          }}
        >
          CART
        </h4>
        <Link className="cart-icon" to="/cart" style={{ width: "20%" }}>
          <img style={{ width: "25px", height: "25px" }} src={search} />
        </Link>
      </div>
    )
}