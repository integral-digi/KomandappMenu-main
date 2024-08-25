import { position } from "@chakra-ui/react";
import { set } from "lodash";
import { useState, useEffect } from "react";

interface appProps {
    showOrderDetails: boolean;
    setShowOrderDetails: any;
    ongoingOrders: any[];
  }

export default function OrderDetailsModel(
    { showOrderDetails, setShowOrderDetails, ongoingOrders } : appProps) {
        const [productsPrice, setProductsPrice] = useState<number>(0);
        const [orderDetails, setOrderDetails] = useState<any>(null);
        const [orders, setOrders] = useState<any>(null);

    useEffect(() => {
        // const ongoingOrders = JSON.parse(localStorage.getItem("ongoingOrders"));
        // const storedOngoingOrders = localStorage.getItem("ongoingOrders");
        // const ongoingOrders = storedOngoingOrders ? JSON.parse(storedOngoingOrders) : [];
        if (ongoingOrders) {
            if (ongoingOrders.length > 1) {
                setOrders(ongoingOrders);
            } else {
                getOrderDetails(ongoingOrders[0].order_hash);
            }
        }


    }, []);



    // const getOrderDetails = (order: any) => {
    const getOrderDetails = async (order: any) => {
        console.log("order: ", order);
        
        const response = await fetch('https://admin.komandapp.com/api/v2/order/' + order, {
              method: 'get',
              headers: {
                  'Content-Type': 'application/json',
              },
          });
            const data = await response.json(); 
            console.log("order details: ", data);
            
            data.data.items.map((item: any) => {
                console.log("item: ", item);
                setProductsPrice(productsPrice + item.pivot.variant_price * item.pivot.qty);
            });
            
            setOrderDetails(data.data);
            return data.data;

    }


    return (
        <>
            <div className="variation-container">
                <div className="variations">
                    <div className="variation-inner" style={{backgroundColor: "#000000fc", overflow: "scroll", height: "100vh"}}>
                    {/* style="display: flex; justify-content: space-between; border-bottom: 1px solid gray;"> */}
                        <div className="variation-inner-top" style={{display: "flex", justifyContent: "space-between", borderBottom: "1px solid gray"}}>
                            {/* if ongoingorder > 1 and there is orderDetails add back button */}
                            {ongoingOrders && ongoingOrders.length > 1 && orderDetails ?
                            
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
                                setOrderDetails(null);
                                setProductsPrice(0);}}
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="white" viewBox="0 0 1024 1024"><path fill="#ffffff" d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"/><path fill="#ffffff" d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"/></svg>
                            </div>: 
                            null}
                            <div className="variation-inner-top-left" style={{margin: "auto", left: "2%", position: "relative"}}>
                                {/* <h3>Ongoing Orders</h3> */}
                                {orderDetails ?
                                    <h1>Order #{orderDetails?.id}</h1>
                                    :
                                    
                                    <h1>Orders</h1>
                                }
                            </div>
                            {/* close button */}
                            <div className="close-btn" onClick={() => setShowOrderDetails(!showOrderDetails)}>

                                <svg
                                    width="30"
                                    height="30"
                                    viewBox="0 0 30 40"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                    d="M26.7656 11.7656C27.7422 10.7891 27.7422 9.20312 26.7656 8.22656C25.7891 7.25 24.2031 7.25 23.2266 8.22656L15 16.4609L6.76563 8.23437C5.78906 7.25781 4.20313 7.25781 3.22656 8.23437C2.25 9.21094 2.25 10.7969 3.22656 11.7734L11.4609 20L3.23438 28.2344C2.25781 29.2109 2.25781 30.7969 3.23438 31.7734C4.21094 32.75 5.79688 32.75 6.77344 31.7734L15 23.5391L23.2344 31.7656C24.2109 32.7422 25.7969 32.7422 26.7734 31.7656C27.75 30.7891 27.75 29.2031 26.7734 28.2266L18.5391 20L26.7656 11.7656Z"
                                    fill="white"
                                    />
                                </svg>         
                            </div>
                        </div>
                        {/* <div className="variation-inner-bottom">
                            <div className="variation-inner-bottom-left">
                                <div className="variation-inner-bottom-left-inner">
                                    <h3>Item</h3>
                                    <h3>Price</h3>
                                </div>
                            </div>
                            <div className="variation-inner-bottom-right">
                                <div className="variation-inner-bottom-right-inner">
                                    <h3>Qty</h3>
                                    <h3>Total</h3>
                                </div>
                            </div>
                        </div> */}
                        
                        {orderDetails ? 
                            <div className="order-details">
                                {/* <div className="order-info" style={{display: "flex", justifyContent: "space-between", borderBottom: "1px solid gray"}}>
                                    <div className="order-info-inner-left">
                                        <h3>Order</h3>
                                    </div>
                                    <div className="order-info-inner-right">
                                        <h3>{orderDetails?.id}</h3>
                                    </div>
                                </div> */}
                                <div className="order-status" style={{display: "flex", marginBottom: "20px", marginTop: "10px"}}>
                                    {/* <div className="order-status-inner-left">
                                        <h3>Status</h3>
                                    </div>
                                    <div className="order-status-inner-right">
                                        <h3>{orderDetails?.last_status[0].name}</h3>
                                    </div> */}
                                    <svg width="20px" height="20px" style={{position: "relative", top: "0.5rem"}} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_9_457)"><path d="M10 20C12.6522 20 15.1957 18.9464 17.0711 17.0711C18.9464 15.1957 20 12.6522 20 10C20 7.34784 18.9464 4.8043 17.0711 2.92893C15.1957 1.05357 12.6522 0 10 0C7.34784 0 4.8043 1.05357 2.92893 2.92893C1.05357 4.8043 0 7.34784 0 10C0 12.6522 1.05357 15.1957 2.92893 17.0711C4.8043 18.9464 7.34784 20 10 20ZM10 6.25C10.9946 6.25 11.9484 6.64509 12.6517 7.34835C13.3549 8.05161 13.75 9.00544 13.75 10C13.75 10.9946 13.3549 11.9484 12.6517 12.6517C11.9484 13.3549 10.9946 13.75 10 13.75C9.00544 13.75 8.05161 13.3549 7.34835 12.6517C6.64509 11.9484 6.25 10.9946 6.25 10C6.25 9.00544 6.64509 8.05161 7.34835 7.34835C8.05161 6.64509 9.00544 6.25 10 6.25Z" fill="white"></path><circle cx="10" cy="10" r="4" fill="#14FF00"></circle></g><defs><clipPath id="clip0_9_457"><rect width="20" height="20" fill="white"></rect></clipPath></defs></svg>
                      
                                    
                      <h1 style={{ marginLeft: "10px" }}>{orderDetails?.last_status[0].name}...</h1>
                                </div>
                                {/* <div className="order-items" style={{display: "flex", justifyContent: "space-between", borderBottom: "1px solid gray"}}>
                                    <div className="order-items-inner-left">
                                        <h3>Item</h3>
                                    </div>
                                    <div className="order-items-inner-right">
                                        <h3>Qty</h3>
                                    </div>
                                </div> */}
                                                                        {/* <div className="order-items" style={{display: "flex", justifyContent: "space-between", borderBottom: "1px solid gray"}}>

                                {orderDetails?.items.map((item: any) => {
                                    return (
                                        <div key={item.pivot.item_id} style={{display: "flex", justifyContent: "space-between", borderBottom: "1px solid gray"}}>
                                            <div className="order-items-inner-left">
                                                <h3>{item.name} X</h3>
                                            </div>
                                            <div className="order-items-inner-right">
                                                <h3> {item.pivot.qty}</h3>
                                            </div>
                                        </div>
                                    )
                                })}
                                                                        </div> */}
                    <div>
                      <h2> {orderDetails?.items.length} Products:</h2>
                    </div>
                    {orderDetails?.items.map((item: any, index: number) => {
                      return (
                        <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: "20px"}} key={index}>
                          <div style={{ display: "flex", marginRight: "10px" }}>
                            <h3
                              style={{
                                background: "gray",
                                padding: "2px 6px",
                                borderRadius: "50%",
                                marginRight: "10px",
                                textAlign: "center",
                              }}
                            >
                              {item?.pivot?.qty}
                            </h3>
                            <h2>{item?.name}</h2>
                          </div>
                          
                          <div style={{ display: "flex" }}>
                            <h3
                              style={{
                                color: "gray",
                              }}
                            >
                              ${item?.pivot.variant_price * item?.pivot.qty}
                            </h3>
                          </div>

                        </div>
                      );
                    })}


