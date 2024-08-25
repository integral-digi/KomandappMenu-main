import { useContext, useState } from "react";
import { DataContext } from "../../main";
import icon2 from "../../assets/checkmark.svg";
import icon from "../../assets/addCart.png";
import minus from "../../assets/minus.svg";

interface appProps {
  // selectedMenu?: any;
  // setType?: any;
  // addToCart?: any;
  heading?: any;
  description?: any;
  price?: any;
  dishId?: number;
  allergens?: [];
  image_path?: string;
  setVariantData?: any;
  variantData?: any;
  has_variants?: boolean;
  variants: [];
  extras: [];
}
export default function AddCartButton({
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
  extras,
}: appProps) {
  const { menu, setMenu, cart, setCart, resname } = useContext(DataContext);

  const [isCart, setIsCart] = useState(
    cart?.some((item: any) => item?.id == dishId)
  );

  function getCount() {
    let calCount = 0;
    cart.map((item: any) => {
      if (item.id === dishId) {
        calCount = item.count > 0 ? parseInt(item.count) : 1; // Increase count for the clicked item
      }
      // Keep other items unchanged
    });
    return calCount;
  }
  const [count, setCount] = useState(cart.length > 0 ? getCount() : 0);

  const handleIncrement = (itemId: any) => {
    if (count >= 99) {
      return;
    }
    setCount(count + 1);
    has_variants &&
      setVariantData((pre: any) => ({
        ...pre,
        show: true,
        data: {
          ...pre.data,
          dishId,
          heading,
          description,
          allergens,
          variants,
          extras,
          price,
        },
      }));
    const updatedCartItems = cart.map((item: any) => {
      if (item.id === itemId) {
        return { ...item, count: item.count + 1 }; // Increase count for the clicked item
      }
      return item; // Keep other items unchanged
    });
    setCart(updatedCartItems);
    console.log("cart: ", cart);
    sessionStorage.setItem(resname, JSON.stringify(updatedCartItems));
  };
  const handleDecrement = (itemId: any, count: number) => {
    if (count > 1) {
      setCount(count - 1);
      const updatedCartItems = cart.map((item: any) => {
        if (item.id === itemId) {
          return { ...item, count: Math.max(item.count - 1, 0) }; // Ensure count doesn't go below 0
        }

        return item; // Keep other items unchanged
      });
      setCart(updatedCartItems);
      sessionStorage.setItem(resname, JSON.stringify(updatedCartItems));
    } else {
      setCount(0);
      const updatedCartItems = cart.filter((item: any) => {
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
    setCount(count + 1);
    const isExistingItem = cart.some((item: any) => item.id === id);

    // If not existing, add the item to the cart
    if (has_variants || !isExistingItem) {
      // alert("here")
      setCart((prevCart: any) => [
        ...prevCart,
        {
          id: id,
          title: heading,
          price,
          count: 1,
          image_path,
          has_variants,
          add_price: prevCart.add_price ? prevCart.add_price : 0,
          variants: 0,
          extras: [],
          heading,
          extrasData: extras,
          variantsData: variants,
        },
      ]);
      // .then(()=>{
      //   sessionStorage.setItem("cart", JSON.stringify(cart));
      // })
      setIsCart(true);
      has_variants &&
        setVariantData((pre: any) => ({
          ...pre,
          show: true,
          data: {
            ...pre.data,
            dishId,
            heading,
            description,
            allergens,
            variants,
            extras,
            price,
          },
        }));
    } else {
      const updatedCartItems = cart.filter((item: any) => {
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

    console.log("cart: ", cart);
  }
  return (
    <div style={{marginTop:"5px"}}>
      {isCart && !has_variants ? (
        <div
          className=""
          style={{
            backgroundColor: "transparent",
            border: "1px solid white",
            borderRadius: "18px",
            display: "flex",
            flexDirection: "row",
            width: "90px",
            alignItems: "center",
            padding: "4px 6px",
            
            // position: "absolute",
            // right: "10px",
          }}
        >
          <div
            className="remove-button"
            onClick={() => handleDecrement(dishId, count)}
          >
            {/* minus */}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash-lg" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8"/>
</svg>
            {/* <img width={"20px"} style={{ maxHeight: "20px" }} src={minus} /> */}
          </div>
          <h5
            style={{
              minWidth: "40px",
              padding: "0 0.6rem",
              margin: "0",
              fontSize: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
            }}
          >
            {getCount()}
          </h5>
          <div className="add-button" onClick={() => handleIncrement(dishId)}>
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
      ) : getCount() && has_variants ? (
        <img
          className={"cart-icon-size"}
          style={{ height: "auto" }}
          onClick={() => handleCartClick()}
          src={icon2}
        />
      ) : (
        <img
          // className={isIOS?"cart-icon-size-ios":"cart-icon-size2"}
          style={{ width: "25px", height: "auto" }}
          onClick={() => handleCartClick()}
          src={icon}
        />
      )}
    </div>
  );
}
