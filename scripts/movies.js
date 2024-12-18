let movies = []; // Define movies globally

document.addEventListener('DOMContentLoaded', () => {
    const movieGrid = document.getElementById('movieGrid');
    const movieSearch = document.getElementById('movieSearch');
    const ratingFilter = document.getElementById('ratingFilter');
    const directorFilter = document.getElementById('directorFilter');
    const genreFilter = document.getElementById('genreFilter');

    async function loadMovies() {
        try {
            const response = await fetch('https://opensheet.elk.sh/1DrMTcBc4FqPaQLmQoe_dWiE4AJ5ATJeI9lcztnwvYeQ/Form%20Responses%201');
            console.log('Fetch response:', response);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            movies = await response.json(); // Assign to global movies variable
            console.log('Movies:', movies);
            renderMovies(movies);
            populateFilters(); // Populate filters after movies are loaded
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    }

    function renderMovies(movieList) {
        movieGrid.innerHTML = '';
        movieList.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');
            movieCard.innerHTML = `
                <img src="${movie['Poster']}" alt="${movie['Movie Name']}" class="movie-poster" 
                     onerror="this.onerror=null; this.src='images/default-poster.jpg';">
                <div class="movie-info">
                    <div class="movie-title">${movie['Movie Name']}</div>
                    <div class="movie-year">${movie['Year']}</div>
                    <div class="movie-rating">${generateStarRating(movie['Rating'])}</div>
                    <div class="movie-director">Director: ${movie['Director']}</div>
                    <div class="movie-genre">Genre: ${movie['Genre']}</div>
                </div>
            `;
            movieGrid.appendChild(movieCard);
        });
    }

    function populateFilters() {
        const directors = [...new Set(movies.map(m => m['Director']))];
        const genres = [...new Set(movies.flatMap(m => m['Genre'].split(', ')))];
        const ratings = [...new Set(movies.map(m => parseFloat(m['Rating'])))]; // Extract unique ratings
    
        // Populate Director filter
        // Populate Director filter (sorted alphabetically)
        directors.sort(); // Sort the directors alphabetically
        directors.forEach(director => {
            const option = document.createElement('option');
            option.value = director;
            option.textContent = director;
            directorFilter.appendChild(option);
        });
    
        // Populate Genre filter
        genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            genreFilter.appendChild(option);
        });
    
        // Populate Rating filter dynamically (show stars instead of numbers)
        ratings.sort((a, b) => b - a); // Sort ratings in descending order
        ratings.forEach(rating => {
            const option = document.createElement('option');
            option.value = rating; // Keep the numeric value for filtering
            option.textContent = generateStarRating(rating); // Display stars instead of numbers
            ratingFilter.appendChild(option);
        });
    }

    function generateStarRating(rating) {
        const fullStars = Math.floor(rating); // Number of full stars
        const hasHalfStar = rating % 1 !== 0; // Check if there's a half star
    
        return '★'.repeat(fullStars) + (hasHalfStar ? '½' : ''); // No extra stars
    }

    function filterMovies() {
        let filtered = movies;
        const ratingVal = ratingFilter.value;
        const directorVal = directorFilter.value;
        const genreVal = genreFilter.value;

        if (ratingVal) filtered = filtered.filter(m => parseFloat(m['Rating']) === parseFloat(ratingVal));
        if (directorVal) filtered = filtered.filter(m => m['Director'] === directorVal);
        if (genreVal) filtered = filtered.filter(m => m['Genre'].includes(genreVal));

        renderMovies(filtered);
    }

    movieSearch.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = movies.filter(movie => 
            movie['Movie Name'].toLowerCase().includes(query)
        );
        renderMovies(filtered);
    });

    [ratingFilter, directorFilter, genreFilter].forEach(filter => {
        filter.addEventListener('change', filterMovies);
    });

    loadMovies();
});