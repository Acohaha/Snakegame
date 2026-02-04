const heartsContainer = document.querySelector('.hearts');

function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');

    // random position
    heart.style.left = Math.random() * window.innerWidth + 'px';

    // random size
    const size = 10 + Math.random() * 20;
    heart.style.width = size + 'px';
    heart.style.height = size + 'px';

    // random animation duration
    const duration = 3 + Math.random() * 3;
    heart.style.animationDuration = duration + 's';

    heartsContainer.appendChild(heart);

    // remove heart after animation
    setTimeout(() => {
        heart.remove();
    }, duration * 1000);
}

// generate hearts every 300ms
setInterval(createHeart, 300);
