"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, MapPin, Star, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";

const MOVIES = [
  {
    id: 2,
    title: "The Dark Knight",
    image: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    rating: 9.0,
    genre: "Action",
    duration: "2h 32m",
    showtimes: ["08:30", "09:00", "12:15", "13:45", "16:00", "17:30", "19:45", "21:15", "23:00"],
  },

  {
    id: 4,
    title: "Avengers: Endgame",
    image: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    rating: 8.4,
    genre: "Action",
    duration: "3h 1m",
    showtimes: ["09:15", "10:30", "13:00", "14:00", "17:30", "18:00", "21:00", "22:30"],
  },
  {
    id: 5,
    title: "Avatar: The Way of Water",
    image: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    rating: 7.6,
    genre: "Sci-Fi",
    duration: "3h 12m",
    showtimes: ["08:00", "11:30", "15:00", "18:30", "22:00"],
  },

  {
    id: 7,
    title: "Dune: Part Two",
    image: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    rating: 8.3,
    genre: "Sci-Fi",
    duration: "2h 46m",
    showtimes: ["10:15", "13:45", "17:15", "20:45"],
  },
  {
    id: 8,
    title: "Oppenheimer",
    image: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    rating: 8.1,
    genre: "Drama",
    duration: "3h 0m",
    showtimes: ["11:00", "14:30", "18:00", "21:30"],
  },

  {
    id: 10,
    title: "Top Gun: Maverick",
    image: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
    rating: 8.2,
    genre: "Action",
    duration: "2h 10m",
    showtimes: ["10:30", "13:00", "15:30", "18:00", "20:30", "23:00"],
  },
  {
    id: 11,
    title: "Everything Everywhere All At Once",
    image: "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
    rating: 7.9,
    genre: "Adventure",
    duration: "2h 19m",
    showtimes: ["11:15", "14:00", "16:45", "19:30", "22:15"],
  },
  {
    id: 12,
    title: "Guardians of the Galaxy Vol. 3",
    image: "https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg",
    rating: 8.0,
    genre: "Action",
    duration: "2h 30m",
    showtimes: ["09:00", "12:00", "15:00", "18:00", "21:00"],
  },
  {
    id: 13,
    title: "Black Panther: Wakanda Forever",
    image: "https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg",
    rating: 7.2,
    genre: "Action",
    duration: "2h 41m",
    showtimes: ["10:00", "13:30", "17:00", "20:30"],
  },

  {
    id: 15,
    title: "Thor: Love and Thunder",
    image: "https://image.tmdb.org/t/p/w500/pIkRyD18kl4FhoCNQuWxWu5cBLM.jpg",
    rating: 6.5,
    genre: "Action",
    duration: "1h 58m",
    showtimes: ["10:45", "13:15", "15:45", "18:15", "20:45"],
  },

  {
    id: 17,
    title: "Parasite",
    image: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    rating: 8.5,
    genre: "Thriller",
    duration: "2h 12m",
    showtimes: ["11:00", "13:30", "16:00", "18:30", "21:00"],
  },
  {
    id: 18,
    title: "Coco",
    image: "https://image.tmdb.org/t/p/w500/gGEsBPAijhVUFoiNpgZXqRVWJt2.jpg",
    rating: 8.2,
    genre: "Animation",
    duration: "1h 45m",
    showtimes: ["09:00", "11:00", "13:00", "15:00", "17:00"],
  },
  {
    id: 19,
    title: "Your Name.",
    image: "https://image.tmdb.org/t/p/w500/q719jXXEzOoYaps6babgKnONONX.jpg",
    rating: 8.5,
    genre: "Animation",
    duration: "1h 46m",
    showtimes: ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"],
  },

];

export default function ChooseMoviePage() {
  const router = useRouter();
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const totalPages = Math.ceil(MOVIES.length / itemsPerPage);
  const currentMovies = MOVIES.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleTimeSelect = (movieId: number, time: string) => {
    if (selectedMovieId === movieId && selectedTime === time) {
      // Deselect if clicking the same one
      setSelectedMovieId(null);
      setSelectedTime(null);
    } else {
      setSelectedMovieId(movieId);
      setSelectedTime(time);
    }
  };

  const handleConfirm = () => {
    if (selectedMovieId && selectedTime) {
      // In a real app, you might save this to context or pass via query params
      console.log(`Selected Movie: ${selectedMovieId}, Time: ${selectedTime}`);
      router.push("/select_seat");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6 md:p-12 font-sans pb-32">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <header className="text-center space-y-4 animate-in fade-in slide-in-from-top-8 duration-700">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Choose Your Movie
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Select a movie and a showtime to begin your cinematic journey.
          </p>
        </header>

        {/* Movie Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {currentMovies.map((movie, index) => (
            <div
              key={movie.id}
              className={cn(
                "group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2",
                selectedMovieId === movie.id
                  ? "ring-2 ring-purple-500 shadow-purple-500/20 scale-[1.02]"
                  : "hover:border-gray-600"
              )}
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: "both",
              }}
            >
              {/* Image Container */}
              <div className="relative aspect-[2/3] overflow-hidden">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80" />

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 border border-white/10">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-bold">{movie.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-xl font-bold leading-tight mb-1 truncate" title={movie.title}>
                    {movie.title}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <span>{movie.genre}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-600" />
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{movie.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Showtimes */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Available Times
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {movie.showtimes.map((time) => {
                      const isSelected =
                        selectedMovieId === movie.id && selectedTime === time;
                      return (
                        <button
                          key={time}
                          onClick={() => handleTimeSelect(movie.id, time)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border",
                            isSelected
                              ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/30"
                              : "bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500"
                          )}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={cn(
                    "w-10 h-10 rounded-lg font-medium transition-all duration-200 flex items-center justify-center border",
                    currentPage === page
                      ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/30"
                      : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                  )}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {/* Footer Action */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none flex justify-center z-50">
          <button
            onClick={handleConfirm}
            disabled={!selectedMovieId || !selectedTime}
            className={cn(
              "pointer-events-auto flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg shadow-2xl transition-all duration-300 transform",
              selectedMovieId && selectedTime
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-105 hover:shadow-purple-500/40 translate-y-0 opacity-100"
                : "bg-gray-800 text-gray-500 translate-y-20 opacity-0"
            )}
          >
            <Ticket className="w-5 h-5" />
            Confirm Selection
          </button>
        </div>
      </div>
    </div>
  );
}