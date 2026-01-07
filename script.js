// ===== Portfolio Museum - Enhanced Script =====

// Initialize state
let currentRoom = 'entrance';
let activeModal = null;
let currentProjectData = {
    title: '',
    description: '',
    link: '',
    category: '',
    technologies: []
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎭 Portfolio Museum Initialized');
    
    // Initialize particles
    initParticles();
    
    // Set initial active floor button
    updateFloorPlan(currentRoom);
    
    // Wire up modal close buttons
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // Close modal when clicking on overlay
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // Escape key closes modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && activeModal) {
            closeModal(activeModal);
        }
    });
    
    // Initialize animations
    setTimeout(initFloatingAnimations, 1000);
    setTimeout(initScrollAnimations, 500);
    
    // Add click sound to all buttons (optional)
    document.querySelectorAll('button, .frame, .frame-link, .quick-link').forEach(element => {
        element.addEventListener('click', function(e) {
            // Don't play sound for form submission buttons
            if (this.type !== 'submit') {
                playSound('click');
            }
        });
    });
});

// ===== Room Navigation =====
function goToRoom(roomName) {
    console.log(`Navigating to ${roomName}`);
    
    // Get current room and reset its scroll
    const currentVisibleRoom = document.querySelector('.room.visible');
    if (currentVisibleRoom) {
        currentVisibleRoom.scrollTop = 0; // Reset current room scroll
        currentVisibleRoom.classList.remove('visible');
        currentVisibleRoom.classList.add('hidden');
        
        // Ensure current room is not scrollable when hidden
        currentVisibleRoom.style.overflow = 'hidden';
    }
    
    // Show new room
    const targetRoom = document.querySelector(`.${roomName}`);
    if (targetRoom) {
        // Reset scroll position to top BEFORE showing
        targetRoom.scrollTop = 0;
        
        // Make room visible and scrollable
        targetRoom.classList.remove('hidden');
        targetRoom.classList.add('visible');
        targetRoom.style.overflow = 'auto';
        
        currentRoom = roomName;
        
        // Update floor plan
        updateFloorPlan(roomName);
        
        // Play transition sound
        playSound('transition');
        
        // Add entrance animation
        if (roomName === 'entrance') {
            const intro = document.querySelector('.intro');
            if (intro) {
                intro.style.animation = 'none';
                setTimeout(() => {
                    intro.style.animation = 'slideUp 0.8s ease-out';
                }, 10);
            }
        }
        
        // Initialize animations for the new room
        setTimeout(() => {
            const frames = targetRoom.querySelectorAll('.frame');
            frames.forEach((frame, index) => {
                frame.style.animationDelay = `${index * 0.1}s`;
                frame.classList.add('animate-in');
            });
        }, 100);
        
        // Double-check scroll is at top (safety measure)
        setTimeout(() => {
            targetRoom.scrollTop = 0;
        }, 50);
    }
}

function updateFloorPlan(roomName) {
    document.querySelectorAll('.floorplan button').forEach(button => {
        button.classList.remove('active');
        if (button.dataset.room === roomName) {
            button.classList.add('active');
        }
    });
}

// ===== Modal Functions =====
function openAvatarModal() {
    const modal = document.getElementById('avatarModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('active');
        activeModal = 'avatarModal';
        document.body.style.overflow = 'hidden';
        playSound('modalOpen');
    }
}

function openExhibit(title, description, link = '#') {
    // Store the project data
    currentProjectData = {
        title: title,
        description: description,
        link: link,
        category: getCategoryFromTitle(title),
        technologies: []
    };
    
    const modal = document.getElementById('exhibitModal');
    const titleEl = document.getElementById('exhibitTitle');
    const detailsEl = document.getElementById('exhibitDetails');
    const categoryEl = document.getElementById('exhibitCategory');
    
    if (modal && titleEl && detailsEl) {
        // Set content
        titleEl.textContent = title;
        detailsEl.textContent = description;
        
        // Set category
        if (categoryEl) {
            categoryEl.textContent = currentProjectData.category;
        }
        
        // Show modal
        modal.classList.remove('hidden');
        modal.classList.add('active');
        activeModal = 'exhibitModal';
        document.body.style.overflow = 'hidden';
        playSound('modalOpen');
    }
}

