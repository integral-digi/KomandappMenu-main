import { useState, useEffect } from "react";
import "../../style.css";
import OrderDetailsModel from "./orderDetailsModel";
import { set } from "lodash";


export default function OngoingOrderSign () {

    const [ongoingOrders, setOngoingOrders] = useState<any>([]);

    useEffect(() => {
        // const storedOngoingOrders = localStorage.getItem("ongoingOrders");
        // if (storedOngoingOrders) {
        //     const ongoingOrders = JSON.parse(storedOngoingOrders);
        //     if (ongoingOrders) {
        //         ongoingOrders.map((order: any) => {
        //             getOrderStatus(order.order);
        //         });
        //         // setOngoingOrders(JSON.parse(storedOngoingOrders));
        //         console.log("ongoingOrders: ", ongoingOrders);
        //         setOngoingOrders(ongoingOrders);
        //     }
        // }

        // // make this every 5 seconds
        // const interval = setInterval(() => {
        //     const storedOngoingOrders = localStorage.getItem("ongoingOrders");
        //     if (storedOngoingOrders) {
        //         const ongoingOrders = JSON.parse(storedOngoingOrders);
        //         if (ongoingOrders) {
        //             ongoingOrders.map((order: any) => {
        //                 getOrderStatus(order.order);
        //             });
        //             // setOngoingOrders(JSON.parse(storedOngoingOrders));
        //             console.log("ongoingOrders: ", ongoingOrders);
        //             setOngoingOrders(ongoingOrders);
        //         }
        //     }
        // }, 5000);

        
        const interval = setInterval(async () => {
            const storedOngoingOrders = localStorage.getItem("ongoingOrders");
            if (storedOngoingOrders) {
                let ongoingOrdersStorage = JSON.parse(storedOngoingOrders);
                let orderStatusPromises = ongoingOrdersStorage.map((order_hash: any) => getOrderStatusData(order_hash));
                try {
                    let orderStatuses = await Promise.all(orderStatusPromises);
                    console.log("orderStatuses: ", orderStatuses);
                    setOngoingOrders(orderStatuses.filter(status => status !== null)); // Filter out any null values
                } catch (error) {
                    console.error("Error fetching order statuses:", error);
                }
    
            }
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const getOrderStatusData = async (order_hash: any) => {
        const response = await fetch('https://admin.komandapp.com/api/v2/order_status/' + order_hash, {
              method: 'get',
              headers: {
                  'Content-Type': 'application/json',
              },
          });
            const data = await response.json(); 
            console.log("order status: ", data);
            console.log(data.status)
            let storedOngoingOrders = localStorage.getItem("ongoingOrders");
            let newOngoingOrders = storedOngoingOrders ? JSON.parse(storedOngoingOrders) : [];
            if (data.status) {
                if (!newOngoingOrders.includes(order_hash)) {
                    newOngoingOrders.push(order_hash);
                }
                // ongoingOrders.push({
                //     order: data.order_id,
                //     price: data.price,
                //     status: data.data.name
                // });
                
                // check if ongoing orders already has the order
                // if not add it
                // else update the status
                let have = false;
                ongoingOrders.map((orderData: any) => {
                    if (orderData.order == data.order_id) {
                        have = true;
                        orderData.status = data.data.name;
                    }
                });

                return {
                    order: data.order_id,
                    price: data.price,
                    status: data.data.name,
                    order_hash: order_hash
                }

                if (!have) {
                    ongoingOrders.push({
                        order: data.order_id,
                        price: data.price,
                        status: data.data.name
                    });
                }
                


            } else {
                return null;
                newOngoingOrders = newOngoingOrders.filter((orderHash: any) => orderHash != order_hash);
                
            }
            // setOngoingOrders(ongoingOrders);
            console.log(ongoingOrders.length);
            if (newOngoingOrders.length == 0) {
                localStorage.removeItem("ongoingOrders");
            } else {
                localStorage.setItem("ongoingOrders", JSON.stringify(newOngoingOrders));
            }
    }

    const getOrderStatus = async (order: any) => {
        const response = await fetch('https://admin.komandapp.com/api/v2/order_status/' + order, {
              method: 'get',
              headers: {
                  'Content-Type': 'application/json',
              },
          });
            const data = await response.json(); 
            console.log("order status: ", data);
            console.log(data.status)
            let storedOngoingOrders = localStorage.getItem("ongoingOrders");
            let newOngoingOrders = storedOngoingOrders ? JSON.parse(storedOngoingOrders) : [];
            if (data.status) {
                // if (!newOngoingOrders.includes(order)) {
                //     newOngoingOrders.push({
                //         order: order,
                //         status: data.data.name
                //     });
                // }
                // remove order from ongoing orders 
                console.log("newOngoingOrders: ", data.data.name);
                newOngoingOrders.map((orderData: any) => {
                    if (orderData.order == order) {
                        console.log("order: ", order);  
                        orderData.status = data.data.name;
                    }
                });
            } else {
                // remove order from ongoing orders
                newOngoingOrders = newOngoingOrders.filter((orderData: any) => orderData.order != order);
                
            }
            if (newOngoingOrders.length == 0) {
                localStorage.removeItem("ongoingOrders");
            } else {
                localStorage.setItem("ongoingOrders", JSON.stringify(newOngoingOrders));
            }

    }
    const [showOrderDetails, setShowOrderDetails] = useState(false);

    // if (ongoingOrders && ongoingOrders?.length) {
        // console.log("ongoingOrders: ", ongoingOrders);
    // }


    return (
        <>
            {ongoingOrders && ongoingOrders?.length ?
                <div className="ongoingOrderSignInner" onClick={() => setShowOrderDetails(!showOrderDetails)}>
                    <div className="ongoingOrderSignText" style={{ display: "flex", alignItems: "center" }}>
                    <svg width="20px" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" fill="white" />
                        <circle cx="12" cy="12" r="4" fill="red" />
                    </svg>

                        {    ongoingOrders.length > 1 ? 
                                <h3>Multiple ONGOING ORDERS</h3> 
                                : 
                                <h3>ONGOING ORDER #{ongoingOrders[0].order}</h3>
                        }
                    </div>
                </div>
                :
                null
            }

            {showOrderDetails && <OrderDetailsModel showOrderDetails={showOrderDetails} setShowOrderDetails={setShowOrderDetails} ongoingOrders={ongoingOrders} />}
        </>
    );
}

    