<div className="order-price" style={{display: "flex", bottom: "0", justifyContent: "space-around", borderBottom: "1px solid gray", position: "absolute", flexDirection: "column", width: "100%"}}>

                        {orderDetails?.table_id && orderDetails?.table && (
                            <div className="order-price" style={{display: "flex", justifyContent: "space-between", padding: "0 50px 0 0", width: "100%", marginBottom: "20px", color: "gray"}}>
                                <div className="order-shipping-inner-left">
                                    <h3>Table</h3>
                                </div>
                                <div className="order-shipping-inner-right">
                                    <h3>{orderDetails?.table.name}</h3>
                                </div>
                            </div>
                        )}
                        
                        <div className="order-price" style={{display: "flex", justifyContent: "space-between", padding: "0 50px 0 0", width: "100%"}}>
                                <div className="order-shipping-inner-left">
                                    <h3>Products</h3>
                                </div>
                                <div className="order-shipping-inner-right">
                                    <h3>${productsPrice}</h3>
                                </div>
                            </div>
                            {/* shipping fee */}
                            <div className="order-price" style={{display: "flex", justifyContent: "space-between", padding: "0 50px 0 0", width: "100%"}}>
                                <div className="order-shipping-inner-left">
                                    <h3>Shipping Fee</h3>
                                </div>
                                <div className="order-shipping-inner-right">
                                    <h3>${orderDetails?.shipping_fee? orderDetails?.shipping_fee: 0}</h3>
                                </div>
                            </div>
                    
                            <div className="order-price" style={{display: "flex", justifyContent: "space-between", padding: "0 50px 0 0", width: "100%"}}>
                                <div className="order-price-inner-left">
                                        <h1>Total</h1>
                                    </div>
                                    <div className="order-price-inner-right">
                                        <h1>${orderDetails?.order_price}</h1>
                                    </div>
                                </div>

                            </div>
                            </div>
                                
                            :

                            orders ?
                            
                                orders.map((order: any) => {
                                        return (
                                            <div key={order} style={{display: "flex", justifyContent: "space-between", cursor: "pointer", padding: "10px", backgroundColor: "#1E1E1E", borderRadius: "10px", marginTop: "10px"
                                            }} onClick={() => getOrderDetails(order.order_hash)}>
                                                <div style={{display: "flex", flexDirection: "column", width: "100%", justifyContent: "center"}}>
                                                    {/* <div>{order}</div> */}
                                                    <h2>Order #{order.order}</h2>
                                                    <div style={{display: "flex", justifyContent: "space-between"}}>
                                                        <div style={{display: "flex", alignItems: "center"}}>
                                                            <svg width="20px" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <circle cx="12" cy="12" r="10" fill="white" />
                                                                <circle cx="12" cy="12" r="4" fill="red" />
                                                            </svg>
                                                            <h3 style={{position: "relative", top: "0.3rem"}}>{order.status}.....</h3>
                                                        </div>
                                                        <h3>${order.price}</h3>
                                                    </div>
                                                </div>

                                            </div>
                                    )
                                }
                                )
                                
                            :
                            <div></div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
