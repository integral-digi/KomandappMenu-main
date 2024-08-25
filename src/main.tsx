import React, { createContext, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Cart from "./Cart";
import CheckoutPage from "./CheckoutPage";
import "./style.css";
import { HexToCssConfiguration, hexToCSSFilter } from 'hex-to-css-filter';
import ScannerPage from "./ScannerPage";

interface RestaurantData {
  logo?: string;
  primary_color?: string;
  secondary_color?: string;
}

interface DataContextInterface {
  menu: any[] | null;
  setMenu: React.Dispatch<React.SetStateAction<any[] | null>>;
  selectedMenu: any;
  setSelectedMenu: React.Dispatch<React.SetStateAction<any>>;
  cart: any[];
  setCart: React.Dispatch<React.SetStateAction<any[]>>;
  restaurant: RestaurantData;
  setRestaurant: React.Dispatch<React.SetStateAction<RestaurantData>>;
  resname: string;
  setResname: React.Dispatch<React.SetStateAction<string>>;
  setType: React.Dispatch<React.SetStateAction<number>>;
  selectType: number;
  resData: any;
}

export const DataContext = createContext<DataContextInterface>({
  menu: null,
  setMenu: () => {},
  selectedMenu: null,
  setSelectedMenu: () => {},
  cart: [],
  setCart: () => {},
  restaurant: {},
  setRestaurant: () => {},
  resname: "",
  setResname: () => {},
  setType: () => {},
  selectType: 1,
  resData: {},
});

function MainApp() {
  const [menu, setMenu] = useState<any[] | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<number>(
    Number(sessionStorage.getItem("selectedMenu")) || 1
  );
  const [cart, setCart] = useState<any[]>([]);
  const [restaurant, setRestaurant] = useState<RestaurantData>({});
  const [resname, setResname] = useState<string>("pizzabar");
  const [resData, setResData] = useState<any>({});
  const [selectType, setType] = useState<number>(1);

  useEffect(() => {
    const storedResName = window.location.pathname.split("/")[2];
    if (storedResName) {
      setResname(storedResName);
    }

    const storedCart = sessionStorage.getItem(storedResName || "cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }

    fetch(`https://admin.komandapp.com/api/v2/resturant/${storedResName}`)
      .then((response) => response.json())
      .then((data) => {
        const restaurantData = data?.restaurant_data?.restaurant_data;

        setMenu(restaurantData?.categories || []);
        setRestaurant({ logo: restaurantData?.icon });
        setResData({
          can_pickup: restaurantData?.can_pickup,
          can_deliver: restaurantData?.can_deliver,
          can_dinein: restaurantData?.can_dinein,
          self_deliver: restaurantData?.self_deliver,
          free_deliver: restaurantData?.free_deliver,
          currency: restaurantData?.currency === "EUR" ? "€" : "$",
          stripe_account: restaurantData?.stripe_account,
          vendor_id: restaurantData?.id,
          minimum: restaurantData?.minimum,
        });

        document.documentElement.style.setProperty('--primary-color', restaurantData?.primary_color || '#000');
        document.documentElement.style.setProperty('--secondary-color', restaurantData?.secondary_color || '#fff');

        const config: HexToCssConfiguration = {
          acceptanceLossPercentage: 1,
          maxChecks: 10,
        };
        const cssFilter = hexToCSSFilter(restaurantData?.primary_color || '#000', config);
        document.documentElement.style.setProperty('--tertiary-color', cssFilter.filter || '');
      })
      .catch((error: any) => console.error("Error fetching restaurant data:", error));
  }, [resname]);

  return (
    <DataContext.Provider
      value={{
        menu,
        setMenu,
        selectedMenu,
        setSelectedMenu,
        cart,
        setCart,
        restaurant,
        setRestaurant,
        resname,
        setResname,
        setType,
        selectType,
        resData,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path={`/restaurant/${resname}`} element={<App />} />
          <Route path="/" element={<ScannerPage />} />
        </Routes>
      </BrowserRouter>
    </DataContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <MainApp />
);
