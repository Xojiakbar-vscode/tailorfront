import React from "react";
import video from '../../assets/video.mp4'

const About = () => {
  return (
    <section className="w-full h-screen overflow-hidden relative">
      {/* Video elementi */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        src={video}
      >
      </video>

      {/* Video ustidan xiralashtirish (overlay) - ixtiyoriy */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/20"></div>
    </section>
  );
};

export default About;