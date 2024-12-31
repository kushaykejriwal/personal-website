let movies = []; // Define movies globally

function openRecommendForm(movieTitle) {
    const modal = document.getElementById('recommendModal');
    const titleInput = document.getElementById('recommendTitle');
    titleInput.value = movieTitle;
    modal.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    const movieGrid = document.getElementById('movieGrid');
    const movieSearch = document.getElementById('movieSearch');
    const ratingFilter = document.getElementById('ratingFilter');
    const directorFilter = document.getElementById('directorFilter');
    const genreFilter = document.getElementById('genreFilter');
    const UP_NEXT_URL = 'https://script.google.com/macros/s/AKfycbzD6gqGP82tnSqKhRWSDPInMcBJA-8e7bcylZNx-pbJTsU0VbC_Jm9Vp2M75xnfYDLaZg/exec';

    // Modal elements
    const movieModal = document.getElementById('movieModal');
    const recommendModal = document.getElementById('recommendModal');
    const movieCloseBtn = document.querySelector('.movie-close');
    const recommendCloseBtn = document.querySelector('.recommend-close');
    const clearSearchBtn = document.getElementById('clearSearch');
    const searchInput = document.getElementById('movieSearch');

    // Modal close functionality
    movieCloseBtn.addEventListener('click', () => {
        movieModal.style.display = 'none';
    });

    recommendCloseBtn.addEventListener('click', () => {
        recommendModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === movieModal) {
            movieModal.style.display = 'none';
        }
        if (event.target === recommendModal) {
            recommendModal.style.display = 'none';
        }
    });

    async function loadMovies() {
        try {
            const response = await fetch('https://opensheet.elk.sh/1DrMTcBc4FqPaQLmQoe_dWiE4AJ5ATJeI9lcztnwvYeQ/Watched');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            movies = await response.json();
            
            // Hide skeleton and show content
            document.getElementById('skeletonGrid').style.display = 'none';
            movieGrid.classList.remove('loading');
            
            renderMovies(movies);
            populateFilters();
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
                <img src="${movie['Poster']}" alt="${movie['Movie Name']}" class="movie-poster">
                <div class="movie-info">
                    <div class="movie-title">${movie['Movie Name']}</div>
                    <div class="movie-year">${movie['Year']}</div>
                </div>
                <div class="movie-rating">${generateStarRating(movie['Rating'])}</div>
            `;
            
            movieCard.addEventListener('click', () => showModal(movie));
            movieGrid.appendChild(movieCard);
        });
    }
    
    function showModal(movie) {
        const modalTitle = document.getElementById('modalTitle');
        const modalInfo = document.getElementById('modalInfo');
    
        modalTitle.textContent = movie['Movie Name'];
        modalInfo.innerHTML = `
            <div class="modal-info-item">
                <span class="modal-label">Rating:</span>${generateStarRating(movie['Rating'])}
            </div>
            <div class="modal-info-item">
                <span class="modal-label">Year:</span>${movie['Year']}
            </div>
            <div class="modal-info-item">
                <span class="modal-label">Director:</span>${movie['Director']}
            </div>
            <div class="modal-info-item">
                <span class="modal-label">Genre:</span>${movie['Genre']}
            </div>
            <div class="modal-info-item">
                <span class="modal-label">Description:</span>${movie['Description'] || 'No description available'}
            </div>
            ${movie['Comments'] ? `
            <div class="modal-info-item">
                <span class="modal-label">Kushay's Comments:</span>${movie['Comments']}
            </div>
            ` : ''}
        `;
    
        movieModal.style.display = 'block';
    }

    function populateFilters() {
        const directors = [...new Set(movies.map(m => m['Director']))];
        const genres = [...new Set(movies.flatMap(m => m['Genre'].split(', ')))];
        const ratings = [...new Set(movies.map(m => parseFloat(m['Rating'])))];
    
        directors.sort();
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
    
        ratings.sort((a, b) => b - a);
        ratings.forEach(rating => {
            const option = document.createElement('option');
            option.value = rating;
            option.textContent = generateStarRating(rating);
            ratingFilter.appendChild(option);
        });
    }

    function generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        return '★'.repeat(fullStars) + (hasHalfStar ? '½' : '');
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
        
        if (filtered.length === 0 && query.length > 2) {
            movieGrid.innerHTML = '';
            
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            
            const message = document.createElement('p');
            message.textContent = `No movies found for "${e.target.value}"`;
            
            const recommendBtn = document.createElement('button');
            recommendBtn.className = 'recommend-btn';
            recommendBtn.textContent = 'Recommend this movie?';
            recommendBtn.addEventListener('click', () => openRecommendForm(e.target.value));
            
            noResults.appendChild(message);
            noResults.appendChild(recommendBtn);
            movieGrid.appendChild(noResults);
        } else {
            renderMovies(filtered);
        }
    });

    document.getElementById('recommendForm').addEventListener('submit', async (e) => {
        e.preventDefault();
    
        try {
            // Validate form data
            const userName = document.getElementById('recommendUserName').value.trim();
            const movieTitle = document.getElementById('recommendTitle').value.trim();
            const movieYear = document.getElementById('recommendYear').value || 'Unknown';
            const reason = document.getElementById('recommendReason').value || 'No reason provided';
    
            if (!userName) {
                throw new Error('Please enter your name');
            }
            if (!movieTitle) {
                throw new Error('Please enter a movie title');
            }
    
            // Create the recommendation object
            const recommendation = {
                Timestamp: new Date().toISOString(),
                Name: userName,
                'Movie Title': movieTitle,
                Year: movieYear,
                Reason: reason,
                Status: 'New'
            };
    
            console.log('Payload:', JSON.stringify(recommendation));
    
            // Close the modal immediately to prevent duplicate submissions
            recommendModal.style.display = 'none';
    
            // Make the API call
            const response = await fetch(`${UP_NEXT_URL}?payload=${encodeURIComponent(JSON.stringify(recommendation))}`, {
                method: 'GET'
            });
    
            if (!response.ok) {
                throw new Error(`Error submitting recommendation: ${response.statusText}`);
            }
    
            // Reset the form and show success notification
            document.getElementById('recommendForm').reset();
            showNotification('Thank you for your recommendation!', 'success');
        } catch (error) {
            console.error('Error submitting recommendation:', error);
            showNotification(error.message || 'Error submitting recommendation. Please try again.', 'error');
            recommendModal.style.display = 'block';
        }
    });
    
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
    
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 2500);
    }

    searchInput.addEventListener('input', () => {
        clearSearchBtn.style.display = searchInput.value ? 'block' : 'none';
    });
    
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        renderMovies(movies);
    });

    [ratingFilter, directorFilter, genreFilter].forEach(filter => {
        filter.addEventListener('change', filterMovies);
    });

    loadMovies();
});