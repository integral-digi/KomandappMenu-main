import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  memo,
} from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import search from "../../assets/search.png";
import "swiper/css";
import "swiper/css/pagination";
import "../../style.css";
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
  setSelectedMenu: any;
}

const MySwiper = ({ selectedMenu, setSelectedMenu }: appProps) => {
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

  const [currentCategory, setCurrentCategory] = useState(menu?.[0]?.name);
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

  const [activeMenuDish, setActiveMenuDish] = useState({
    "0": 0,
    "1": 0,
    "2": 0,
    "3": 0,
  });

  useLayoutEffect(() => {
    setCurrentCategory(menu?.[0]?.name); // Reset category on initial render
  }, []);

  function changeCurrentCategory(id: number) {
    setCurrentCategory(menu?.[id]?.name);
  }

  const addToCartHandler = (id: number) => {
    const isExistingItem = cart.some((item: any) => item.id === id);
    if (!isExistingItem) {
      setCart((prevCart: any) => [...prevCart, { id }]);
      sessionStorage.setItem(resname, JSON.stringify(cart));
    }
  };

  const slideTo = (index: any) => {
    if (swiper) {
      swiper?.slideTo(index);
    }
  };

  const calculateTotalPrice = () => {
    const total = cart.reduce(
      (acc: any, item: any) => acc + item.price * item.count,
      0
    );
    return total.toFixed(2); // Format to two decimal places
  };

  useEffect(() => {
    slideTo(selectedMenu - 1);
  }, [selectedMenu]);

  function getInitialDish() {
    const dishIndex = sessionStorage.getItem("selectedDish");
    if (!dishIndex) {
      return 0;
    } else {
      return parseInt(dishIndex) - 1;
    }
  }

  function getInitial() {
    const menuIndex = sessionStorage.getItem("selectedMenu");
    if (!menuIndex) {
      return 0;
    } else {
      return parseInt(menuIndex) - 1;
    }
  }

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
            src={"https://admin.komandapp.com/" + restaurant?.logo}
            alt="Logo"
          />
        </Link>
        <AnimatedTitle
          currentCategory={currentCategory}
          animateText={animateText}
          setAnimateText={setAnimateText}
        />

        <Link className="cart-icon" to="/cart" style={{ width: "20%" }}>
          <img style={{ width: "25px", height: "25px" }} src={search} />
        </Link>
      </div>

      <Swiper
        className="mySwiper swiper-h"
        spaceBetween={0}
        initialSlide={0 || getInitial()}
        onSlideChange={(swiper: any) => {
          setAnimateText(true);
          setSelectedMenu(swiper.activeIndex + 1);
          changeCurrentCategory(swiper?.activeIndex);
        }}
        onSwiper={setSwiper}
        style={{ background: "#121212" }}
      >
        {menu?.map((item: any, catIndex: number | any) => {
          return (
            <SwiperSlide key={catIndex}>
              <Swiper
                className="mySwiper2 swiper-v"
                direction={"vertical"}
                spaceBetween={0}
                pagination={{
                  clickable: true,
                }}
                initialSlide={0 || getInitialDish()}
                modules={[Pagination]}
                noSwipingSelector={".scrollableArea"}
                style={{ background: "#121212" }}
                onSlideChange={(swiper: any) => {
                  setActiveMenuDish((pre: any) => ({
                    ...pre,
                    [catIndex]: swiper.activeIndex,
                  }));
                  sessionStorage.setItem(
                    "selectedDish",
                    swiper.activeIndex + 1
                  );
                }}
              >
                {item?.items?.map((item2: any, index: number) => {
                  return (
                    <SwiperSlide key={item2?.id}>
                      <div>
                        <Discription
                          heading={item2?.name}
                          description={item2?.description}
                          price={item2?.price}
                          image_path={item2?.bunnyimage}
                          has_variants={
                            item2?.extras.length + item2?.variants.length
                          }
                          variants={item2?.variants}
                          extras={item2?.extras}
                          setVariantData={setVariantData}
                          variantData={variantData}
                          dishId={item2?.id}
                          allergens={item2?.allergens}
                        />

                        {item2?.video != "" ? (
                          <>
                            {" "}
                            <img
                              style={{
                                position: "fixed",
                                width: "100%",
                                height: "94dvh",
                                objectFit: "cover",
                                overflow: "hidden",
                              }}
                              src={item2?.bunnyimage}
                            />
                            {catIndex + 1 == selectedMenu &&
                            (catIndex && index === 0
                              ? true
                              : index ===
                                (activeMenuDish as { [key: number]: number })[
                                  catIndex
                                ]) ? (
                              <VideoPlayer
                                active={true}
                                thumbnail={item2?.bunnyimage}
                                videoKey={item2?.video_path}
                              />
                            ) : (
                              <img src={item2?.bunnyimage}></img>
                            )}
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <VariationModel
        variantData={variantData}
        setVariantData={setVariantData}
      />
    </>
  );
};

export default memo(MySwiper);
