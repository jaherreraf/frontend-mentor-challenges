console.log('FRONTENDMENTOR CHALLENGE BY JAHAERRERAF')

// GSAP Hero-style Character Animation
gsap.registerPlugin();

// Function to separate text into individual characters
function separateText() {
    const usernameElement = document.getElementById('username');
    const text = usernameElement.textContent.trim();
    
    // Clear the content
    usernameElement.innerHTML = '';
    
    // Create spans for each character
    for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');
        span.textContent = text[i];
        span.id = `char-${i}`;
        usernameElement.appendChild(span);
    }
}

// Initialize the text separation
separateText();

// Set initial state for all characters - rotating from right
gsap.set("#username span", {
    rotationY: 90,
    opacity: 0,
    transformOrigin: "left center"
});

// Create timeline for character animation
const tl = gsap.timeline({ delay: 1.5 });

// Animate each character rotating in from the right
tl.to("#username span", {
    rotationY: 0,
    opacity: 1,
    duration: 0.6,
    ease: "power2.out",
    stagger: {
        amount: 1.2,
        from: "start"
    }
});

// Add hover effect for individual characters
document.querySelectorAll("#username span").forEach((char, index) => {
    char.addEventListener('mouseenter', () => {
        gsap.to(char, {
            y: -8,
            scale: 1.3,
            color: "#2D3748",
            duration: 0.3,
            ease: "power2.out"
        });
    });
    
    char.addEventListener('mouseleave', () => {
        gsap.to(char, {
            y: 0,
            scale: 1,
            color: "",
            duration: 0.3,
            ease: "power2.out"
        });
    });
});
