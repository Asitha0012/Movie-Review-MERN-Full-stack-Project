import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MovieCard from "../pages/Movies/MovieCard";

const SliderUtil = ({ data }) => {
  if (!data) {
    return null; // Return null if data is undefined
  }

  const settings = {
    dots: true,
    infinite: data.length > 1, // Only enable infinite scrolling if there is more than one movie
    speed: 500,
    slidesToShow: Math.min(data.length, 4), // Show up to 4 slides, but no more than the number of movies
    slidesToScroll: Math.min(data.length, 2), // Scroll up to 2 slides, but no more than the number of movies
  };

  return (
    <div className="relative -ml-4">
      <Slider {...settings}>
        {data.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </Slider>
    </div>
  );
};

export default SliderUtil;