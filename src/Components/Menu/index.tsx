import "../../style.css";
import image1 from "../../assets/dish.png";
import { Link } from "react-router-dom";
import { DataContext } from "../../main";
import { useContext, useState } from "react";
import AnimatedTitle from "../ReactSwipeableViews/anmatedTitle";
import AddCartButton from "../AddCartButton";
import VariationModel from "../ReactSwipeableViews/vareationModel";

interface appProps {
  setType?: any;
  // videoData:any;
}
export default function Menu({ setType }: appProps) {
  const { menu, selectedMenu, resData } = useContext(DataContext);
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
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          zIndex: "1",
          color: "#00a99d",
          width: "100%",
          justifyContent: "space-around",
          height: "90px",
          alignItems: "center",
        }}
      >
        <div onClick={() => setType(1)}>
          {/* <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 365.57 341.09" width="1.3rem" style="width: 1.3rem;"><path d="m488.11 353.84-287 131.27a18.76 18.76 0 0 1-26.56-17.06V205.52a18.76 18.76 0 0 1 26.56-17.06l287 131.27a18.75 18.75 0 0 1 0 34.11Z" transform="translate(-154 -166.24)" style="fill: none; stroke: rgb(255, 255, 255); stroke-miterlimit: 10; strokeWidth: 41;"></path></svg> */}
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
          currentCategory={menu[selectedMenu - 1]?.name}
          animateText={animateText}
          setAnimateText={setAnimateText}
        />
        {/* <h3>{menu[selectedMenu-1]?.name}</h3> */}
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
      <div style={{ overflowY: "scroll", height: "73dvh" }}>
        {menu[selectedMenu - 1]?.items?.map((item: any, index: any) => (
          <>
            <div className="menu-card">
              <div className="menu-item" style={{background:"black"}}>
                <div className="menu-img">
                  <img
                    style={{
                      borderRadius: "12px",
                      width: "150px",
                      maxWidth:"150px",
                      height: "150px",
                      objectFit: "cover",
                    }}
                    src={item?.bunnyimage}
                  />
                </div>
                <div className="menu-description">
                  <div>{item?.name}</div>
                  <div>{resData?.currency}{item?.price}</div>
                  <div className="view-more">View More</div>
                  {/* <div className="add-cart">
                                        <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path clipRule="evenodd" d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M12 7v10M17 12H7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                    </div> */}

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
                    has_variants={item?.extras.length + item?.variants.length}
                  />
                </div>
              </div>
            </div>
          </>
        ))}
      </div>
      <VariationModel
        variantData={variantData}
        setVariantData={setVariantData}
      />
    </div>
  );
}
