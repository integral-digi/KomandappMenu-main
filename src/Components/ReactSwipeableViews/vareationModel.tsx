import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { DataContext } from "../../main";

interface AppProps {
  variantData: any;
  setVariantData?: any;
}

export default function VariationModel({
  variantData,
  setVariantData,
}: AppProps) {
  const { menu, setMenu, cart, setCart, resname, resData } = useContext(DataContext);

  // Get the initial count from the cart
  function getCount() {
    const currentItem = cart.find((item: any) => item.id === variantData?.data?.dishId);
    return currentItem ? currentItem.count : 1;
  }

  const [count, setCount] = useState(getCount());

  // Update the selected radio option in the cart
  const onChangeRadio = (itemId: any, radioIndex: any) => {
    const updatedCartItems = cart.map((item: any) => {
      if (item.id === variantData?.data?.dishId) {
        return { ...item, variants: radioIndex };
      }
      return item;
    });
    setCart(updatedCartItems);
    sessionStorage.setItem(resname, JSON.stringify(updatedCartItems));
  };

  // Add an extra price and update the cart
  const addPrice = (itemId: any, price: number) => {
    const updatedCartItems = cart.map((item: any) => {
      if (item.id === variantData?.data?.dishId) {
        setVariantData((prev: any) => ({
          ...prev,
          data: { ...prev.data, add_price: prev.data.add_price + price },
        }));
        return { 
          ...item, 
          add_price: item.add_price + price,
          extras: item.extras ? [...item.extras, itemId] : [itemId],
        };
      }
      return item;
    });
    setCart(updatedCartItems);
    sessionStorage.setItem(resname, JSON.stringify(updatedCartItems));
  };

  // Subtract an extra price and update the cart
  const subPrice = (itemId: any, price: number) => {
    const updatedCartItems = cart.map((item: any) => {
      if (item.id === variantData?.data?.dishId) {
        setVariantData((prev: any) => ({
          ...prev,
          data: { ...prev.data, add_price: prev.data.add_price - price },
        }));
        return {
          ...item,
          add_price: item.add_price - price,
          extras: item.extras.filter((id: number) => id !== itemId),
        };
      }
      return item;
    });
    setCart(updatedCartItems);
    sessionStorage.setItem(resname, JSON.stringify(updatedCartItems));
  };

  // Increment item count
  const handleIncrement = (itemId: any) => {
    if (count >= 98) return;
    setCount(count + 1);

    const updatedCartItems = cart.map((item: any) => {
      if (item.id === itemId) {
        return { ...item, count: item.count + 1 };
      }
      return item;
    });
    setCart(updatedCartItems);
    sessionStorage.setItem(resname, JSON.stringify(updatedCartItems));
  };

  // Decrement item count
  const handleDecrement = (itemId: any) => {
    if (count > 1) {
      setCount(count - 1);

      const updatedCartItems = cart.map((item: any) => {
        if (item.id === itemId) {
          return { ...item, count: Math.max(item.count - 1, 0) };
        }
        return item;
      });
      setCart(updatedCartItems);
      sessionStorage.setItem(resname, JSON.stringify(updatedCartItems));
    } else {
      // Remove the item if count reaches 0
      const updatedCartItems = cart.filter((item: any) => item.id !== itemId);
      setCart(updatedCartItems);
      sessionStorage.setItem(resname, JSON.stringify(updatedCartItems));
      setVariantData((prev: any) => ({ ...prev, show: false }));
    }
  };

  const animationVariants = {
    from: { y: 100, opacity: 0 },
    to: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window?.MSStream;

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
              onClick={(event) => event.stopPropagation()}
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "hsla(0, 0%, 22%, 0.99)",
              }}
            >
              <div
                className="variation-close-btn"
                style={{ height: "5%", minHeight: '15px', zIndex: "5" }}
                onClick={() => setVariantData((prev: any) => ({ ...prev, show: false }))}
              >
                <svg
                  width="30"
                  height="40"
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
              <h4 className={isIOS ? "cart-title-ios" : "cart-title"} style={{ height: "5%", minHeight: '20px' }}>{variantData?.data?.heading}</h4>
              <div style={{ display: "flex", maxHeight: "450px", overflowY: "scroll", zIndex: "4", height: "70%" }}>
                <>
                  <div>
                    {variantData?.data?.extras.length > 0 && (
                      <div className={isIOS ? "variation-tag-ios" : "variation-tag"}>EXTRAS</div>
                    )}
                    {variantData?.data?.extras?.map((item: any) => {
                      const handleChange = (
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        const isChecked = event.target.checked;
                        if (isChecked) {
                          addPrice(item.id, item.price);
                        } else {
                          subPrice(item.id, item.price);
                        }
                      };

                      return (
                        <div key={item.id} style={{ display: "flex", alignItems: "center" }}>
                          <input
                            className={isIOS ? "normalText-ios" : "normalText"}
                            type="checkbox"
                            id={item.id}
                            name={item.name}
                            value={item.id}
                            style={{ width: "50px" }}
                            onChange={handleChange}
                          />
                          <label
                            className={isIOS ? "normalText-ios" : "normalText"}
                            htmlFor={item.id}
                            style={{ padding: "0 3px" }}
                          >
                            {item.name} - {resData?.currency}{item.price}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </>
                <>
                  <div>
                    {variantData?.data?.variants.length > 0 && (
                      <div className={isIOS ? "variation-tag-ios" : "variation-tag"}>CHOOSE ONE</div>
                    )}
                    {variantData?.data?.variants.map((item: any, index: number) => {
                      const isSelected = cart.some((cartItem: any) =>
                        cartItem.id === variantData?.data?.dishId && cartItem.variants === index
                      );

                      const handleChange = () => {
                        onChangeRadio(item.id, index);
                      };

                      return (
                        <div key={item.id} style={{ display: "flex", alignItems: "center" }}>
                          <input
                            className={isIOS ? "normalText-ios" : "normalText"}
                            type="radio"
                            id={item.id}
                            name="radio-group"
                            value={index}
                            checked={isSelected}
                            onChange={handleChange}
                          />
                          <label
                            className={isIOS ? "normalText-ios" : "normalText"}
                            htmlFor={item.id}
                            style={{ padding: "0 3px" }}
                          >
                            {item.name} - {resData?.currency}{item.price}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </>
              </div>
              <div className="variation-counter" style={{ zIndex: "5", marginTop: '10px', minHeight: '60px', height: '15%' }}>
                <button className={isIOS ? "counter-btn-ios" : "counter-btn"} onClick={() => handleDecrement(variantData?.data?.dishId)}>-</button>
                <div className={isIOS ? "count-ios" : "count"}>{count}</div>
                <button className={isIOS ? "counter-btn-ios" : "counter-btn"} onClick={() => handleIncrement(variantData?.data?.dishId)}>+</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
