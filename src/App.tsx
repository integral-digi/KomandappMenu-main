import { useEffect, useState, useContext } from "react";
import { ChakraProvider } from "@chakra-ui/react";

import Menu from "./Components/Menu";
import ClipLoader from "react-spinners/ClipLoader";

import "./style.css";

import BottomBar from "./Components/BottomBar";
import MySwiper from "./Components/ReactSwipeableViews/swiper";
import BottomBar2 from "./Components/BottomBar2";
import { DataContext } from "./main";
import OngoingOrderSign from "./Components/modal/OngoingOrderSign";

export default function App() {
  const { menu, setMenu, selectedMenu, setSelectedMenu, selectType, setType } =
    useContext(DataContext);

  const [loading, setLoading] = useState(menu == null);
  const [color, setColor] = useState("#696969");

  const changeMenu = (val: any) => {
    setSelectedMenu(val);
    sessionStorage.setItem("selectedMenu", val);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const preventZoom = (e: any) => {
      if (e.scale !== 1) {
        e.preventDefault();
      }
    };

    document.addEventListener("gesturestart", preventZoom);

    return () => {
      document.removeEventListener("gesturestart", preventZoom);
    };
  }, []);

  return (
    <ChakraProvider>
      <div className="onlyMobile">
        {/* top ongoing order board */}
        <OngoingOrderSign />
        {loading ? (
          <div
            className="onlyMobile"
            style={{
              display: "flex",
              height: "100dvh",
              zIndex: 9999,
              background: "#121212",
              justifyContent: "center",
              alignItems: "center",
              width: "100vw",
            }}
          >
            <ClipLoader
              color={color}
              loading={loading}
              size={50}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        ) : (
          <div style={{ top: 0 }}>
            {selectType === 1 ? (
              <MySwiper
                selectedMenu={selectedMenu}
                setSelectedMenu={changeMenu}
              />
            ) : (
              <Menu setType={setType} />
            )}
            <BottomBar2 changeMenu={changeMenu} selectedMenu={selectedMenu} />
            <BottomBar changeMenu={changeMenu} selectedMenu={selectedMenu} />
          </div>
        )}
      </div>
    </ChakraProvider>
  );
}