function getCategoryFromTitle(title) {
    const categories = {
        'ERP System': 'Full-Stack Development',
        'E-Commerce Store': 'Web Application',
        'My First Website': 'Frontend Development',
        'AI Chatbot': 'Artificial Intelligence',
        'Mini ERP System': 'Business Management'
    };
    
    return categories[title] || 'Project';
}

function viewProjectDetails() {
    if (currentProjectData.link && currentProjectData.link !== '#') {
        window.open(currentProjectData.link, '_blank');
        showToast(`Opening ${currentProjectData.title}...`);
    } else {
        showToast('Project link will be added soon!');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        modal.classList.add('hidden');
        activeModal = null;
        document.body.style.overflow = '';
        playSound('modalClose');
        
        // Reset animation for next open
        setTimeout(() => {
            modal.classList.remove('hidden');
        }, 300);
    }
}

function closeAvatarModal() {
    closeModal('avatarModal');
}

function closeExhibit() {
    closeModal('exhibitModal');
}

// ===== Sound Effects =====
function playSound(type) {
    // Check if user wants sound
    if (typeof window.soundEnabled === 'undefined') {
        window.soundEnabled = true; // Default to enabled
    }
    
    if (!window.soundEnabled) return;
    
    // Create audio elements for different sounds
    const sounds = {
        click: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3'),
        transition: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-cool-interface-click-tone-2568.mp3'),
        modalOpen: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-modern-technology-select-3124.mp3'),
        modalClose: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3')
    };
    
    const audio = sounds[type];
    if (audio) {
        audio.volume = 0.2;
        audio.currentTime = 0;
        audio.play().catch(e => console.log('Audio play failed (user may not have interacted yet):', e));
    }
}

// ===== Particles Background =====
function initParticles() {
    if (typeof tsParticles === 'undefined') {
        console.warn('Particles.js not loaded');
        return;
    }
    
    tsParticles.load('particles-js', {
        fullScreen: { enable: false },
        background: { color: { value: 'transparent' } },
        particles: {
            number: { value: 50, density: { enable: true, value_area: 800 } },
            color: { value: ['#00e5ff', '#ff4081', '#80deea'] },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            move: {
                enable: true,
                speed: 1,
                direction: 'none',
                random: true,
                straight: false,
                outModes: { default: 'out' }
            },
            links: {
                enable: true,
                distance: 150,
                color: '#00acc1',
                opacity: 0.2,
                width: 1
            }
        },
        interactivity: {
            events: {
                onHover: { enable: true, mode: 'repulse' },
                onClick: { enable: true, mode: 'push' }
            }
        }
    });
}

// ===== Utility Functions =====
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.remove('hidden');
        toast.classList.add('active');
        
        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 300);
        }, duration);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Email copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
        showToast('Failed to copy email');
    });
}

function downloadResume() {
    showToast('Resume download started...');
    // In a real implementation, this would trigger a file download
    setTimeout(() => {
        showToast('Ask the admin for Resume!');
    }, 1000);
}

// ===== Animation Effects =====
function initFloatingAnimations() {
    const elements = document.querySelectorAll('.frame, .skill-category, .contact-card, .stat-card');
    elements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
        el.classList.add('floating');
    });
}

// Add CSS for floating animation
const floatStyle = document.createElement('style');
floatStyle.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
    }
    .floating {
        animation: float 6s ease-in-out infinite;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    .fade-in {
        animation: fadeIn 0.5s ease-out forwards;
    }
`;
document.head.appendChild(floatStyle);

function initTechTagAnimations() {
    const techTags = document.querySelectorAll('.tech-tag');
    techTags.forEach((tag, index) => {
        tag.style.animationDelay = `${index * 0.1}s`;
        tag.classList.add('fade-in');
    });
}

// ===== Scroll Animations =====
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.frame, .skill-category, .timeline-item, .stat-card').forEach(el => {
        observer.observe(el);
    });
    
    initTechTagAnimations();
}

// ===== Add scroll detection (optional) =====
document.querySelectorAll('.room').forEach(room => {
    room.addEventListener('scroll', function() {
        // You can add scroll effects here if needed
    });
});

// Console log
console.log('✨ Portfolio script loaded successfully');