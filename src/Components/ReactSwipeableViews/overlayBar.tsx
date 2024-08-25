import React, { useEffect, useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper';
import search from "../../assets/search.png";
// import icon1 from "../../assets/Burguer.png";
// import icon2 from "../../assets/Cocktail.png";
// import icon3 from "../../assets/Nigiri.png";
// import icon4 from "../../assets/Wine.png";
// import icon1 from "../../assets/burgerIcn.png";



// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import '../../style.css';


// import required modules
// import Discription from '../Discription';
// import { Link } from 'react-router-dom';
// import { Data } from '../../App';
interface appProps {
  selectedMenu?: any;
  selectType?: any; // optional prop
  setType?: any;
  videoData: any;
  index:number;
  heading:any;
  description:any;
  catName:string;
  price:string;
  addToCart:any;
  id: string | number;
  allergens:[];
}

export default function OverlayBar({ catName,heading,description,price,selectedMenu, setType, videoData,index,addToCart,id,allergens }: appProps) {
  // const iconMappings = [
  //  icon1,
  //   icon1,
  //  icon1,
  //   icon1,
  // ]; // Or use a conditional statement to select the icon based on index

  // const dynamicIcon = iconMappings[index]; 
  return (
  
    <div 
    // style={{ display: "flex", flexDirection: "row", zIndex: 1, color: "#00a99d", position: "absolute", width: "100%", height: "80vh", justifyContent: "space-around" }}
    >
      {/* <Link className="cart-icon" to="/cart" style={{ width: "20%" }}>
        <img style={{width:"25px",height:"25px"}} src={dynamicIcon} />
      </Link>
      <h3 style={{ width: "60%", textAlign: "center",color:'blue' }}>{catName}</h3>
      <Link className="cart-icon" to="/cart" style={{ width: "20%" }}>
        <img style={{width:"25px",height:"25px"}} src={search} />
      </Link> */}
      {/* <Discription heading={heading} description={description} price={price} selectedMenu={selectedMenu} setType={setType} addToCart={addToCart} id={id} allergens={allergens} /> */}
    </div>
                
  );
}
