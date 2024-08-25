import "../../style.css";
import image1 from "../../assets/dish.png";
import { Link } from "react-router-dom";
import { DataContext } from "../../main";
import { useContext, useState } from "react";
import AnimatedTitle from "../ReactSwipeableViews/anmatedTitle";
import AddCartButton from "../AddCartButton";
import VariationModel from "../ReactSwipeableViews/vareationModel";

interface MenuProps {
  setType?: (type: number) => void;
}

export default function Menu({ setType }: MenuProps) {
  const { menu, selectedMenu, resData } = useContext(DataContext) || {};
  const [animateText, setAnimateText] = useState(true);
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

  return (
    <div className="mobile-responsive onlyMobile">
      <div className="menu-header">
        <div onClick={() => setType && setType(1)} className="back-icon">
          <svg
            width="24"
            height="24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m11.005 5-8 7 8 7M3.005 12H21"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </div>
        <AnimatedTitle
          currentCategory={menu?.[selectedMenu - 1]?.name}
          animateText={animateText}
          setAnimateText={setAnimateText}
        />
        <Link className="cart-icon" to="/cart">
          <svg
            width="24"
            height="24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="M16 3.5v2a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5Z"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M16 4h2.967a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3v0M9 11h6M9 15h3"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </Link>
      </div>
      <div className="menu-items-container">
        {menu?.[selectedMenu - 1]?.items?.length ? (
          menu[selectedMenu - 1].items.map((item: any, index: number) => (
            <div className="menu-card" key={item.id || index}>
              <div className="menu-item">
                <div className="menu-img">
                  <img
                    className="menu-item-img"
                    src={item?.bunnyimage || image1}
                    alt={item?.name}
                  />
                </div>
                <div className="menu-description">
                  <div>{item?.name}</div>
                  <div>{resData?.currency}{item?.price}</div>
                  <div className="view-more">View More</div>
                  <AddCartButton
                    dishId={item?.id}
                    heading={item?.name}
                    price={item?.price}
                    image_path={item?.bunnyimage}
                    variants={item?.variants}
                    extras={item?.extras}
                    setVariantData={setVariantData}
                    variantData={variantData}
                    allergens={item?.allergens}
                    has_variants={
                      item?.extras.length > 0 || item?.variants.length > 0
                    }
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>No menu items available</div>
        )}
      </div>
      <VariationModel
        variantData={variantData}
        setVariantData={setVariantData}
      />
    </div>
  );
}
