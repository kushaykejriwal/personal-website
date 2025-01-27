document.addEventListener('DOMContentLoaded', () => {
    const SHEET_ID = '18dIV_dmoZIY2panv3gTvqFiDjhKhhWWofeWDJK8O-j8';
    const SHEET_NAME = 'Recents & Favorites';
    const URL = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

    const recentsContainer = document.querySelector('.latest-reads .scroll-container');
    const favoritesContainer = document.querySelector('.favorite-reads .scroll-container');

    fetch(URL)
        .then(response => response.json())
        .then(data => {
            data.forEach(row => {
                const { Tags, Category } = row;
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
        const bookDiv = document.createElement('div');
        bookDiv.classList.add('book');

        const img = document.createElement('img');
        img.src = coverURL;
        img.alt = tags;
        img.classList.add('book-cover');

        const tagsContainer = document.createElement('div');
        tagsContainer.classList.add('tags-container');

        tags.split(',').forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.textContent = tag.trim();
            tagElement.classList.add('book-tag');
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