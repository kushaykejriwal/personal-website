
document.addEventListener('DOMContentLoaded', () => {
    const messageRow = document.getElementById('messageRow');
    const optionsContainer = document.getElementById('optionsContainer');
    const movieButton = document.getElementById('movieButton');
    const aboutButton = document.getElementById('aboutButton');
    const booksButton = document.getElementById('booksButton');
    const aboutSection = document.getElementById('aboutSection');

    // Show message with fade in
    setTimeout(() => {
        messageRow.classList.remove('hidden');
    }, 500);

    // Show options container
    setTimeout(() => {
        optionsContainer.style.display = 'block';
    }, 1200);

    // Show first button with a delay
    setTimeout(() => {
        aboutButton.classList.add('show');
    }, 1500);

    // Show second button after a delay
    setTimeout(() => {
        movieButton.classList.add('show');
    }, 1800);

    setTimeout(() => {
        booksButton.classList.add('show');
    }, 2200);

    // Smooth scroll to About section on button click
    aboutButton.addEventListener('click', () => {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
    });

    const lastModified = new Date(document.lastModified);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    lastUpdated.textContent = `Last Updated: ${lastModified.toLocaleDateString('en-US', options)}`;
});