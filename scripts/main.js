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
    }, 50);

    // Show options container sooner
    setTimeout(() => {
        optionsContainer.style.display = 'block';
    }, 330);

    // Show first button with less delay
    setTimeout(() => {
        aboutButton.classList.add('show');
    }, 660);

    // Show second button with less delay
    setTimeout(() => {
        movieButton.classList.add('show');
    }, 1000);

    // Show third button with less delay
    setTimeout(() => {
        booksButton.classList.add('show');
    }, 1330);

    // Smooth scroll to About section on button click
    aboutButton.addEventListener('click', () => {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
    });

    // Add error handling for page transitions
    const navigateWithFallback = (url) => {
        try {
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                window.location.href = url;
            }, 500);
        } catch (error) {
            console.error('Navigation failed:', error);
            // Fallback to direct navigation
            window.location.href = url;
        }
    };

    // Go to Movie page on button click with fade transition
    movieButton.addEventListener('click', (e) => {
        e.preventDefault();
        navigateWithFallback('movies.html');
    });

    // Add event listener for the Books button with fade transition
    booksButton.addEventListener('click', (e) => {
        e.preventDefault();
        navigateWithFallback('books.html');
    });

    // Add hover effect sound and visual feedback
    [movieButton, aboutButton, booksButton].forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.05)';
            // Optional: Add subtle hover sound
            // playHoverSound();
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });
        
        // Add click feedback
        button.addEventListener('click', () => {
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 100);
        });
    });

    // Add ARIA labels and roles
    [movieButton, aboutButton, booksButton].forEach(button => {
        button.setAttribute('role', 'button');
        button.setAttribute('tabindex', '0');
        
        // Handle keyboard navigation
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });

    const lastModified = new Date(document.lastModified);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    lastUpdated.textContent = `Last Updated: ${lastModified.toLocaleDateString('en-US', options)}`;
});