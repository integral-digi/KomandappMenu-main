import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../../main";
import "../../style.css";
import "../../colors.css";

import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { set } from "lodash";

import { Link, useNavigate } from "react-router-dom";

import Toast from "./toast";
import { useAccordionItemState } from "@chakra-ui/react";

// get url paramters 

interface appProps {
  setModalData: any;
  modalData: any;
  totalPrice: any;
}

export default function CheckoutModel({
  setModalData,
  modalData,
  totalPrice,
}: appProps) {
  
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const navigate = useNavigate();
  const { menu, setMenu, cart, restaurant, setCart, resname, resData } =
    useContext(DataContext);
  // console.log("resData: ", resData);
  const [triggerReload, setTriggerReload] = useState(false);
  useEffect(() => {}, [triggerReload]);
  function getCount() {
    let calCount = 0;
    cart.map((item: any, indexItem: number) => {
      if (item.id === modalData?.data?.id && modalData?.index == indexItem) {
        calCount = item.count > 0 ? parseInt(item.count) : 1; // Increase count for the clicked item
      }

      // Keep other items unchanged
    });
    return calCount;
  }
  const [count, setCount] = useState(cart.length > 0 ? getCount() : 1);
  const [checkoutData, setCheckoutData] = useState({
    orderType: null,
    paymentType: null,
    QrSecret: null,
    order: {
      orderNumber: null,
      orderStatus: null,
    },
    // creditCard: {
    //   mobile_number: null,
    //   name: null,
    //   email: null,
    //   address: null,
    //   paymentMethodId: null,
    //   amount: null,
    // },
  });

  const animationVariants = {
    from: { y: 100, opacity: 0 },
    to: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  useEffect(() => {}, [cart]);

  var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window?.MSStream;


  const cashSubmit = async () => {
    if (totalPrice >= resData?.minimum) {
      const response = await fetch('https://admin.komandapp.com/api/v2/client/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            amount: totalPrice,
            orderType: checkoutData.orderType,
            paymentType: 2,
            restaurantName: resname,
            vendor_id: resData?.vendor_id,
            payment_method: 'cod',
            delivery_method: checkoutData.orderType == 2 ? 'delivery' : checkoutData.orderType == 3 ? 'pickup' : 'dinein',
            qr_secret: checkoutData.QrSecret,
            comment: (document.querySelector('input[name="comment"]') as HTMLInputElement)?.value?? '',
            items: cart.map((item: any) => {
                return {
                    id: item.id,
                    count: item.count,
                    extrasSelected: item.extras.map((extra: any) => {
                      return {
                          id: extra,
                      };
                  }),
                };
              }),
        }),
        // send checoutData as body
      });

      const data = await response.json();

      if (data.status) {
        console.log('Success:', data);
        setCheckoutData((pre: any) => ({
            ...pre,
            order: {
                orderNumber: data.id,
                orderStatus: 'preparing',
            },
        }));
        // add order number to local storage ongoing orders array
        let ongoingOrders = JSON.parse(localStorage.getItem('ongoingOrders') ?? '[]');
        console.log('ongoingOrdersprice', totalPrice);

        // ongoingOrders.push({order: data.id, status: 'preparing', price: totalPrice});
        ongoingOrders.push(data.order_hash)
        localStorage.setItem('ongoingOrders', JSON.stringify(ongoingOrders));
        setBackTo(0);

        setTriggerReload(!triggerReload);
      } else if (data.code == 'invalid_qr') {
          // alert('Invalid QR code');

          setToastMessage('Invalid QR code');
          setIsToastVisible(true);
          navigate("/");
      } else {
          // console.log('Error:', data);

          // alert('Error:' + data.message);
          setToastMessage('Error:' + data.message);
          setIsToastVisible(true);
      }
    } else {
      alert('Minimum order value is ' + resData?.currency + resData?.minimum);
    }
  }

  
  const [paymentMethod, setPaymentMethod] = useState(null);
  
  const stripe = useStripe();
  const elements = useElements();



  const handleSubmit = async () => {
    if (!stripe ||!elements) {
        console.error('Stripe or Elements is not available.');
        return;
    }

    try {
      const CardElementVar = elements.getElement(CardElement);

      if (!CardElementVar) {
          console.error('CardElementVar not found');
          return;
      }
      const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: CardElementVar,
      });
      console.log('restaurant', restaurant);
      console.log('resData', resData);
      console.log('resname', resname);
      if (error) {
          console.log('[error]', error);
      } else {
          const name = (document.querySelector('input[name="name"]') as HTMLInputElement)?.value?? '';
          const email = (document.querySelector('input[name="email"]') as HTMLInputElement)?.value?? '';
          const mobile_number = (document.querySelector('input[name="mobile_number"]') as HTMLInputElement)?.value?? '';
          const address = (document.querySelector('input[name="address"]') as HTMLInputElement)?.value?? '';
          const comment = (document.querySelector('input[name="comment"]') as HTMLInputElement)?.value?? '';
          // the above is giving me object is possibly null error
          const paymentMethodId = paymentMethod?.id?? ''; // Provide a default value if paymentMethod.id is null

          // setCheckoutData((pre: any) => ({
          //     ...pre,
          //     creditCard: {
          //         mobile_number,
          //         name,
          //         email,
          //         address,
          //         paymentMethodId,
          //         amount: totalPrice,
          //     },
          // }));

          if (totalPrice >= resData?.minimum) {
          // const response = await fetch('https://admin.komandapp.com/api/v2/checkout', {
            // const response = await fetch('http://localhost:8000/api/checkout', {
              const response = await fetch('https://admin.komandapp.com/api/v2/client/orders', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  name,
                  email,
                  mobile_number,
                  address,
                  paymentMethodId,
                  amount: totalPrice,
                  orderType: checkoutData.orderType,
                  paymentType: checkoutData.paymentType,
                  restaurantName: resname,
                  vendor_id: resData?.vendor_id,
                  payment_method: paymentMethodId ? 'stripe' : 'cod',
                  stripe_token: paymentMethodId,
                  delivery_method: checkoutData.orderType == 2 ? 'delivery' : checkoutData.orderType == 3 ? 'pickup' : 'dinein',
                  qr_secret: checkoutData.QrSecret,
                  comment: comment,
                  items: cart.map((item: any) => {
                      return {
                          id: item.id,
                          count: item.count,
                          extrasSelected: item.extras.map((extra: any) => {
                              return {
                                  id: extra,
                              };
                          }),
                        };
                    }),
              }),
              // send checoutData as body
              


          });

          const data = await response.json();
          // if (data.success) {
            if (data.status) {
              console.log('Success:', data);
              setCheckoutData((pre: any) => ({
                  ...pre,
                  order: {
                      // orderNumber: data.orderNumber,
                      orderNumber: data.id,
                      // orderStatus: data.orderStatus,
                      orderStatus: 'preparing',
                  },
              }));
              // add order number to local storage ongoing orders array
              // let ongoingOrders = JSON.parse(localStorage.getItem('ongoingOrders') ?? '[]');
              let storedOngoingOrders = localStorage.getItem("ongoingOrders");
              let ongoingOrders = storedOngoingOrders ? JSON.parse(storedOngoingOrders) : [];
              console.log('ongoingOrdersprice', totalPrice);

              // ongoingOrders.push({order: data.id, status: 'preparing', price: totalPrice});
              ongoingOrders.push(data.order_hash)
              console.log('ongoingOrders', ongoingOrders);
              localStorage.setItem('ongoingOrders', JSON.stringify(ongoingOrders));
              setBackTo(0);

              setTriggerReload(!triggerReload);

          } else if (data.code == 'invalid_qr') {
              // alert('Invalid QR code');
              setToastMessage('Invalid QR code');
              setIsToastVisible(true);
              navigate("/");
          } else {
              // console.log('Error:', data);
              // alert('Error:' + data.message);
              setToastMessage('Error:' + data.message);
              setIsToastVisible(true);
          }

        } else {
          alert('Minimum order value is ' + resData?.currency + resData?.minimum);
        }
      }
    } catch (error) {
        console.log('Error:', error);
    }
  };

  const setDineIn = (value: boolean) => {
    
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const s = urlParams.get('s');
    if (s) {
      setCheckoutData((pre: any) => ({
        ...pre,
        orderType: 1,
        QrSecret: s,
      }));
    } else {
      navigate("/");
    }

  }

  const [backTo, setBackTo] = useState(0);

  const goBack = () => {
    if (backTo == 1) {
      setCheckoutData((pre: any) => ({
        ...pre,
        orderType: null,
      }));
      setBackTo(0);
    } else if (backTo == 2) {
      setCheckoutData((pre: any) => ({
        ...pre,
        paymentType: null,
      }));
      setBackTo(1);
    }
  }



  return (
    <>
    
    <Toast isVisible={isToastVisible} message={toastMessage} setIsVisible={setIsToastVisible} />
      {modalData.show && (
        <div className="variation-container">
          <motion.div
            variants={animationVariants}
            animate="to"
            initial="from"
            className="variations"
            style={{height:"auto"}}
          >
            <div
              className="variation-inner"
              onClick={(event) => {
                event.stopPropagation();
              }}
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "hsla(0, 0%, 22%, 0.99)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "1px solid gray",
                }}
              >
              { backTo ? 
                <>
                <div
                  style={{
                    // width: "80%",
                    fontSize: "20px",
                    // padding: "6px 0",
                    position: "relative",
                    // bottom: "5px",
                    top: "0"
                  }}
                  onClick={() => {
                    goBack();
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="white" viewBox="0 0 1024 1024"><path fill="#ffffff" d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"/><path fill="#ffffff" d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"/></svg>
                </div>
                </>
                : 
                null
              }
                <h1
                  // className={isIOS ? "cart-title-ios" : "cart-title"}
                  style={{
                    width: "90%",
                    textAlign: "center",
                    fontWeight: "600",
                    color: checkoutData.order.orderNumber == null ? "white" : "var(--primary-color)",
                  }}
                >
                  {checkoutData?.orderType == null && checkoutData?.order.orderNumber == null &&  "Order Type"}
                  {checkoutData?.orderType != null &&
                    checkoutData?.order.orderNumber == null && checkoutData?.paymentType == null && "Payment Type"}
                  {checkoutData?.order.orderNumber != null && "Order #" + checkoutData?.order?.orderNumber}
                </h1>
                <div
                  className="variation-close-btn"
                  style={{ height: "5%", minHeight: "20px", zIndex: "5" }}
                  onClick={() => {
                    setModalData((pre: any) => ({ ...pre, show: false }));
                  }}
                >
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={() => {
                      setModalData((pre: any) => ({ ...pre, show: false }));
                    }}
                  >
                    <path
                      d="M26.7656 11.7656C27.7422 10.7891 27.7422 9.20312 26.7656 8.22656C25.7891 7.25 24.2031 7.25 23.2266 8.22656L15 16.4609L6.76563 8.23437C5.78906 7.25781 4.20313 7.25781 3.22656 8.23437C2.25 9.21094 2.25 10.7969 3.22656 11.7734L11.4609 20L3.23438 28.2344C2.25781 29.2109 2.25781 30.7969 3.23438 31.7734C4.21094 32.75 5.79688 32.75 6.77344 31.7734L15 23.5391L23.2344 31.7656C24.2109 32.7422 25.7969 32.7422 26.7734 31.7656C27.75 30.7891 27.75 29.2031 26.7734 28.2266L18.5391 20L26.7656 11.7656Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>

              <div
                style={{
                  maxHeight: checkoutData.order.orderNumber == null ? "450px" : "500px",
                  overflowY: "scroll",
                  zIndex: "4",
                  height: checkoutData.order.orderNumber == null ? "70%" : "80% ",
                  display: "flex",
                  justifyContent:
                    checkoutData.order == null ? "center" : "flex-start",
                  alignItems: "start",
                  padding: "40px 0",
                }}
              >
                
                {checkoutData.orderType == null && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                      // marginTop: "30px",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    {resData?.can_dinein ==1 && (
                      <div
                        className={isIOS ? "cart-btn-ios" : "cart-btn"}
                        style={{
                          width: "80%",
                          fontSize: "20px",
                          padding: "6px 0",
                        }}
                        onClick={() => {
                          // setCheckoutData((pre: any) => ({
                          //   ...pre,
                          //   orderType: 1,

                          // }));
                          setDineIn(true);
                          setBackTo(1);
                        }}
                      >
                        Dine In
                      </div>
                    )}
                    
                    {resData?.can_deliver==1 && 
                      <div
                        className={isIOS ? "cart-btn-ios" : "cart-btn"}
                        style={{
                          width: "80%",
                          fontSize: "20px",
                          padding: "6px 0",
                          marginTop: "20px",
                        }}
                        onClick={() => {
                          setCheckoutData((pre: any) => ({
                            ...pre,
                            orderType: 2,
                      
                          }));
                          setBackTo(1);
                        }}
                      >
                        Delivery
                      </div>
                    }
                    {resData?.can_pickup==1 &&
                      <div className={isIOS ? "cart-btn-ios" : "cart-btn"} style={{width:"80%", fontSize:"20px", padding:"6px 0", marginTop:"20px"}} onClick={() => {
                        setCheckoutData((pre: any) => ({
                          ...pre,
                          orderType: 3,
                        }));
                        setBackTo(1);
                      }}>
                        Pickup
                      </div>
                    }
                    {!resData?.can_deliver && !resData?.can_dinein && !resData?.can_pickup && (
                      <div
                        className={isIOS ? "cart-btn-ios" : "cart-btn"}
                        style={{
                          width: "80%",
                          fontSize: "20px",
                          padding: "6px 0",
                          marginTop: "20px",
                        }}
                        onClick={() => {
                          setCheckoutData((pre: any) => ({
                            ...pre,
                            orderType: 2,
                          }));

                        }}
                      >
                        Call a Waiter
                      </div>
                    )}
                  </div>
                )}
                {checkoutData.orderType != null && checkoutData?.order?.orderNumber == null &&
                  checkoutData?.paymentType == null && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                        // marginTop: "30px",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      {/* back button */}
                      {resData?.stripe_account && (
                        <div
                          className={isIOS ? "cart-btn-ios" : "cart-btn"}
                          style={{
                            width: "80%",
                            fontSize: "20px",
                            padding: "6px 0",
                          }}
                          onClick={() => {
                            setCheckoutData((pre: any) => ({
                              ...pre,
                              paymentType: 1,
                            }));
                            setBackTo(2);
                          }}
                        >
                          Credit Card
                        </div>
                      )}
                      {/* if ordertype == 1 */}
                      {checkoutData.orderType == 1 && (
                        <div
                          className={isIOS ? "cart-btn-ios" : "cart-btn"}
                          style={{
                            width: "80%",
                            fontSize: "20px",
                            padding: "6px 0",
                            marginTop: "20px",
                          }}
                          onClick={() => {
                            setCheckoutData((pre: any) => ({
                              ...pre,
                              paymentType: 2,
                              // order: {
                              //   orderNumber: "001",
                              //   orderStatus: "preparing",
                              // },
                            }));
                            // setBackTo(2);
                            // setModalData((pre: any) => ({ ...pre, show: false }));
                            cashSubmit();
                          }}
                        >
                          Cash
                        </div>
                      )}
                    </div>
                  )}

                  {checkoutData.orderType != null && checkoutData?.order?.orderNumber == null &&
                    checkoutData?.paymentType == 1 && (
                      
                    <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                      // marginTop: "30px",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    {/* back button */}
                    {/* <div
                      className={isIOS ? "cart-btn-ios" : "cart-btn"}
                      style={{
                        width: "80%",
                        fontSize: "20px",
                        padding: "6px 0",
                      }}
                      onClick={() => {
                        setCheckoutData((pre: any) => ({
                          ...pre,
                          paymentType: null,
                        }));
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="white" viewBox="0 0 1024 1024"><path fill="#ffffff" d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"/><path fill="#ffffff" d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"/></svg>
                    </div> */}
                    

                      
                      <form className="stripe-form" style={{width:"100%"}}>
                        
                        <div className="checkout-input">
                            <input placeholder="Mobile Number" name="mobile_number" style={{width:"100%"}}></input>
                        </div>
                        <div className="checkout-input">
                            <input placeholder="Name" name="name" style={{width:"100%"}}></input>
                        </div>
                        <div className="checkout-input">
                            <input placeholder="Email" name="email" style={{width:"100%"}}></input>
                        </div>

                        {/* if ordertype is dinein or pickupt don't ask for addresss */}
                        {checkoutData.orderType == 2 && (
                          <div className="checkout-input">
                            <input placeholder="Address" name="address" style={{width:"100%"}}></input>
                          </div>
                        )}


                        
                          { checkoutData.orderType != 1 && (
                        <div className="checkout-input">
                            <input placeholder="Comment" name="comment" style={{width:"100%"}}></input>
                        </div>
                          )}

                        <input type="hidden" name="amount" value={totalPrice} />

                        <input type="hidden" name="pm" value={paymentMethod?? ''} />

                        <div style={{marginTop:"20px"}}>
                          <CardElement />
                        </div>
                        {/* <button type="submit" disabled={!stripe}>
                            Pay
                        </button> */}
                    </form>
                  </div>
                  )}

                {checkoutData.orderType != null && checkoutData?.order?.orderNumber == null &&
                    checkoutData?.paymentType == 2 && (
                      
                      
                    <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                      // marginTop: "30px",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >


{/*                       
                      <form className="cash-form" style={{width:"100%"}}>

                        <div className="checkout-input">
                            <input placeholder="Comment" name="comment" style={{width:"100%"}}></input>
                            </div>
                        </form> */}

                  </div>
                  )}
                {checkoutData?.order?.orderNumber != null && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "left",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_9_457)">
                          <path
                            d="M10 20C12.6522 20 15.1957 18.9464 17.0711 17.0711C18.9464 15.1957 20 12.6522 20 10C20 7.34784 18.9464 4.8043 17.0711 2.92893C15.1957 1.05357 12.6522 0 10 0C7.34784 0 4.8043 1.05357 2.92893 2.92893C1.05357 4.8043 0 7.34784 0 10C0 12.6522 1.05357 15.1957 2.92893 17.0711C4.8043 18.9464 7.34784 20 10 20ZM10 6.25C10.9946 6.25 11.9484 6.64509 12.6517 7.34835C13.3549 8.05161 13.75 9.00544 13.75 10C13.75 10.9946 13.3549 11.9484 12.6517 12.6517C11.9484 13.3549 10.9946 13.75 10 13.75C9.00544 13.75 8.05161 13.3549 7.34835 12.6517C6.64509 11.9484 6.25 10.9946 6.25 10C6.25 9.00544 6.64509 8.05161 7.34835 7.34835C8.05161 6.64509 9.00544 6.25 10 6.25Z"
                            fill="white"
                          />
                          <circle cx="10" cy="10" r="4" fill="#14FF00" />
                        </g>
                        <defs>
                          <clipPath id="clip0_9_457">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>

                      <h1 style={{ marginLeft: "10px" }}>Preparing...</h1>
                    </div>
                    <div>
                      <h2> products:</h2>
                    </div>
                    {cart?.map((item: any, index: number) => {
                      return (
                        <div style={{ display: "flex" }}>
                          <div style={{ display: "flex" }}>
                            <h3
                              style={{
                                background: "gray",
                                padding: "2px 6px",
                                borderRadius: "50%",
                                marginRight: "10px",
                                textAlign: "center",
                              }}
                            >
                              {item?.count}
                            </h3>
                            <h2>{item?.title}</h2>
                          </div>

                          {/* <div style={{ display: "flex" }}>
                            <h3
                              style={{
                                color: "gray",
                              }}
                            >
                              {item?.price}
                            </h3>
                          </div> */}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div
                style={{
                  bottom: "20px",
                  width: "100%",
                  background: "#383838fc",
                  zIndex: "5",
                  borderTop: "1px solid gray",
                  minHeight: "100px",
                  height: "20%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    marginTop: "1rem",
                    justifyContent: "space-between",
                  }}
                >
                  <h5
                    // className={isIOS ? "cart-title-ios" : "cart-title"}
                    style={{ margin: "0" }}
                  >
                    Shipping fee
                  </h5>
                  <h5
                    // className={isIOS ? "cart-title-ios" : "cart-title"}
                    style={{ margin: "0" }}
                  >
                    {resData?.currency}{resData?.delivery_fee ? resData?.delivery_fee : 0}
                  </h5>
                </div>
                <div
                  style={{
                    display: "flex",
                    marginTop: "1rem",
                    justifyContent: "space-between",
                  }}
                >
                  <h5
                    // className={isIOS ? "cart-title-ios" : "cart-title"}
                    style={{ margin: "0" }}
                  >
                    Product
                  </h5>
                  <h5
                    // className={isIOS ? "cart-title-ios" : "cart-title"}
                    style={{ margin: "0" }}
                  >
                    {resData?.currency}{totalPrice}
                  </h5>
                </div>
                <div
                  style={{
                    display: "flex",
                    marginTop: "1rem",
                    justifyContent: "space-between",
                  }}
                >
                  <h5
                    className={isIOS ? "cart-title-ios" : "cart-title"}
                    style={{ margin: "0" }}
                  >
                    Subtotal
                  </h5>
                  <h5
                    className={isIOS ? "cart-title-ios" : "cart-title"}
                    style={{ margin: "0" }}
                  >
                    {resData?.currency}
                    {Number(totalPrice) +
                      (resData?.delivery_fee
                        ? Number(resData?.delivery_fee)
                        : 0)}
                  </h5>
                </div>

                {checkoutData?.order?.orderNumber == null && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                      marginTop: "30px",
                    }}
                  >
                    <div
                      className={isIOS ? "cart-btn-ios" : "cart-btn"}
                      style={{ width: "80%" }}
                      // onClick={handleSubmit}
                      onClick={checkoutData?.paymentType == 1 ? handleSubmit : cashSubmit}
                    >
                      Pay Now
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
