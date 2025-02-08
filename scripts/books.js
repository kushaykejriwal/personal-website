// Define tag mapping dictionary
const tagMap = {
    "business": "Business",
    "management": "Business",
    "planning": "Strategy",
    "goal": "Productivity",
    "psychology": "Psychology",
    "success": "Self-improvement",
    "performance": "Productivity",
    "leadership": "Leadership",
    "entrepreneurship": "Entrepreneurship",
    "economics": "Economics",
    "finance": "Finance",
    "education": "Education",
    "social": "Social Issues",
    "history": "History",
    "science": "Science",
    "technology": "Technology",
    "innovation": "Innovation",
    "communication": "Communication",
    "strategy": "Strategy",
    "philosophy": "Philosophy",
    "politics": "Politics",
    "government": "Politics",
    "world politics": "Politics",
    "geopolitics": "Geopolitics",
    "international relations": "Geopolitics",
    "international security": "Geopolitics",
    "geopolítica": "Politics",
    "política mundial": "Politics",
    "géopolitique": "Politics",
    "relations internationales": "International Affairs"
};

document.addEventListener('DOMContentLoaded', () => {
    const SHEET_ID = '18dIV_dmoZIY2panv3gTvqFiDjhKhhWWofeWDJK8O-j8';
    const SHEET_NAME = 'Recents & Favorites';
    const URL = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

    const recentsContainer = document.querySelector('.latest-reads .scroll-container');
    const favoritesContainer = document.querySelector('.favorite-reads .scroll-container');

    fetch(URL)
        .then(response => response.json())
        .then(data => {
            console.log('Fetched data:', data); // Debug log
            data.forEach(row => {
                const { Tags, Category } = row;
                console.log('Processing book:', Tags, Category); // Debug log
                const coverURL = row['Cover URL'];
                const bookElement = createBookElement(Tags, coverURL);

                if (Category.toLowerCase() === 'favorites') {
                    favoritesContainer.appendChild(bookElement);
                } else if (Category.toLowerCase() === 'recents') {
                    recentsContainer.appendChild(bookElement);
                }
            });
        })
        .catch(error => console.error('Error fetching data:', error));

    function createBookElement(tags, coverURL) {
        console.log('Original tags:', tags); // Debug log
        // Define color mapping for different genres
        const genreColors = {
            'Business': '#4F46E5',        // Indigo
            'Strategy': '#2563EB',        // Blue
            'Productivity': '#0EA5E9',    // Light Blue
            'Psychology': '#EC4899',      // Pink
            'Self-improvement': '#8B5CF6', // Purple
            'Leadership': '#F59E0B',      // Amber
            'Entrepreneurship': '#10B981', // Emerald
            'Economics': '#059669',       // Green
            'Finance': '#047857',         // Dark Green
            'Education': '#6366F1',       // Violet
            'Social Issues': '#DC2626',   // Red
            'History': '#854D0E',         // Brown
            'Science': '#0891B2',         // Cyan
            'Technology': '#4B5563',      // Gray
            'Innovation': '#7C3AED',      // Purple
            'Communication': '#DB2777',   // Pink
            'Philosophy': '#6D28D9',      // Purple
            'Politics': '#991B1B',        // Dark Red
            'Geopolitics': '#7F1D1D',     // Darker Red
            'International Affairs': '#9D174D' // Dark Pink
        };

        const bookDiv = document.createElement('div');
        bookDiv.classList.add('book');

        const img = document.createElement('img');
        img.src = coverURL;
        img.alt = tags;
        img.classList.add('book-cover');

        const tagsContainer = document.createElement('div');
        tagsContainer.classList.add('tags-container');

        tags.split(',').forEach(tag => {
            const trimmedTag = tag.trim().toLowerCase();
            const mappedTag = tagMap[trimmedTag] || trimmedTag;
            const tagElement = document.createElement('span');
            // Capitalize the first letter of each word
            tagElement.textContent = mappedTag.split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            tagElement.classList.add('book-tag');
            
            // Apply color based on genre
            const color = genreColors[mappedTag] || '#4F46E5'; // Default to indigo if no color match
            tagElement.style.backgroundColor = color;
            
            tagsContainer.appendChild(tagElement);
        });

        bookDiv.appendChild(img);
        bookDiv.appendChild(tagsContainer);

        return bookDiv;
    }

    window.scrollLeftContainer = function(containerId) {
        console.log(`Scrolling left: ${containerId}`);
        const container = document.getElementById(containerId);
        container.scrollBy({ left: -150, behavior: 'smooth' });
    };

    window.scrollRightContainer = function(containerId) {
        console.log(`Scrolling right: ${containerId}`);
        const container = document.getElementById(containerId);
        container.scrollBy({ left: 150, behavior: 'smooth' });
    };
}); 