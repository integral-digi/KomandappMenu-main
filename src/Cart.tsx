import { Link } from "react-router-dom";
import minus from "./assets/minus.svg";
import { useNavigate } from "react-router-dom";

import "./style.css";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "./main";
import { HeaderBar } from "./Components/HeaderBar";
import BottomBar from "./Components/BottomBar";
import CartVariationModel from "./Components/modal/cartVareationModel";
import CheckoutModel from "./Components/modal/checkoutModel";

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';


// const stripePromise = loadStripe('pk_test_51PXR5PPqKd13oDwqDtxa50KMOqHvMCVviObqUvl8efqZqjNn2VydBOGMToUgXS3hjyWBnS8rIbD6jadKDhOFibEb00zQrYS7Nz');

declare global {
  interface Window {
    MSStream: any;
  }
}
export default function Cart() {
  const { menu, setMenu, cart, restaurant, setCart, resname, resData } = useContext(DataContext);
  const [triggerReload, setTriggerReload] = useState(false);
  const [modalData, setModalData] = useState({ show: false });
  const [checkoutModelData, setCheckoutModelData] = useState({ show: false });
  const navigate = useNavigate();

  console.log('restaurant', resData);
  const stripePromise = loadStripe('pk_test_51JuafZLQGDg2cLOXhVNh3DBTvAXG1jWtgJQG6614QbWrhQYxLmidaKY7YaxvjC49iSeqqmDR5jfOeJuvtJVDTm2E00pQwzIgMJ'
  // , {
  //   // stripeAccount: resData?.stripe_account,
  // }
  );

  useEffect(() => {
    console.log("cart page data : ", cart);
  });
  const calculateTotalPrice = () => {
    const total = cart.reduce(
      (acc: any, item: any) =>
        acc +
        (item.add_price
          ? item?.add_price * item?.count + item?.price * item?.count
          : item?.price * item?.count),
      0
    );
    return total.toFixed(2); // Format to two decimal places
  };
  useEffect(() => {}, [triggerReload]);
  const handleIncrement = (itemId: any, index: number) => {
    const updatedCartItems = cart.map((item: any, itemIndex: number) => {
      if (item.id === itemId && index == itemIndex && item.count < 99) {
        setTriggerReload(!triggerReload);
        return { ...item, count: item.count + 1 }; // Increase count for the clicked item
      }
      return item; // Keep other items unchanged
    });
    console.log('updatedCartItems', updatedCartItems)
    setCart(updatedCartItems);
    sessionStorage.setItem(resname, JSON.stringify(updatedCartItems));
  };

  const handleDecrement = (itemId: any, count: number, index: number) => {
    if (count > 1) {
      const updatedCartItems = cart.map((item: any, itemIndex: number) => {
        if (item.id === itemId && index == itemIndex) {
          setTriggerReload(!triggerReload);
          return { ...item, count: Math.max(item.count - 1, 0) }; // Ensure count doesn't go below 0
        }
        return item; // Keep other items unchanged
      });
      setCart(updatedCartItems);
      sessionStorage.setItem(resname, JSON.stringify(updatedCartItems));
    } else {
      const updatedCartItems = cart.filter((item: any, itemIndex: number) => {
        if (item.id == itemId && index == itemIndex) {
          // If count reaches 0, remove the item
          return item.count > 1 ? { ...item, count: item.count - 1 } : false;
        }
        return item; // Keep other items unchanged
      });
      setCart(updatedCartItems);
      sessionStorage.setItem(resname, JSON.stringify(updatedCartItems));
    }
  };
  var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window?.MSStream;
  return (
    <div className="onlyMobile">
      <HeaderBar />
      <div className="menu-card-cart">
        <div className="card-items">
          {cart?.map((item: any, index: number) => {
            return (
              <div className="menu-item">
                <div className="cart-img">
                  <img
                    className={isIOS ? "cart-img-size-ios" : "cart-img-size"}
                    style={{
                      borderRadius: "12px",
                      objectFit: "cover",
                      width: "110px",
                      height: "110px",
                    }}
                    src={item?.image_path}
                  />
                </div>
                <div className="menu-description-cart">
                  <div
                    className={isIOS ? "cart-title-ios" : "cart-title"}
                    style={{ fontWeight: "bold" }}
                  >
                    {item?.title}
                  </div>
                  {item?.variantsData?.length >= 1 && (
                    <div
                      className={
                        isIOS ? "variation-tag-cart-ios" : "variation-tag-cart"
                      }
                      onClick={() =>
                        setModalData((pre: any) => ({
                          ...pre,
                          show: true,
                          id: item?.id,
                          index: index,
                          data: item,
                        }))
                      }
                    >
                      {Object?.values(
                        JSON?.parse(item?.variantsData[item?.variants]?.options)
                      )[0] + ""}
                    </div>
                  )}

                  {item?.extrasData?.length >= 1 && (
                    <div style={{ display: "inline-flex", flexWrap: "wrap" }}>
                      {item?.extrasData?.map(
                        (itemInner: any, innerIndex: number) =>
                          // Check if the extra is included in the main extras array
                          item?.extras?.includes(itemInner.id) && ( // Replace 'id' with the appropriate property
                            <div
                              key={innerIndex}
                              className={
                                isIOS
                                  ? "variation-tag-cart-ios"
                                  : "variation-tag-cart"
                              }
                              onClick={() => {
                                // Set modal data logic (assuming 'setModalData' exists)
                                setModalData((pre: any) => ({
                                  ...pre,
                                  show: true,
                                  id: item?.id,
                                  index: index,
                                  data: item,
                                }));
                              }}
                            >
                              {/* Replace 'ht' with the desired content for each extra data item */}
                              {itemInner.name}{" "}
                              {/* Assuming 'name' property exists */}
                            </div>
                          )
                      )}
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      marginTop: "0.5rem",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h5
                      className={isIOS ? "cart-title-ios" : "cart-title"}
                      style={{ margin: "0" }}
                    >
                      {resData?.currency}
                      {(
                        item?.price * item?.count +
                        item?.add_price * item?.count
                      ).toFixed(2)}
                    </h5>

                    <div
                      className="add-cart-count"
                      style={{
                        backgroundColor: "gray",
                        borderRadius: "12px",
                        padding: isIOS ? "4px 6px" : "3px 5px",
                      }}
                    >
                      <div
                        className="remove-button"
                        style={{ width: "18px" }}
                        onClick={() =>
                          handleDecrement(item?.id, item?.count, index)
                        }
                      >
                        {item?.count > 1 ? (
                          // minus
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash-lg" viewBox="0 0 16 16">
                          <path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8"/>
                        </svg>
                        ) : (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M3 6H5H21"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                            <path
                              d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                            <path
                              d="M10 11V17"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                            <path
                              d="M14 11V17"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                          </svg>
                        )}
                      </div>
                      <h5
                        style={{
                          padding: "0 0.6rem",
                          margin: "0",
                          display: "flex",
                          alignItems: "center",
                          minWidth: "40px",
                          justifyContent: "center",
                        }}
                        className={isIOS ? "cart-title-ios" : "cart-title"}
                      >
                        {item?.count}
                      </h5>
                      <div
                        className="add-button"
                        onClick={() => handleIncrement(item.id, index)}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 4V20"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></path>
                          <path
                            d="M20 12H4"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {cart.length < 1 && (
            <div
              className="menu-item"
              style={{
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "2rem",
                padding: "1rem",
              }}
            >
              <div style={{ margin: "0", fontSize: "18px" }}>
                No Item in the Cart
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="btn-container">
        <div
          style={{
            color: "white",
            display: "flex",
            justifyContent: "space-around",
            fontWeight: "bold",
          }}
        >
          <div className={isIOS ? "cart-subtotal-ios" : "cart-subtotal"}>
            Subtotal
          </div>
          <div className={isIOS ? "cart-subtotal-ios" : "cart-subtotal"}>
          {resData?.currency}{calculateTotalPrice()}
          </div>
        </div>
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          {/* <div
            className={isIOS ? "cart-btn-ios" : "cart-btn"}
            style={{ width: "60%" }}
            // onClick={(pre)=>setCheckoutModelData({...pre,show:true})}
            onClick={ (pre) => {
              // console.log("checkoutModelData", checkoutModelData);
              // navigate("/checkout");    
                setCheckoutModelData({...pre,show:true});
                console.log("checkoutModelData", checkoutModelData);
            }
          }>
            Checkout
          </div> */}
          
         {(resData?.can_deliver || resData?.can_dinein || resData?.can_pickup) && <div
            className={isIOS ? "cart-btn-ios" : "cart-btn"}
            style={{ width: "60%" }}
            onClick={(pre)=>setCheckoutModelData({...pre,show:true})}
          >
            Checkout
          </div>}
          {!resData?.can_deliver && !resData?.can_dinein && !resData?.can_pickup && (
                      <div
                        className={isIOS ? "cart-btn-ios" : "cart-btn"}
                        style={{
                          width: "80%",
                          fontSize: "20px",
                          padding: "6px 0",
                          marginTop: "20px",
                        }}
                    
                      >
                        Call a Waiter
                      </div>
                    )}
        </div>
      </div>
      <BottomBar />
      <CartVariationModel setModalData={setModalData} modalData={modalData} />
      {calculateTotalPrice() > 0&& 
      
        <Elements stripe={stripePromise}>
          <CheckoutModel setModalData={setCheckoutModelData} modalData={checkoutModelData} totalPrice={calculateTotalPrice()} />
        </Elements>
        }
    </div>
  );
}
