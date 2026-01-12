import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { Player } from "@lottiefiles/react-lottie-player";
import truckAnimation from "../../assets/obhaJb5us8.json"; // Lottie fayl

const Delivery = () => {
  return (
    <section
      data-aos="fade-up"
      className="w-[80%] mx-auto flex flex-col items-center justify-around py-20 text-[#a30f0f] gap-8 sm:gap-10 md:gap-12"
    >
      {/* Matn va ikon */}
      <div className="flex flex-col items-center justify-center gap-8  text-center">
        <p className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[3.5rem] font-semibold leading-tight">
          O'zbekiston bo'ylab yetqazib beramiz!
        </p>
        <FaCheckCircle className="text-[#a30f0f] text-[3rem] sm:text-[4rem] md:text-[5rem] lg:text-[6rem]" />
      </div>

      {/* Lottie animatsiya */}
      <div className="flex justify-center items-center w-full">
      <Player
  autoplay
  loop
  src={truckAnimation}
  className="w-[400px] sm:w-[500px] md:w-[600px] h-auto scale-[1.5]"
/>

      </div>
    </section>
  );
};

export default Delivery;
