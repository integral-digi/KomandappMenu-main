import { useContext, useEffect, useState } from "react";
// import { Data } from "../../App";
import icon from "../../assets/addCart.png";
import icon2 from "../../assets/checkmark.svg";
import downArrow from "../../assets/down-arrow.png";
import upArrow from "../../assets/up-arrow.png";
import { motion } from 'framer-motion';
import minus from "../../assets/minus.svg";
import "../../colors.css";
import "../../style.css";
import { DataContext } from "../../main";
import VariationModel from "../ReactSwipeableViews/vareationModel";


interface appProps {
  // selectedMenu?: any;
  // setType?: any;
    // addToCart?: any;
  heading?: any;
  description?: any;
  price?: any;
  dishId?:  number;
  allergens?: [];
  image_path?: string;
  setVariantData?:any;
  variantData?:any;
  has_variants?:boolean;
  variants:[]
  extras:[]
}
  
export default function Discription({
  heading,
  price,
  description,
  image_path,
  // selectedMenu,
  // setType,
  // addToCart,
  dishId,
  allergens,
  variantData,
  setVariantData,
  has_variants,
  variants,
  extras
}: appProps) {
  const { menu, setMenu, cart, setCart, resname, resData } = useContext(DataContext);
  const [expand, setExpand] = useState(false);
  const [isCart, setIsCart] = useState(
    cart?.some((item: any) => item?.id == dishId)
  );
  function getCount(){
    let calCount = 0
    cart.map((item:any) => {
      if (item.id === dishId) {
        calCount =  item.count>0?parseInt(item.count):1 // Increase count for the clicked item
      }
       // Keep other items unchanged
    })
    return calCount
  }
  const [count, setCount] = useState(
    cart.length>0 ? getCount() : 0)

  const handleIncrement = (itemId:any) => {
    if(count>=99){
      return
    }
    setCount(count+1)
    has_variants &&setVariantData((pre:any)=>({...pre,show:true,data:{...pre.data,dishId,heading,description,allergens,variants,extras,price}}))
    const updatedCartItems = cart.map((item:any) => {
      
      if (item.id === itemId) {
        return { ...item, count: item.count + 1 }; // Increase count for the clicked item
      }
      return item; // Keep other items unchanged
    });
    setCart(updatedCartItems);
    console.log("cart: ",cart);
    sessionStorage.setItem(resname, JSON.stringify(updatedCartItems));
  };

  const handleDecrement = (itemId:any,count:number) => {
    if(count>1){
      setCount(count-1)
    const updatedCartItems = cart.map((item:any) => {
    if (item.id === itemId) {
        return { ...item, count: Math.max(item.count - 1, 0) }; // Ensure count doesn't go below 0
    }
    
    return item; // Keep other items unchanged
    });
    setCart(updatedCartItems);
    sessionStorage.setItem(resname, JSON.stringify(updatedCartItems));
    }
    else{
      setCount(0)
        const updatedCartItems = cart.filter((item:any) => {
            if (item.id == itemId) {
            // If count reaches 0, remove the item
            setIsCart(false);
            return item.count > 1 ? { ...item, count: item.count - 1 } : false;
            }
            return item; // Keep other items unchanged
        });
        setCart(updatedCartItems);
        sessionStorage.setItem(resname, JSON.stringify(updatedCartItems));
    }
  };
  const addToCartHandler = (id: number) => {
    setCount((count)+1)
    const isExistingItem = cart.some((item: any) => item.id === id);

    // If not existing, add the item to the cart
    if (has_variants||!isExistingItem) {
      // alert("here")
      setCart((prevCart: any) => [...prevCart, { id:id,title:heading,price,count:1,image_path,has_variants,add_price:prevCart.add_price?prevCart.add_price:0,variants:0,extras:[],heading,extrasData:extras,variantsData:variants }])
      // .then(()=>{
      //   sessionStorage.setItem("cart", JSON.stringify(cart));
      // })
      setIsCart(true);
      has_variants && setVariantData((pre:any)=>({...pre,show:true,data:{...pre.data,dishId,heading,description,allergens,variants,extras,price}}))
      
    }
    else{
      const updatedCartItems = cart.filter((item:any) => {
        if (item.id == id) {
        // If count reaches 0, remove the item
        return false;
        }
        return item; // Keep other items unchanged
    });
    setCart(updatedCartItems);
    sessionStorage.setItem(resname, JSON.stringify(updatedCartItems));
    setIsCart(false);
    }
  };
  function handleCartClick() {
   
    dishId && addToCartHandler(dishId);
    
    console.log("cart: ",cart)
  }
  useEffect(()=>{
    sessionStorage.setItem(resname, JSON.stringify(cart));
  },[cart])
  const animationVariants= {
    from: { y: 100,opacity:0 },
    to: { y: 0,opacity:1,transition:{duration:0.5} },
    // transition: { duration: 0.5, ease: 'easeInOut' }, // Customize as desired
  };
  // useEffect(()=>{

  // },[variantData])
  var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window?.MSStream;

  return (
    <>
    <div className="descriptionComponent">
      <motion.div key={expand?0:1} variants={animationVariants} animate="to" initial="from" style={{ width:isCart && !has_variants ?"76%":"89%",zIndex:2 }} className={expand ? "descriptionExpand" : "description"}>
        <div className={isIOS?"cart-title-ios":"cart-title"}  style={{ display: "flex", paddingLeft: "5px",width:"100%",textAlign:"left" }}>
          <b>{heading||"heading"}</b>
        </div>
        <div style={{ display: "flex", paddingLeft: "5px" }}
        className={isIOS?"normalText-ios":"normalText"}
        >
          <b>{resData?.currency}{price??"price"}</b>
        </div>
        <div
          style={{
            marginTop: "0.3rem",
            textAlign: "left",
            paddingLeft: "5px",
            
          }}
          className={isIOS?"normalText-ios":"normalText"}
        >
          {(description?.length > 45 || allergens?.length !=0) && !expand ? (
            <>
              <p className={isIOS?"normalText-ios":"normalText"}>{description?.slice(0, 45)}...</p>
              <span
                onClick={() => setExpand(!expand)}
                className={isIOS?"normalText-ios":"normalText"}
                style={{ color: "var(--primary-color)"}}
              >
                Read More
              </span>
            </>
          ) : (
            <>
              <motion.div 
              // variants={animationVariants} animate="to" initial="from"

                className="customScrollBar"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  fontSize: "15px",
                  justifyContent: "space-between",
                  lineHeight: "18px",
                  marginTop: "8px",
                }}
              >
                <div
                  style={{
                    maxHeight: "25dvh",
                    // height:"25dvh",
                    // position:"fixed",
                    overflowY: "auto",
                    touchAction: "pan-y",
                    // overscrollBehavior: "contain",
                    flex: "1 1 0%",
                    zIndex: "999",
                  }}
                >
                  <div className="scrollableArea">
                  <p className={isIOS?"normalText-ios":"normalText"}>{description}{" "}</p>
                    {expand && allergens && allergens?.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          margin: "5px 0",
                          flexWrap: "wrap",
                          height: "fit-content",
                        }}
                      >
                        {allergens?.map((item: any) => {
                          return (
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
                                src={
                                  // "https://admin.komandapp.com/" +
                                  // 'https://komandapp.b-cdn.net/'+
                                  item?.icon_path
                                }
                              />
                              <p 
                              className={isIOS?"normalText-allergens-ios":"normalText-allergens"}
                              style={{margin:"0"}}>{item?.title}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
              {description?.length > 45 || allergens?.length !=0 ? (
                <div
                  style={{
                    color: "var(--primary-color)",
                    height: "20px",
                    display: "flex",
                    justifyContent: "center",
                    paddingLeft: "25px",
                  }}
                  onClick={() => setExpand(false)}
                >
                  <div style={{fontSize:"16px"}}>Show Less</div>
                  <div style={{ display: "flex", alignItems: "flex-end" }}>
                    <img
                      style={{
                        width: "20px",
                        height: "15px",
                        marginLeft: "5px",
                      }}
                      src={upArrow}
                    />
                  </div>
                </div>
              ) : (
                <></>
              )}
            </>
          )}{" "}
        </div>
      </motion.div>
      <div
        style={{
          width: isCart && !has_variants ?"20%":"10%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "right",
         zIndex:"999",
          bottom: "0",
        }}
      >
        <div style={{ height: expand ? "13dvh" : "13dvh" ,width:"100%" }}>
          {isCart && !has_variants ? (
            
          <div className="" style={{backgroundColor:"transparent",border:"1px solid white",borderRadius:"18px",display:"flex", flexDirection:"row",width:"90px",alignItems:"center", padding:"4px 6px",position:"absolute",right:"10px"}}>
            <div className="remove-button"   onClick={() => handleDecrement(dishId,count)} >
              {/* minus */}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash-lg" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8"/>
</svg>
            {/* <img width={"20px"} style={{maxHeight:"20px"}}src={minus} /> */}
            </div>
            <h5 style={{minWidth:"40px",padding:"0 0.6rem",margin:"0",fontSize:"20px",display:"flex",justifyContent:"center",alignItems:"baseline"}}>{getCount() }</h5> 
            <div className="add-button" onClick={() => handleIncrement(dishId)}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4V20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M20 12H4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg></div>
          </div>
          ) 
          :getCount() && has_variants ? (
            <img className={isIOS?"cart-icon-size-ios":"cart-icon-size"} style={{ height: "auto" }}
            onClick={() => handleCartClick()} src={icon2} />
          ) 
          : (
            <img
              // className={isIOS?"cart-icon-size-ios":"cart-icon-size2"}
              style={{  width:"25px",height: "auto" }}
              onClick={() => handleCartClick()}
              src={icon}
            />
          )}
         
        </div>
      </div>
    </div>

    </>
  );
}
