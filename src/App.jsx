import { useEffect, useState } from "react";
import React from "react";
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
	method: 'GET',
	headers: {
		Authorization: `Bearer ${API_KEY}`,
		accept: "application/json",
	},
};

const App = () => {
	// console.log(import.meta.env);
	console.log(API_KEY)
	const [searchTerm, setSearchTerm] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [movieList, setMovieList] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
	useDebounce(() => setDebouncedSearchTerm(searchTerm), 700, [searchTerm])

	const fetchMovies = async (query = "") => {
		setIsLoading(true);
    setErrorMessage("");
		try {
			// const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
			const endpoint = query ?
			  `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
			  : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
			const response = await fetch(endpoint, API_OPTIONS);
			if (!response.ok) {
        throw new Error("Gagal Memuat Data Film")
			}
			const data = await response.json();
			if (data.response == "false") {
				setErrorMessage(data.Error || "Failed to Fetch Movies");
				setMovieList([]);
				return;
			}
			setMovieList(data.results || []);
			console.log(data);
		} catch (error) {
			console.error(`Error: ${error}`);
			setErrorMessage("Error Fetching Movies");
		} finally {
			setIsLoading(false);
		}
	};
	useEffect(() => {
		fetchMovies(debouncedSearchTerm);
	}, [debouncedSearchTerm]);
	
	return (
		<main>
			<div className="pattern"></div>
			<div className="wrapper">
				<header>
					<img src="./hero.png" alt="Hero Banner" />
					<h1 className="mt-[40px]">
						Temukan <span className="text-gradient">Film</span> Favoritmu di
						sini!
					</h1>
					<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
				</header>

				<section className="all-movies">
					<h2>All Movies</h2>
					{isLoading ? (
						<Spinner />
					) : errorMessage ? (
						<p className="text-red-500">{errorMessage}</p>
					) : (
						<ul>
							{movieList.map((movie) => (
								<MovieCard key={movie.id} movie={movie} />
							))}
						</ul>
					)}
				</section>
			</div>
		</main>
	);
};

export default App;
