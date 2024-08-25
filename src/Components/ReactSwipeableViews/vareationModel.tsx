import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { DataContext } from "../../main";

interface appProps {
  variantData: any;
  setVariantData?: any;
}
export default function VariationModel({
  variantData,
  setVariantData,
}: appProps) {
  const { menu, setMenu, cart, setCart, resname, resData } = useContext(DataContext);
  function getCount() {
    let calCount = 0;
    cart.map((item: any,indexItem:number) => {
      if (item.id === variantData?.data?.dishId && (cart.length-1)==indexItem) {
        calCount = item.count > 0 ? parseInt(item.count) : 1; // Increase count for the clicked item
      }

      // Keep other items unchanged
    });
    return calCount;
  }
  const [count, setCount] = useState(cart.length > 0 ? getCount() : 1);
  const onChangeRadio = (itemId: any,radioIndex: any) => {
    // setCount(count+1)
    const updatedCartItems = cart.map((item: any,indexItem:number) => {
      if (item.id == variantData?.data?.dishId && (cart.length-1)==indexItem) {

        return { ...item,
          variants: radioIndex,
        }; // Increase count for the clicked item
      }
      return item; // Keep other items unchanged
    });
    setCart(updatedCartItems);
    console.log("cart: ", cart);
    sessionStorage.setItem(resname, JSON.stringify(updatedCartItems));
  };

  const addPrice = (itemId: any, price: number) => {
    console.log("addPrice!!!", variantData?.data?.dishId);
    // setCount(count+1)
    const updatedCartItems = cart.map((item: any,indexItem:number) => {
      if (item.id == variantData?.data?.dishId && (cart.length-1)==indexItem) {
        console.log("found!!!");
        setVariantData((pre: any) => ({
          ...pre,
          data: { ...pre.data, add_price: pre.data.add_price + price },
        }));
        // alert(item.extras)
        return { ...item, add_price: item.add_price + price ,
          extras: item.extras ? [...item.extras, itemId] : [itemId],
        }; // Increase count for the clicked item
      }
      return item; // Keep other items unchanged
    });
    setCart(updatedCartItems);
    console.log("cart: ", cart);
    sessionStorage.setItem(resname, JSON.stringify(updatedCartItems));
  };

  const subPrice = (itemId: any, price: number) => {
    console.log("subPrice!!!");
    // setCount(count+1)
    const updatedCartItems = cart.map((item: any,indexItem:number) => {
      if (item.id === variantData?.data?.dishId && (cart.length-1)==indexItem) {
        setVariantData((pre: any) => ({
          ...pre,
          data: { ...pre.data, add_price: pre.data.add_price - price },
        }));
        return { ...item, add_price: item.add_price - price,
          extras: item.extras ? item.extras.filter((id:number) => id !== itemId) : [], // Remove itemId if extras exists

         }; // Increase count for the clicked item
      }
      return item; // Keep other items unchanged
    });
    setCart(updatedCartItems);
    console.log("cart: ", cart);
    sessionStorage.setItem(resname, JSON.stringify(updatedCartItems));
  };

  const handleIncrement = (itemId:any) => {
    if(count>=98){
      return
    }
    setCount(count+1)
    // setVariantData((pre:any)=>({...pre,show:true,data:{...pre.data,dishId,heading,description,allergens,variants,extras,price}}))
    const updatedCartItems = cart.map((item:any,indexItem:number) => {
      
      if (item.id === itemId,(cart.length-1)==indexItem) {
        return { ...item, count: item.count + 1 }; // Increase count for the clicked item
      }
      return item; // Keep other items unchanged
    });
    setCart(updatedCartItems);
    console.log("cart: ",cart);
    sessionStorage.setItem(resname, JSON.stringify(updatedCartItems));
  };

  const handleDecrement = (itemId:any) => {
    if(getCount()>1){
      setCount(count-1)
    const updatedCartItems = cart.map((item:any,indexItem:number) => {
    if (item.id === itemId,(cart.length-1)==indexItem) {
        return { ...item, count: Math.max(item.count - 1, 0) }; // Ensure count doesn't go below 0
    }
    
    return item; // Keep other items unchanged
    });
    setCart(updatedCartItems);
    sessionStorage.setItem(resname, JSON.stringify(updatedCartItems));
    }
    else{
      // alert(" i am here "+count)
      setCount(0)
      
        const updatedCartItems = cart.filter((item:any,indexItem:number) => {
            if (item.id === itemId,(cart.length-1)==indexItem) {
            // If count reaches 0, remove the item
            // setIsCart(false);
            return item.count > 1 ? { ...item, count: item.count - 1 } : false;
            }
            return item; // Keep other items unchanged
        });
        
        setCart(updatedCartItems);
        sessionStorage.setItem(resname, JSON.stringify(updatedCartItems));
        setVariantData((pre: any) => ({ ...pre, show: false }));
    }
    };

  const animationVariants = {
    from: { y: 100, opacity: 0 },
    to: { y: 0, opacity: 1, transition: { duration: 0.5 } },
    // transition: { duration: 0.5, ease: 'easeInOut' }, // Customize as desired
  };
  var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window?.MSStream;

  return (
    <>
      {variantData.show && (
        <div className="variation-container">
          <motion.div
            variants={animationVariants}
            animate="to"
            initial="from"
            className="variations"
          >
            <div
              className="variation-inner"
              onClick={(event) => {
                // handleChildClick();
                event.stopPropagation();
              }}
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "hsla(0, 0%, 22%, 0.99)",
              }}
            >
              <div
                className="variation-close-btn"
                style={{height:"5%",minHeight:'15px',zIndex:"5"}}
                onClick={() => {
                  setVariantData((pre: any) => ({ ...pre, show: false }));
                }}
              >
                <svg
                  width="30"
                  height="40"
                  viewBox="0 0 30 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={() => {
                    setVariantData((pre: any) => ({ ...pre, show: false }));
                  }}
                >
                  <path
                    d="M26.7656 11.7656C27.7422 10.7891 27.7422 9.20312 26.7656 8.22656C25.7891 7.25 24.2031 7.25 23.2266 8.22656L15 16.4609L6.76563 8.23437C5.78906 7.25781 4.20313 7.25781 3.22656 8.23437C2.25 9.21094 2.25 10.7969 3.22656 11.7734L11.4609 20L3.23438 28.2344C2.25781 29.2109 2.25781 30.7969 3.23438 31.7734C4.21094 32.75 5.79688 32.75 6.77344 31.7734L15 23.5391L23.2344 31.7656C24.2109 32.7422 25.7969 32.7422 26.7734 31.7656C27.75 30.7891 27.75 29.2031 26.7734 28.2266L18.5391 20L26.7656 11.7656Z"
                    fill="white"
                  />
                </svg>
              </div>
              <h4 className={isIOS?"cart-title-ios":"cart-title"} style={{height:"5%",minHeight:'20px'}}>{variantData?.data?.heading}</h4>
              {/* <p style={{color:"#C5C5C5", fontSize:"16px"}}>{variantData?.data?.description}</p> */}
              {/* <div style={{ display: "flex"}} >
                {variantData?.data?.allergens?.map((item: any) => (
                  <div
                    style={{
                      display: "flex",
                      width: "50%",
                      gap: "10px",
                      marginBottom: "5px",
                      alignItems: "center",
                    }}
                  >
                    <img
                      style={{ width: "30px", height: "30px" }}
                      src={"https://admin.komandapp.com/" + item?.icon_path}
                    />

                  </div>
                ))}
              </div> */}
              <div style={{display:"flex", maxHeight: "450px", overflowY: "scroll",zIndex:"4",height:"70%" }}>
                {
                // Array(getCount())
                //   .fill(1)
                //   .map((countItem,countIndex:number) => {
                //     return (
                      <>
                        <div>
                          {variantData?.data?.extras.length > 0 && (
                            <div className={isIOS?"variation-tag-ios":"variation-tag"}>EXTRAS</div>
                          )}
                          {/* {
                            variantData?.data?.extras?.map((item:any)=>{
                            return(
                                <div style={{display:"flex",alignItems:"center"}}>
                                <input type="checkbox" id={item?.id} name={item?.name} value={item?.id} style={{width:"50px",fontSize:"20px"}} />

                                <label htmlFor={item?.id} style={{padding:"0 5px",fontSize:"20px"}}>
                                {item?.name} - {resData?.currency}{item?.price}
                                </label>
                                
                                </div>
                                
                                )
                                })
                            } */}
                          {variantData?.data?.extras?.map((item: any) => {
                            const handleChange = (
                              event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              const isChecked = event.target.checked;

                              if (isChecked) {
                                addPrice(item.id, item.price); // Call addPrice() on select
                              } else {
                                subPrice(item.id, item.price); // Call sebPrice() on unselect
                              }
                            };

                            return (
                              <div
                                key={item.id}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <input
                                className={isIOS?"normalText-ios":"normalText"}
                                  type="checkbox"
                                  id={item.id}
                                  name={item.name}
                                  value={item.id}
                                  style={{ width: "50px",
                                  //  fontSize: "16px"
                                   }}
                                  onChange={handleChange}
                                />
                                <label
                                className={isIOS?"normalText-ios":"normalText"}
                                  htmlFor={item.id}
                                  style={{ padding: "0 3px", 
                                  // fontSize: "16px" 
                                }}
                                >
                                  {item.name} - {resData?.currency}{item.price}
                                </label>
                              </div>
                            );
                          })}

                          {variantData?.data?.variants.length > 0 && (
                            <div className={isIOS?"variation-tag-ios":"variation-tag"}>VARIATIONS</div>
                          )}
                          {variantData?.data?.variants?.map(
                            (item: any, index: number) => {
                              return (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <input
                                    type="radio"
                                    className={isIOS?"normalText-ios":"normalText"}
                                    id={item?.id}
                                    name={"variants"}
                                    value={item?.id}
                                    style={{ width: "50px", fontSize: "16px" }}
                                    defaultChecked={index == 0 ? true : false}
                                    onChange={()=>onChangeRadio(item?.id,index)}
                                  />
                                  <label
                                  className={isIOS?"normalText-ios":"normalText"}
                                    htmlFor={item?.id}
                                    style={{
                                      padding: "0 3px",
                                      // fontSize: "16px",
                                    }}
                                  >
                                    {Object.values(
                                      JSON.parse(item?.options)
                                    )[0] + ""}
                                  </label>
                                </div>
                              );
                            }
                          )}
                          {/* <hr/> */}
                        </div>
                      </>
                  //   );
                  // })
                  }
              </div>
              <div
                style={{ bottom: "20px", width: "100%",background:"#383838",zIndex:"5",minHeight:"100px",borderTop:"1px solid gray",height:"20%" }}
              >
                <div
                  style={{
                    display: "flex",
                    marginTop: "1rem",
                    justifyContent: "space-between",
                  }}
                >
                  <h5 className={isIOS?"cart-title-ios":"cart-title"} style={{ margin: "0" }}>
                    {resData?.currency}{((variantData?.data?.price*getCount())+(variantData?.data?.add_price*getCount())).toFixed(2)}
                  </h5>
                  <div
                    className="add-cart-count"
                    style={{
                      backgroundColor: "gray",
                      borderRadius: "12px",
                      padding: "4px 6px",
                    }}
                  >
                    <div className="remove-button" 
                      onClick={()=>{handleDecrement(variantData?.data?.dishId)}}
                    >
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
                    </div>
                    <h5
                    className={isIOS?"cart-title-ios":"cart-title"}
                      style={{
                        padding: "0 0.6rem",
                        margin: "0",
                        minWidth:"40px",display:"flex",justifyContent:"center"
                      }}
                    >
                      {getCount()}
                    </h5>
                    <div className="add-button" 
                    onClick={()=>{handleIncrement(variantData?.data?.dishId)}}
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

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                    marginTop: "30px",
                  }}
                >
                  {/* <Link
                    className="cart-btn"
                    style={{ width: "80%", fontSize: "20px" }}
                    to="/checkout"
                  >
                    ADD TO CART - {resData?.currency}{((variantData?.data?.price*getCount())+variantData?.data?.add_price).toFixed(2)}
                  </Link> */}
                  <div
                    className={isIOS?"cart-btn-ios":"cart-btn"}
                    style={{ width: "80%"}}
                    onClick={() => {
                        setVariantData((pre: any) => ({ ...pre, show: false }));
                      }}
                  >
                    ADD TO CART - {resData?.currency}{((variantData?.data?.price*getCount())+(variantData?.data?.add_price) *getCount()).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
