import icon1 from "../../assets/right-arrow.png";
import icon2 from "../../assets/left-arrow.png";

import { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperRef, SwiperSlide, useSwiper } from "swiper/react";

import "swiper/css/pagination";
import { useContext, useEffect, useRef, useState } from "react";
import { Navigation, Pagination } from "swiper/modules";
import { DataContext } from "../../main";
import { Image } from "@chakra-ui/react";

interface appProps {
  changeMenu?: any;
  selectedMenu: any;
}

export default function BottomBar2({ changeMenu, selectedMenu }: appProps) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const swiperRef = useRef<SwiperRef | null>(null); // UseRef with correct type

  const { menu } = useContext(DataContext);

  useEffect(() => {
    if (swiper ) {
      // Slide to the selected menu index + 1 (accounting for zero-based indexing)
      swiper.slideTo(selectedMenu - 1, 0, false); // Slide to desired position, no transition
      console.log("hereeeee")
    }
  }, [swiper, selectedMenu]); // Run effect when swiper or selectedMenu changes

  return (
    <Swiper
    onSwiper={setSwiper}
      className={menu?.length<5?"mySwiper swiper-h menuBar2 onlyMobile shaded-section menuBar2-center":"mySwiper swiper-h menuBar2 onlyMobile shaded-section"}
      ref={swiperRef} // Assign Swiper instance to useRef

    //   spaceBetween={0}
      slidesPerView={5}
      modules={[Navigation]}
    //   pagination={{ clickable: true }}

      navigation={true}
      observer= {true}
      observeParents= {true}
      parallax={true}
      style={{
        // background: "transparent",
        width: "100%",
        position: "fixed",
        // position: "absolute",
        bottom: "55px",
        // bottom: "0",
        height: "8vh",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "5px 5px 0 0",
        padding: "0 5%",
        zIndex: "2",
      }}
    >
        {/* <img src={icon1}></img> */}
      {menu?.map((item: any, index: number) => {
        return (
          <SwiperSlide style={{ backgroundColor: "transparent" }} key={item.id}>
            <div
              className={selectedMenu == index + 1 ? "activeMenu2" : "menu"}
              onClick={() => changeMenu(index + 1)}
            >
              <img
                className="menuicon"
                src={"https://admin.komandapp.com/" + item?.icon}
              />
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
