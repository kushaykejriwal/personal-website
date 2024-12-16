document.addEventListener('DOMContentLoaded', () => {
    const movieGrid = document.getElementById('movieGrid');
    const movieSearch = document.getElementById('movieSearch');
    const ratingFilter = document.getElementById('ratingFilter');
    const directorFilter = document.getElementById('directorFilter');
    const genreFilter = document.getElementById('genreFilter');

    const movies = [
        {
            title: 'Inception',
            year: 2010,
            poster: 'images/movies/inception.jpg',
            rating: 5,
            director: 'Christopher Nolan',
            genre: ['Sci-Fi', 'Action']
        },
        {
            title: 'The Dark Knight',
            year: 2008,
            poster: 'images/movies/dark-knight.jpg',
            rating: 5,
            director: 'Christopher Nolan',
            genre: ['Action', 'Drama']
        }
    ];

    function generateStarRating(rating) {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    }

    function renderMovies(movieList) {
        movieGrid.innerHTML = '';
        movieList.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');
            movieCard.innerHTML = `
                <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
                <div class="movie-info">
                    <div class="movie-title">${movie.title}</div>
                    <div class="movie-year">${movie.year}</div>
                    <div class="movie-rating">${generateStarRating(movie.rating)}</div>
                </div>
            `;
            movieGrid.appendChild(movieCard);
        });
    }

    function populateFilters() {
        const directors = [...new Set(movies.map(m => m.director))];
        const genres = [...new Set(movies.flatMap(m => m.genre))];
        
        directors.forEach(director => {
            const option = document.createElement('option');
            option.value = director;
            option.textContent = director;
            directorFilter.appendChild(option);
        });

        genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            genreFilter.appendChild(option);
        });

        for(let i = 5; i >= 1; i--) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = '★'.repeat(i);
            ratingFilter.appendChild(option);
        }
    }

    function filterMovies() {
        let filtered = movies;
        const ratingVal = ratingFilter.value;
        const directorVal = directorFilter.value;
        const genreVal = genreFilter.value;

        if (ratingVal) filtered = filtered.filter(m => m.rating >= parseInt(ratingVal));
        if (directorVal) filtered = filtered.filter(m => m.director === directorVal);
        if (genreVal) filtered = filtered.filter(m => m.genre.includes(genreVal));

        renderMovies(filtered);
    }

    movieSearch.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = movies.filter(movie => 
            movie.title.toLowerCase().includes(query)
        );
        renderMovies(filtered);
    });

    [ratingFilter, directorFilter, genreFilter].forEach(filter => {
        filter.addEventListener('change', filterMovies);
    });

    populateFilters();
    renderMovies(movies);
});