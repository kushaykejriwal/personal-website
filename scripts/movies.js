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
    const UP_NEXT_URL = 'https://opensheet.elk.sh/1DrMTcBc4FqPaQLmQoe_dWiE4AJ5ATJeI9lcztnwvYeQ/Up%20Next';

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
            console.log('Fetch response:', response);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            movies = await response.json();
            console.log('Movies:', movies);
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
            if (!document.getElementById('recommendUserName').value.trim()) {
                throw new Error('Please enter your name');
            }
            if (!document.getElementById('recommendTitle').value.trim()) {
                throw new Error('Please enter a movie title');
            }

            const recommendation = {
                Timestamp: new Date().toISOString(),
                Name: document.getElementById('recommendUserName').value,
                'Movie Title': document.getElementById('recommendTitle').value,
                Year: document.getElementById('recommendYear').value || 'Unknown',
                Reason: document.getElementById('recommendReason').value || 'No reason provided',
                Status: 'New'
            };
        
            const response = await fetch(UP_NEXT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(recommendation)
            });
        
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        
            document.getElementById('recommendForm').reset();
            recommendModal.style.display = 'none';
            showNotification('Thank you for your recommendation!', 'success');
        } catch (error) {
            console.error('Error:', error);
            showNotification(error.message || 'Error submitting recommendation. Please try again.', 'error');
        }
    });
    
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
    
        setTimeout(() => {
            notification.classList.add('fade-out');
            // Wait for animation to finish before removing element
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 2500);
    }

    searchInput.addEventListener('input', () => {
        clearSearchBtn.style.display = searchInput.value ? 'block' : 'none';
    });
    
    // Clear search when button is clicked
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        renderMovies(movies);  // Reset to show all movies
    });

    // Mobile-specific dropdown handling
    if (window.innerWidth <= 768) {
        const filterDropdowns = document.querySelectorAll('.filter-dropdown');
        
        document.addEventListener('click', (e) => {
            if (!e.target.classList.contains('filter-dropdown')) {
                filterDropdowns.forEach(dropdown => {
                    dropdown.blur();
                });
            }
        });

        filterDropdowns.forEach(dropdown => {
            dropdown.addEventListener('click', () => {
                filterDropdowns.forEach(other => {
                    if (other !== dropdown) other.blur();
                });
            });
            
            dropdown.addEventListener('change', (e) => {
                e.target.style.color = e.target.value ? 'white' : '#666';
            });
        });
    }

    [ratingFilter, directorFilter, genreFilter].forEach(filter => {
        filter.addEventListener('change', filterMovies);
    });

    loadMovies();
});