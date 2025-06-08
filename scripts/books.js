// Define color mapping for genres/tags
const genreColors = {
    'photography': '#818CF8',    // Indigo
    'technology': '#6B7280',     // Gray
    'history': '#92400E',        // Brown
    'science': '#059669',        // Green
    'philosophy': '#9333EA',     // Purple
    'psychology': '#DB2777',     // Pink
    'economics': '#2563EB',      // Blue
    'medicine': '#DC2626',       // Red
    'biography': '#D97706',      // Orange
    'fiction': '#4F46E5',        // Indigo
    'non-fiction': '#4B5563'     // Gray
};

// Define tag mapping (if you want to display different text than the raw tag)
const tagMap = {
    'photography': 'Photography',
    'technology': 'Technology',
    'history': 'History',
    'science': 'Science',
    'philosophy': 'Philosophy',
    'psychology': 'Psychology',
    'economics': 'Economics',
    'medicine': 'Medicine',
    'biography': 'Biography',
    'fiction': 'Fiction',
    'non-fiction': 'Non-Fiction'
    // Add more mappings as needed
};

document.addEventListener('DOMContentLoaded', () => {
    // Add margin/padding above the books emoji
    const booksEmoji = document.querySelector('.books-emoji');
    if (booksEmoji) {
        booksEmoji.style.marginTop = '2rem'; // Adds space above the emoji
    }
    
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
        const bookDiv = document.createElement('div');
        bookDiv.classList.add('book');

        const img = document.createElement('img');
        img.src = coverURL;
        img.alt = tags;
        img.classList.add('book-cover');

        const tagsContainer = document.createElement('div');
        tagsContainer.classList.add('tags-container');

        // Only take the first tag
        const firstTag = tags.split(',')[0].trim().toLowerCase();
        const mappedTag = tagMap[firstTag] || firstTag;
        const tagElement = document.createElement('span');
        tagElement.textContent = mappedTag.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        tagElement.classList.add('book-tag', `tag-${firstTag.replace(/\s+/g, '-')}`);
        
        tagsContainer.appendChild(tagElement);

        bookDiv.appendChild(img);
        bookDiv.appendChild(tagsContainer);

        // Add click handler for modal
        bookDiv.addEventListener('click', () => {
            createAndShowModal(coverURL, tags);
        });

        return bookDiv;
    }

    function createAndShowModal(coverURL, tags) {
        // Create modal elements
        const modal = document.createElement('div');
        modal.className = 'book-modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'book-modal-content';
        
        // Create close button
        const closeButton = document.createElement('button');
        closeButton.className = 'modal-close';
        closeButton.innerHTML = '×';
        closeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            closeModal();
        });
        
        // Create image
        const img = document.createElement('img');
        img.src = coverURL;
        img.alt = tags;
        img.className = 'modal-book-cover';
        
        // Create tags container
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'modal-tags';
        
        // Add tags
        tags.split(',').forEach(tag => {
            const trimmedTag = tag.trim().toLowerCase();
            const mappedTag = tagMap[trimmedTag] || trimmedTag;
            const tagElement = document.createElement('span');
            tagElement.textContent = mappedTag.split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            tagElement.className = `modal-book-tag tag-${trimmedTag.replace(/\s+/g, '-')}`;
            
            tagsContainer.appendChild(tagElement);
        });
        
        // Assemble modal
        modalContent.appendChild(closeButton);
        modalContent.appendChild(img);
        modalContent.appendChild(tagsContainer);
        modal.appendChild(modalContent);
        
        // Add to document
        document.body.appendChild(modal);
        
        // Trigger animation
        requestAnimationFrame(() => {
            modal.classList.add('show');
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', handleEscape);
        
        function handleEscape(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        }
        
        function closeModal() {
            modal.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', handleEscape);
            }, 300);
        }
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