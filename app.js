// Game Platform JavaScript
class GamePlatform {
  constructor() {
    this.games = [];
    this.currentCategory = this.getCurrentCategory();
    this.init();
  }

  getCurrentCategory() {
    const path = window.location.pathname;
    if (path.includes('puzzle.html')) return 'Puzzle Games';
    if (path.includes('adventure.html')) return 'Adventure Games';
    if (path.includes('car.html')) return 'Driving Games';
    if (path.includes('shooting.html')) return 'Shooting Games';
    return 'all';
  }

  async init() {
    await this.loadGames();
    this.setupEventListeners();
    this.renderGames();
    this.setupGameControls();
    this.setupLegalPages();
  }

  async loadGames() {
    try {
      const response = await fetch("./games.json");
      const data = await response.json();
      this.games = data.games;
      console.log(`Loaded ${this.games.length} games`);
      console.log("Games data:", this.games); // Add this line for debugging
    } catch (error) {
      console.error("Error loading games:", error);
      this.showError("Failed to load games. Please try again later.");
    }
  }

  setupEventListeners() {
    // Mobile menu toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle) {
      navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
      });
    }

    // Game card clicks
    document.addEventListener("click", (e) => {
      const gameCard = e.target.closest(".game-card");
      if (gameCard) {
        const gameUrl = gameCard.dataset.url;
        const gameName = gameCard.dataset.name;
        const gameDescription = gameCard.dataset.description;
        if (gameUrl) {
          e.preventDefault();
          const params = new URLSearchParams({
            url: gameUrl,
            name: gameName,
            description: gameDescription || ''
          });
          window.location.href = `gamepage.html?${params.toString()}`;
        }
      }
    });

    // Smooth scrolling for footer links
    document.addEventListener("click", (e) => {
      if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = e.target.getAttribute("href");
        const element = document.querySelector(target);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  }

  renderGames() {
    const gamesGrid = document.getElementById("games-grid");
    const loading = document.getElementById("loading");

    if (!gamesGrid) return;

    // Show loading
    loading.classList.remove("hidden");
    gamesGrid.innerHTML = "";

    // Filter games based on current category
    const gamesToShow = this.currentCategory === 'all' 
      ? this.games 
      : this.games.filter(game => game.category === this.currentCategory);

    // Hide loading and render all games
    setTimeout(() => {
      loading.classList.add("hidden");

      if (this.games.length === 0) {
        gamesGrid.innerHTML = '<p class="no-games">No games found.</p>';
        return;
      }

      // Render all game cards
      this.games.forEach((game) => {
        const gameCard = this.createGameCard(game);
        gamesGrid.appendChild(gameCard);
      });
    }, 500);
  }

  createGameCard(game) {
    const card = document.createElement("div");
    card.className = "game-card";
    card.dataset.url = game.url;
    card.dataset.name = game.name;
    card.dataset.category = game.category;
    card.dataset.description = game.description || '';
    card.title = game.name;

    card.innerHTML = `
        <img
            src="${game.image}"
            alt="${game.name}"
            class="game-image"
            onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjhGOUZBIi8+CjxjaXJjbGUgY3g9Ijc1IiBjeT0iNzUiIHI9IjMwIiBmaWxsPSIjREVFMkU2Ii8+CjxwYXRoIGQ9Ik02NSA2NUw4NSA3NUw2NSA4NVoiIGZpbGw9IiM2NjdFRUEiLz4KPHN2Zz4K'"
        >
        <div class="game-title">${game.name}</div>
    `;

    return card;
  }

  setupGameControls() {
    const playButton = document.getElementById("play-button");
    const gameOverlay = document.getElementById("game-overlay");
    const gameFrame = document.getElementById("hop-warp-game");
    const fullscreenButton = document.getElementById("fullscreen-button");

    // Play button functionality
    if (playButton && gameOverlay && gameFrame) {
      playButton.addEventListener("click", () => {
        this.startGame();
      });
    }

    // Fullscreen button functionality
    if (fullscreenButton) {
      fullscreenButton.addEventListener("click", () => {
        this.toggleFullscreen();
      });
    }

    // Listen for fullscreen changes
    document.addEventListener("fullscreenchange", () => {
      this.updateFullscreenButton();
    });
  }

  startGame() {
    const gameOverlay = document.getElementById("game-overlay");
    const gameFrame = document.getElementById("hop-warp-game");
    const fullscreenButton = document.getElementById("fullscreen-button");

    if (gameOverlay && gameFrame && fullscreenButton) {
      // Hide overlay
      gameOverlay.style.display = "none";

      // Find the hop-warp game from the loaded games
      // Find the dreadhead parkour game from the loaded games
      const featuredGame = this.games.find(
        (game) =>
          game.name.toLowerCase().includes("dreadhead") &&
          game.name.toLowerCase().includes("parkour")
      );

      if (featuredGame && featuredGame.url) {
        // Load the game from the URL in games.json
        gameFrame.src = featuredGame.url;
      } else {
        // Fallback - try to load from local path (you might want to update this path too)
        gameFrame.src = "./hop-warp/index.html";
      }

      gameFrame.style.display = "block";

      // Show fullscreen button
      fullscreenButton.style.display = "block";
    }
  }

  loadGameInFrame(gameUrl, gameName) {
    const gameOverlay = document.getElementById("game-overlay");
    const gameFrame = document.getElementById("hop-warp-game");
    const fullscreenButton = document.getElementById("fullscreen-button");

    if (gameOverlay && gameFrame && fullscreenButton) {
      // Hide overlay
      gameOverlay.style.display = "none";
      
      // Update game frame
      gameFrame.src = gameUrl;
      gameFrame.style.display = "block";
      
      // Show fullscreen button
      fullscreenButton.style.display = "block";
      
      // Update page title
      document.title = `${gameName} - Dreadhead Parkour`;
    }
  }

  toggleFullscreen() {
    const gameWrapper = document.querySelector(".game-wrapper");

    if (!document.fullscreenElement) {
      // Enter fullscreen
      if (gameWrapper.requestFullscreen) {
        gameWrapper.requestFullscreen();
      } else if (gameWrapper.webkitRequestFullscreen) {
        gameWrapper.webkitRequestFullscreen();
      } else if (gameWrapper.msRequestFullscreen) {
        gameWrapper.msRequestFullscreen();
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }

  updateFullscreenButton() {
    const fullscreenButton = document.getElementById("fullscreen-button");
    if (fullscreenButton) {
      const isFullscreen = !!document.fullscreenElement;
      fullscreenButton.innerHTML = isFullscreen
        ? `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M3 7H5V5H7V3H3V7ZM13 3V5H15V7H17V3H13ZM17 13H15V15H13V17H17V13ZM7 17V15H5V13H3V17H7Z" fill="white"/>
                </svg>`
        : `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M3 3H7V5H5V7H3V3ZM17 3V7H15V5H13V3H17ZM17 17H13V15H15V13H17V17ZM3 17V13H5V15H7V17H3Z" fill="white"/>
                </svg>`;
    }
  }

  setupLegalPages() {
    const modal = document.getElementById("legal-modal");
    const closeModal = document.querySelector(".close-modal");

    // Legal page links
    document.addEventListener("click", (e) => {
      if (e.target.matches("[data-page]")) {
        e.preventDefault();
        const page = e.target.dataset.page;
        this.showLegalPage(page);
      }
    });

    // Close modal
    if (closeModal) {
      closeModal.addEventListener("click", () => {
        modal.style.display = "none";
      });
    }

    // Close modal when clicking outside
    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });

    // Close modal with Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.style.display === "block") {
        modal.style.display = "none";
      }
    });
  }

  showLegalPage(page) {
    const modal = document.getElementById("legal-modal");
    const modalBody = document.getElementById("modal-body");

    const content = this.getLegalPageContent(page);
    modalBody.innerHTML = content;
    modal.style.display = "block";
  }

  getLegalPageContent(page) {
    const contents = {
      about: `
                <h1>About Us</h1>
                <p>Welcome to Play Hop, your ultimate destination for free online games!</p>
                <h2>Our Mission</h2>
                <p>At Play Hop, we believe that gaming should be accessible, fun, and free for everyone. Our mission is to provide a comprehensive platform where players of all ages can discover and enjoy a vast collection of high-quality games without any barriers.</p>
                <h2>What We Offer</h2>
                <p>• <strong>Hundreds of Free Games:</strong> From puzzle games to action-packed adventures, we have something for every gaming preference.</p>
                <p>• <strong>Instant Play:</strong> No downloads, no installations - just click and play!</p>
                <p>• <strong>Regular Updates:</strong> We continuously add new games to keep our collection fresh and exciting.</p>
                <p>• <strong>Safe Gaming Environment:</strong> All our games are carefully selected and tested for quality and safety.</p>
                <h2>Our Story</h2>
                <p>Play Hop was founded with the simple idea that great games should be available to everyone, everywhere. We started as a small team of gaming enthusiasts who wanted to create a platform that celebrates the joy of gaming.</p>
                <p>Today, we're proud to serve thousands of players worldwide, providing them with endless hours of entertainment and fun.</p>
            `,
      contact: `
                <h1>Contact Us</h1>
                <p>We'd love to hear from you! Whether you have questions, suggestions, or just want to say hello, don't hesitate to reach out.</p>
                <h2>Get in Touch</h2>
                <p><strong>Email:</strong> support@playhop.com</p>
                <p><strong>Business Inquiries:</strong> business@playhop.com</p>
                <p><strong>Technical Support:</strong> tech@playhop.com</p>
                <h2>Feedback & Suggestions</h2>
                <p>Your feedback is incredibly valuable to us. If you have ideas for new games, suggestions for improving our platform, or any other feedback, please don't hesitate to contact us.</p>
                <h2>Game Submissions</h2>
                <p>Are you a game developer interested in featuring your game on Play Hop? We're always looking for high-quality games to add to our collection. Please reach out to us with your game details and we'll be happy to review it.</p>
                <h2>Response Time</h2>
                <p>We strive to respond to all inquiries within 24-48 hours. For technical issues, we aim to provide faster response times to ensure you can get back to gaming as quickly as possible.</p>
            `,
      privacy: `
                <h1>Privacy Policy</h1>
                <p><strong>Last updated:</strong> January 2024</p>
                <h2>Information We Collect</h2>
                <p>We collect minimal information to provide you with the best gaming experience:</p>
                <p>• <strong>Usage Data:</strong> We collect anonymous data about how you use our website to improve our services.</p>
                <p>• <strong>Device Information:</strong> Basic information about your device and browser to ensure compatibility.</p>
                <p>• <strong>Cookies:</strong> We use cookies to remember your preferences and improve your experience.</p>
                <h2>How We Use Your Information</h2>
                <p>• To provide and maintain our gaming platform</p>
                <p>• To improve our website and user experience</p>
                <p>• To analyze usage patterns and optimize performance</p>
                <p>• To ensure the security and integrity of our platform</p>
                <h2>Information Sharing</h2>
                <p>We do not sell, trade, or otherwise transfer your personal information to third parties. We may share anonymous, aggregated data for analytical purposes.</p>
                <h2>Data Security</h2>
                <p>We implement appropriate security measures to protect your information against unauthorized access, alteration, disclosure, or destruction.</p>
                <h2>Your Rights</h2>
                <p>You have the right to access, update, or delete any personal information we may have about you. Contact us if you wish to exercise these rights.</p>
                <h2>Changes to This Policy</h2>
                <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
            `,
      terms: `
                <h1>Terms of Use</h1>
                <p><strong>Last updated:</strong> January 2024</p>
                <h2>Acceptance of Terms</h2>
                <p>By accessing and using Play Hop, you accept and agree to be bound by the terms and provision of this agreement.</p>
                <h2>Use License</h2>
                <p>Permission is granted to temporarily access Play Hop for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                <p>• Modify or copy the materials</p>
                <p>• Use the materials for any commercial purpose or for any public display</p>
                <p>• Attempt to reverse engineer any software contained on the website</p>
                <p>• Remove any copyright or other proprietary notations from the materials</p>
                <h2>User Conduct</h2>
                <p>You agree to use Play Hop responsibly and not to:</p>
                <p>• Violate any applicable laws or regulations</p>
                <p>• Interfere with or disrupt the website or servers</p>
                <p>• Attempt to gain unauthorized access to any part of the website</p>
                <p>• Upload or transmit viruses or malicious code</p>
                <h2>Game Content</h2>
                <p>All games on Play Hop are provided for entertainment purposes only. We do not guarantee the availability of any specific game and reserve the right to add or remove games at any time.</p>
                <h2>Disclaimer</h2>
                <p>The materials on Play Hop are provided on an 'as is' basis. Play Hop makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                <h2>Limitations</h2>
                <p>In no event shall Play Hop or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use Play Hop, even if Play Hop or its authorized representative has been notified orally or in writing of the possibility of such damage.</p>
            `,
    };

    return (
      contents[page] ||
      "<h1>Page Not Found</h1><p>The requested page could not be found.</p>"
    );
  }

  showError(message) {
    const gamesGrid = document.getElementById("games-grid");
    const loading = document.getElementById("loading");

    if (loading) loading.classList.add("hidden");
    if (gamesGrid) {
      gamesGrid.innerHTML = `<p class="error-message" style="text-align: center; color: #dc3545; padding: 2rem;">${message}</p>`;
    }
  }
}

// Initialize the platform when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new GamePlatform();
});

// Add some utility functions
function resizeGameFrame() {
  const gameWrapper = document.querySelector(".game-wrapper");
  if (gameWrapper && window.innerWidth < 768) {
    gameWrapper.style.height = "400px";
  } else if (gameWrapper) {
    gameWrapper.style.height = "680px";
  }
}

// Resize game frame on window resize
window.addEventListener("resize", resizeGameFrame);
window.addEventListener("load", resizeGameFrame);
