import { Link } from "react-router-dom";
import { useContext } from "react";
import { DataContext } from "../../main";
import search from "../../assets/search.png";
import "../../style.css";
import "../../colors.css";

declare global {
  interface Window {
    MSStream: any;
  }
}

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window?.MSStream;

export function HeaderBar() {
  const { restaurant } = useContext(DataContext) || {};

  return (
    <div className="header-bar">
      <Link className="header-icon" to="/">
        <img
          className="header-logo"
          src={restaurant?.logo ? `https://admin.komandapp.com/${restaurant.logo}` : ''}
          alt="Logo"
        />
      </Link>
      <h4 className={`heading-cart ${isIOS ? "ios" : ""}`}>CART</h4>
      <Link className="header-icon" to="/cart">
        <img className="header-search-icon" src={search} alt="Search" />
      </Link>
    </div>
  );
}
