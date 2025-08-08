import React, { useState, useRef, useId, useEffect } from "react";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";

interface UserVehicle {
  garage_id: number;
  user_id: number;
  year: number;
  make: string;
  model: string;
  trim: string;
  nickname: string;
  status: 'active' | 'sold' | 'in-op';
  visibility: 'public' | 'private';
  ownership_date: string;
  photo_url: string;
}

interface VehicleSlideProps {
  vehicle: UserVehicle;
  index: number;
  current: number;
  handleSlideClick: (index: number) => void;
}

const VehicleSlide: React.FC<VehicleSlideProps> = ({ 
  vehicle, 
  index, 
  current, 
  handleSlideClick 
}) => {
  const slideRef = useRef<HTMLLIElement>(null);
  const xRef = useRef(0);
  const yRef = useRef(0);
  const frameRef = useRef<number>();

  useEffect(() => {
    const animate = () => {
      if (!slideRef.current) return;

      const x = xRef.current;
      const y = yRef.current;

      slideRef.current.style.setProperty("--x", `${x}px`);
      slideRef.current.style.setProperty("--y", `${y}px`);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent) => {
    const el = slideRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    xRef.current = event.clientX - (r.left + Math.floor(r.width / 2));
    yRef.current = event.clientY - (r.top + Math.floor(r.height / 2));
  };

  const handleMouseLeave = () => {
    xRef.current = 0;
    yRef.current = 0;
  };

  const imageLoaded = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.opacity = "1";
  };

  const formatVehicleName = (vehicle: UserVehicle): string => {
    return vehicle.nickname || `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
  };

  const formatVehicleSubtitle = (vehicle: UserVehicle): string => {
    return `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`;
  };

  return (
    <div className="[perspective:1200px] [transform-style:preserve-3d]">
      <li
        ref={slideRef}
        className="flex flex-1 flex-col items-center justify-center relative text-center text-white opacity-100 transition-all duration-300 ease-in-out w-[80vmin] h-[60vmin] mx-[2vmin] z-10 cursor-pointer"
        onClick={() => handleSlideClick(index)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform:
            current !== index
              ? "scale(0.95) rotateX(4deg)"
              : "scale(1) rotateX(0deg)",
          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          transformOrigin: "bottom",
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-full bg-gray-900 rounded-lg overflow-hidden transition-all duration-150 ease-out shadow-lg"
          style={{
            transform:
              current === index
                ? "translate3d(calc(var(--x) / 30), calc(var(--y) / 30), 0)"
                : "none",
          }}
        >
          {vehicle.photo_url ? (
            <img
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-600 ease-in-out"
              style={{
                opacity: current === index ? 1 : 0.7,
              }}
              alt={formatVehicleName(vehicle)}
              src={vehicle.photo_url}
              onLoad={imageLoaded}
              loading="eager"
              decoding="sync"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
              <div className="text-center">
                <Eye className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-300 text-sm">No photo available</p>
              </div>
            </div>
          )}
          {current === index && (
            <div className="absolute inset-0 bg-black/20 transition-all duration-1000" />
          )}
        </div>

        <article
          className={`relative p-4 transition-opacity duration-1000 ease-in-out ${
            current === index ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-white relative mb-2">
            {formatVehicleName(vehicle)}
          </h2>
          <p className="text-sm md:text-base text-gray-300 mb-4">
            {formatVehicleSubtitle(vehicle)}
          </p>
        </article>
      </li>
    </div>
  );
};

interface CarouselControlProps {
  type: "previous" | "next";
  title: string;
  handleClick: () => void;
}

const CarouselControl: React.FC<CarouselControlProps> = ({
  type,
  title,
  handleClick,
}) => {
  const Icon = type === "previous" ? ChevronLeft : ChevronRight;
  
  return (
    <button
      className="w-12 h-12 flex items-center mx-2 justify-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full focus:border-white/40 focus:outline-none hover:-translate-y-0.5 active:translate-y-0.5 transition duration-200 text-white hover:bg-white/20"
      title={title}
      onClick={handleClick}
    >
      <Icon className="w-6 h-6" />
    </button>
  );
};

interface VehicleCarouselProps {
  vehicles: UserVehicle[];
  currentVehicleId: number;
  onVehicleChange: (vehicleId: number) => void;
}

export const VehicleCarousel: React.FC<VehicleCarouselProps> = ({ 
  vehicles, 
  currentVehicleId, 
  onVehicleChange 
}) => {
  const currentIndex = vehicles.findIndex(v => v.garage_id === currentVehicleId);
  const [current, setCurrent] = useState(Math.max(0, currentIndex));

  // Update current index when currentVehicleId changes
  useEffect(() => {
    const newIndex = vehicles.findIndex(v => v.garage_id === currentVehicleId);
    if (newIndex !== -1 && newIndex !== current) {
      setCurrent(newIndex);
    }
  }, [currentVehicleId, vehicles, current]);

  const handlePreviousClick = () => {
    const previous = current - 1;
    const newIndex = previous < 0 ? vehicles.length - 1 : previous;
    setCurrent(newIndex);
    onVehicleChange(vehicles[newIndex].garage_id);
  };

  const handleNextClick = () => {
    const next = current + 1;
    const newIndex = next === vehicles.length ? 0 : next;
    setCurrent(newIndex);
    onVehicleChange(vehicles[newIndex].garage_id);
  };

  const handleSlideClick = (index: number) => {
    if (current !== index) {
      setCurrent(index);
      onVehicleChange(vehicles[index].garage_id);
    }
  };

  const id = useId();

  if (vehicles.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <p className="text-gray-500">No vehicles found</p>
      </div>
    );
  }

  return (
    <div
      className="relative w-full max-w-6xl mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden"
      aria-labelledby={`carousel-heading-${id}`}
    >
      <div className="relative h-[60vmin] min-h-[400px] max-h-[600px]">
        <ul
          className="absolute flex transition-transform duration-1000 ease-in-out h-full items-center"
          style={{
            transform: `translateX(calc(-${current * 100}% + ${current * 4}vmin))`,
            width: `${vehicles.length * 100}%`,
          }}
        >
          {vehicles.map((vehicle, index) => (
            <VehicleSlide
              key={vehicle.garage_id}
              vehicle={vehicle}
              index={index}
              current={current}
              handleSlideClick={handleSlideClick}
            />
          ))}
        </ul>

        {vehicles.length > 1 && (
          <>
            {/* Left Arrow */}
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20">
              <CarouselControl
                type="previous"
                title="Go to previous vehicle"
                handleClick={handlePreviousClick}
              />
            </div>

            {/* Right Arrow */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20">
              <CarouselControl
                type="next"
                title="Go to next vehicle"
                handleClick={handleNextClick}
              />
            </div>
          </>
        )}

        {/* Vehicle counter */}
        {vehicles.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm">
            {current + 1} of {vehicles.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleCarousel;
