import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import "../../colors.css";

interface AnimatedTitleProps {
  currentCategory: string;
  animateText:boolean;
  setAnimateText:any;
}

const AnimatedTitle: React.FC<AnimatedTitleProps> = ({
  currentCategory,
  animateText,
  setAnimateText,
}) => {
  useEffect(() => {

    setTimeout(()=>{
        setAnimateText(false)
    },100)
  }, [currentCategory]);

  const animationVariants= {
    from: { y: -100,opacity:0 },
    to: { y: 0,opacity:1,transition:{duration:0.5} },
  };

  return (
    <>
    <motion.div variants={animationVariants} animate={animateText?"from":"to"} initial="from">
       <h4
          className="heading-cart"
          style={{
            margin:"0",
            textAlign: "center",
            color: "var(--primary-color)",
          }}
        >
          
          {animateText!=true&&currentCategory}
        </h4>
    </motion.div>
    </>
  );
};

export default AnimatedTitle;
