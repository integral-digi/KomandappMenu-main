import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import search from "../../assets/search.png";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "../../style.css";

// Import required modules
import { Pagination } from "swiper/modules";
import Discription from "../Discription";
import { Link } from "react-router-dom";
import { DataContext } from "../../main";
import AnimatedTitle from "./anmatedTitle";
import VideoPlayer from "./videoPlay";
import VariationModel from "./vareationModel";
import { HeaderBar } from "../HeaderBar";

interface appProps {
  selectedMenu?: any;
  setSelectedMenu: (index: number) => void;
}

export default function MySwiper({ selectedMenu, setSelectedMenu }: appProps) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [animateText, setAnimateText] = useState(true);
  const {
    menu,
    setMenu,
    cart,
    setCart,
    restaurant,
    resname,
    setType,
    selectType,
  } = useContext(DataContext);
  const [currentCategory, setCurrentCategory] = useState(menu?.[0]?.name || "");
  const [variantData, setVariantData] = useState({
    show: false,
    data: {
      dishId: 1,
      heading: "",
      description: "",
      allergens: [],
      extras: [],
      variants: [],
      price: "",
      add_price: 0,
    },
  });

  const [activeMenuDish, setActiveMenuDish] = useState<Record<string, number>>({
    "0": 0,
    "1": 0,
    "2": 0,
    "3": 0,
  });

  useLayoutEffect(() => {
    setCurrentCategory(menu?.[0]?.name || ""); // Reset category on initial render
  }, [menu]);

  const changeCurrentCategory = (id: number) => {
    setCurrentCategory(menu?.[id]?.name || "");
  };

  const addToCartHandler = (id: number) => {
    const isExistingItem = cart.some((item: any) => item.id === id);

    // If not existing, add the item to the cart
    if (!isExistingItem) {
      const newCart = [...cart, { id }];
      setCart(newCart);
      sessionStorage.setItem(resname, JSON.stringify(newCart));
    }
  };

  const slideTo = (index: number) => {
    if (swiper) {
      swiper.slideTo(index);
    }
  };

  const calculateTotalPrice = () => {
    const total = cart.reduce(
      (acc: number, item: any) => acc + item.price * item.count,
      0
    );
    return total.toFixed(2); // Format to two decimal places
  };

  useEffect(() => {
    slideTo(selectedMenu - 1);
  }, [selectedMenu, swiper]);

  const getInitialDish = () => {
    const dishIndex = sessionStorage.getItem("selectedDish");
    return dishIndex ? parseInt(dishIndex) - 1 : 0;
  };

  const getInitial = () => {
    const menuIndex = sessionStorage.getItem("selectedMenu");
    return menuIndex ? parseInt(menuIndex) - 1 : 0;
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          zIndex: 12,
          color: "#00a99d",
          position: "absolute",
          width: "100%",
          height: "90px",
          justifyContent: "space-between",
          alignItems: "center",
          top: "0",
        }}
      >
        <Link className="cart-icon" to="/" style={{ width: "20%" }}>
          <img
            style={{ width: "30px", height: "30px" }}
            src={`https://admin.komandapp.com/${restaurant?.logo}`}
            alt="Logo"
          />
        </Link>
        <AnimatedTitle
          currentCategory={currentCategory}
          animateText={animateText}
          setAnimateText={setAnimateText}
        />

        <Link className="cart-icon" to="/cart" style={{ width: "20%" }}>
          <img style={{ width: "25px", height: "25px" }} src={search} alt="Search" />
        </Link>
      </div>

      <Swiper
        className="mySwiper swiper-h"
        spaceBetween={0}
        initialSlide={getInitial()}
        onSlideChange={(swiper: any) => {
          setAnimateText(true);
          setSelectedMenu(swiper.activeIndex + 1);
          changeCurrentCategory(swiper.activeIndex);
        }}
        onSwiper={setSwiper}
        style={{ background: "#121212" }}
      >
        {menu?.map((item: any, catIndex: number) => (
          <SwiperSlide key={catIndex}>
            <Swiper
              className="mySwiper2 swiper-v"
              direction={"vertical"}
              spaceBetween={0}
              pagination={{ clickable: true }}
              initialSlide={getInitialDish()}
              modules={[Pagination]}
              noSwipingSelector={".scrollableArea"}
              style={{ background: "#121212" }}
              onSlideChange={(swiper: any) => {
                setActiveMenuDish((prev) => ({
                  ...prev,
                  [catIndex]: swiper.activeIndex,
                }));
                sessionStorage.setItem(
                  "selectedDish",
                  (swiper.activeIndex + 1).toString()
                );
              }}
            >
              {item?.items?.map((item2: any, index: number) => (
                <SwiperSlide key={item2?.id}>
                  <div>
                    <Discription
                      heading={item2?.name}
                      description={item2?.description}
                      price={item2?.price}
                      image_path={item2?.bunnyimage}
                      has_variants={item2?.extras.length + item2?.variants.length}
                      variants={item2?.variants}
                      extras={item2?.extras}
                      setVariantData={setVariantData}
                      variantData={variantData}
                      dishId={item2?.id}
                      allergens={item2?.allergens}
                    />

                    {item2?.video && (
                      <>
                        <img
                          style={{
                            position: "fixed",
                            width: "100%",
                            height: "94dvh",
                            objectFit: "cover",
                            overflow: "hidden",
                          }}
                          src={item2?.bunnyimage}
                          alt={item2?.name}
                        />
                        {catIndex + 1 === selectedMenu &&
                          index === activeMenuDish[catIndex] && (
                            <VideoPlayer
                              active={true}
                              thumbnail={item2?.bunnyimage}
                              videoKey={item2?.video_path}
                            />
                          )}
                      </>
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </SwiperSlide>
        ))}
      </Swiper>
      <VariationModel
        variantData={variantData}
        setVariantData={setVariantData}
      />
    </>
  );
}
