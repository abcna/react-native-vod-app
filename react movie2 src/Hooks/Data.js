import React from 'react'
import { useState } from 'react';
import News from '../components/Pages/News';
const [newMovies,setNewMovies] = useState([])
useEffect(() => {
    fetch(
      "https://api.themoviedb.org/3/movie/upcoming?api_key=26b842803ccbaba051d1fd7169b8d506&language=en-US&page=1"
    )
      .then((response) => response.json())
      .then((data) => setNewMovies(data));
  }, []);
  
  export default newMovies