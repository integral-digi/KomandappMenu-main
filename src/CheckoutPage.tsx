import { Link } from "react-router-dom";
import "./style.css";

export default function CheckoutPage() {
  return (
    <div className="mobile-responsive onlyMobile">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          zIndex: 1,
          color: "#00a99d",
          position: "absolute",
          marginTop: "3.5rem",
          width: "100%",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
          <Link
            style={{
              width: "20%",
              textAlign: "center",
            }}
            to="/"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m11.005 5-8 7 8 7M3.005 12H21"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </Link>
          <h3 style={{ marginLeft: "4rem" }}>Checkout</h3>
        </div>

        <div className="checkout-input">
          <input placeholder="Mobile Number" />
        </div>
        <div className="checkout-input">
          <input placeholder="Name" />
        </div>
        <div className="checkout-input">
          <input placeholder="Address" />
        </div>
        {/* <div className="checkout-input">
            <input width={"70%"} placeholder="Mobile Number"></input>
        </div>
        */}
      </div>
      <div className="btn-container-checkout">
        <Link
          className="cart-btn"
          style={{ background: "#00a99d", width: "80%" }}
          to="/checkout"
        >
          Place Order
        </Link>
      </div>
    </div>
  );
}
