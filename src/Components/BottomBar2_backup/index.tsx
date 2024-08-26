import icon1 from "../../assets/right-arrow.png";
import icon2 from "../../assets/left-arrow.png";

import { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css/pagination";
import { useContext, useEffect, useRef, useState } from "react";
import { Navigation } from "swiper/modules";
import { DataContext } from "../../main";
import { Image } from "@chakra-ui/react";

interface AppProps {
  changeMenu?: (index: number) => void;
  selectedMenu: number;
}

interface MenuItem {
  id: string;
  icon: string;
}

export default function BottomBar2({ changeMenu, selectedMenu }: AppProps) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const swiperRef = useRef<SwiperType | null>(null); // UseRef with correct type

  const { menu } = useContext(DataContext);

  useEffect(() => {
    if (swiper) {
      swiper.slideTo(selectedMenu - 1, 0, false); // Slide to desired position, no transition
      console.log("Swiped to selected menu index:", selectedMenu);
    }
  }, [swiper, selectedMenu]);

  return (
    <Swiper
      onSwiper={setSwiper}
      className={
        menu?.length < 5
          ? "mySwiper swiper-h menuBar2 onlyMobile shaded-section menuBar2-center"
          : "mySwiper swiper-h menuBar2 onlyMobile shaded-section"
      }
      ref={swiperRef} // Assign Swiper instance to useRef
      slidesPerView={5}
      modules={[Navigation]}
      navigation={true}
      observer={true}
      observeParents={true}
      parallax={true}
      style={{
        width: "100%",
        position: "fixed",
        bottom: "55px",
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
      {menu?.map((item: MenuItem, index: number) => (
        <SwiperSlide style={{ backgroundColor: "transparent" }} key={item.id}>
          <div
            className={selectedMenu === index + 1 ? "activeMenu2" : "menu"}
            onClick={() => changeMenu && changeMenu(index + 1)}
          >
            <img
              className="menuicon"
              src={"https://admin.komandapp.com/" + item?.icon}
              alt={`Menu icon ${index + 1}`}
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
