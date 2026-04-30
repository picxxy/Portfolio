document.addEventListener('DOMContentLoaded', () => {
    // --- Ghost Interaction Logic ---
    const ghostElement = document.getElementById('ghost-element');
    const quoteDisplay = document.getElementById('quote-display');

    const quotes = [
        "\"The only truly secure system is one that is powered off, cast in a block of concrete and sealed in a lead-lined room with armed guards.\" – Gene Spafford",
        "\"If you think technology can solve your security problems, then you don't understand the problems and you don't understand the technology.\" – Bruce Schneier",
        "\"OSINT: Because the truth is out there, usually on an unsecured S3 bucket.\"",
        "\"Digital Forensics is the art of un-deleting the truth.\"",
        "\"Threat Intelligence is finding the needle in the haystack before it pricks you.\"",
        "\"AI can't eat me, but a zero-day exploit might.\"",
        "\"Amateurs hack systems, professionals hack people.\" – Bruce Schneier",
        "\"Security is a process, not a product.\""
    ];

    let quoteTimeout;

    ghostElement.addEventListener('click', () => {
        // Pick a random quote
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        
        quoteDisplay.textContent = randomQuote;
        quoteDisplay.classList.add('show');

        // Add a little jump animation on click
        ghostElement.style.transform = 'translateY(-20px) scale(1.1)';
        setTimeout(() => {
            ghostElement.style.transform = '';
        }, 200);

        // Hide quote after 5 seconds
        clearTimeout(quoteTimeout);
        quoteTimeout = setTimeout(() => {
            quoteDisplay.classList.remove('show');
        }, 5000);
    });

    // --- Cyber Investigation Game Logic ---
    const stages = [
        {
            type: "choice",
            text: "ALERT: High CPU usage detected on WebServer-01. Which command will you use to identify the resource-heavy process?",
            choices: [
                { text: "[Run netstat]", correct: false, feedback: "netstat shows network connections, not CPU usage. Try again." },
                { text: "[Run top]", correct: true, feedback: "top reveals a hidden process named 'kthreadd_miner' using 99% CPU." }
            ]
        },
        {
            type: "choice",
            text: "Cryptominer identified. It's communicating with an external C2 server. What is the immediate containment action?",
            choices: [
                { text: "[Reboot the server]", correct: false, feedback: "Rebooting might clear RAM but the miner has persistence. Contain the network first." },
                { text: "[Isolate the host]", correct: true, feedback: "Host isolated from the main network. The miner can no longer communicate with its C2." }
            ]
        },
        {
            type: "typing",
            text: "We need to find how they got in. You inspect the auth logs and find brute-force SSH attempts from IP 203.0.113.42. Type the command to block it:",
            expected: "block 203.0.113.42",
            placeholder: "Type 'block 203.0.113.42'"
        },
        {
            type: "choice",
            text: "IP blocked. Now we must remove the miner's persistence. Where should we check for scheduled malicious tasks?",
            choices: [
                { text: "[Check crontab]", correct: true, feedback: "Found a malicious cron job downloading the miner every 5 minutes." },
                { text: "[Check /etc/hosts]", correct: false, feedback: "/etc/hosts is for DNS resolution, not scheduled tasks. Try again." }
            ]
        },
        {
            type: "typing",
            text: "Excellent. The cron job points to a script at '/tmp/update.sh'. Type the command to permanently delete this file.",
            expected: "rm -rf /tmp/update.sh",
            placeholder: "Type 'rm -rf /tmp/update.sh'"
        }
    ];

    const startGameBtn = document.getElementById('start-game-btn');
    const restartGameBtn = document.getElementById('restart-game-btn');
    const gameIntro = document.getElementById('game-intro');
    const gamePlay = document.getElementById('game-play');
    const gameOver = document.getElementById('game-over');
    
    const storyText = document.getElementById('story-text');
    const feedbackText = document.getElementById('feedback-text');
    const choicesContainer = document.getElementById('choices-container');
    const typingContainer = document.getElementById('typing-container');
    const typeInput = document.getElementById('type-input');

    let currentStageIndex = 0;
    let isPlaying = false;

    function initGame() {
        if(gameIntro) gameIntro.classList.add('hidden');
        if(gameOver) gameOver.classList.add('hidden');
        if(gamePlay) gamePlay.classList.remove('hidden');
        
        currentStageIndex = 0;
        isPlaying = true;
        if(feedbackText) feedbackText.textContent = "";
        
        showStage();
    }

    function showStage() {
        if (currentStageIndex >= stages.length) {
            endGame();
            return;
        }

        const stage = stages[currentStageIndex];
        if(storyText) storyText.textContent = stage.text;
        if(feedbackText) feedbackText.textContent = "";
        
        // Reset containers
        if(choicesContainer) {
            choicesContainer.innerHTML = "";
            choicesContainer.classList.add('hidden');
        }
        if(typingContainer) typingContainer.classList.add('hidden');
        if(typeInput) typeInput.value = "";

        if (stage.type === "choice") {
            if(choicesContainer) {
                choicesContainer.classList.remove('hidden');
                stage.choices.forEach(choice => {
                    const btn = document.createElement('button');
                    btn.className = "terminal-btn";
                    btn.style.textAlign = "left";
                    btn.style.textTransform = "none";
                    btn.textContent = choice.text;
                    btn.onclick = () => handleChoice(choice);
                    choicesContainer.appendChild(btn);
                });
            }
        } else if (stage.type === "typing") {
            if(typingContainer) typingContainer.classList.remove('hidden');
            if(typeInput) {
                typeInput.placeholder = stage.placeholder;
                typeInput.focus();
            }
        }
    }

    function handleChoice(choice) {
        if (!isPlaying) return;
        
        if (choice.correct) {
            if(feedbackText) {
                feedbackText.style.color = "#4ade80"; // green
                feedbackText.textContent = choice.feedback;
            }
            
            // Flash effect for correct
            const terminalBody = document.getElementById('terminal-body');
            if(terminalBody) {
                terminalBody.style.backgroundColor = 'rgba(74, 222, 128, 0.1)';
                setTimeout(() => terminalBody.style.backgroundColor = 'transparent', 100);
            }

            setTimeout(() => {
                currentStageIndex++;
                showStage();
            }, 2500); // Wait 2.5s to read feedback
        } else {
            if(feedbackText) {
                feedbackText.style.color = "#ef4444"; // red
                feedbackText.textContent = choice.feedback;
            }
            
            // Shake effect for wrong
            const terminalBody = document.getElementById('terminal-body');
            if(terminalBody) {
                terminalBody.style.transform = "translateX(5px)";
                setTimeout(() => terminalBody.style.transform = "translateX(-5px)", 50);
                setTimeout(() => terminalBody.style.transform = "translateX(5px)", 100);
                setTimeout(() => terminalBody.style.transform = "translateX(0)", 150);
            }
        }
    }

    if (typeInput) {
        typeInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && isPlaying) {
                const stage = stages[currentStageIndex];
                if (stage && stage.type === "typing") {
                    if (typeInput.value.trim() === stage.expected) {
                        if(feedbackText) {
                            feedbackText.style.color = "#4ade80"; // green
                            feedbackText.textContent = "Command executed successfully.";
                        }
                        
                        const terminalBody = document.getElementById('terminal-body');
                        if(terminalBody) {
                            terminalBody.style.backgroundColor = 'rgba(74, 222, 128, 0.1)';
                            setTimeout(() => terminalBody.style.backgroundColor = 'transparent', 100);
                        }

                        setTimeout(() => {
                            currentStageIndex++;
                            showStage();
                        }, 1500);
                    } else {
                        if(feedbackText) {
                            feedbackText.style.color = "#ef4444"; // red
                            feedbackText.textContent = "Syntax error or incorrect command. Try again.";
                        }
                        
                        const terminalBody = document.getElementById('terminal-body');
                        if(terminalBody) {
                            terminalBody.style.transform = "translateX(5px)";
                            setTimeout(() => terminalBody.style.transform = "translateX(-5px)", 50);
                            setTimeout(() => terminalBody.style.transform = "translateX(5px)", 100);
                            setTimeout(() => terminalBody.style.transform = "translateX(0)", 150);
                        }
                    }
                }
            }
        });
    }

    function endGame() {
        isPlaying = false;
        if(gamePlay) gamePlay.classList.add('hidden');
        if(gameOver) gameOver.classList.remove('hidden');
    }

    if (startGameBtn) startGameBtn.addEventListener('click', initGame);
    if (restartGameBtn) restartGameBtn.addEventListener('click', initGame);

    // --- Dynamic Subtitle Typewriter Logic ---
    const dynamicSubtitle = document.getElementById('dynamic-subtitle');
    if (dynamicSubtitle) {
        const roles = [
            "Ethical hacker",
            "Digital forensic expert",
            "Intervention officer",
            "Threat intelligence analyst",
            "Dark web operative",
            "Network security professional"
        ];
        
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        // Clear initial text
        dynamicSubtitle.textContent = "";
        
        function typeWriter() {
            const currentRole = roles[roleIndex];
            
            if (isDeleting) {
                dynamicSubtitle.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
            } else {
                dynamicSubtitle.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
            }
            
            // Speed of typing and deleting
            let typeSpeed = isDeleting ? 40 : 100;
            
            if (!isDeleting && charIndex === currentRole.length) {
                // Pause at the end of the word
                typeSpeed = 2000; 
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 500; // Pause before typing next word
            }
            
            setTimeout(typeWriter, typeSpeed);
        }
        
        // Start the effect
        setTimeout(typeWriter, 500);
    }

    // --- Copy Email Functionality ---
    const copyEmailBtn = document.getElementById('copy-email-btn');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const email = "sarthak.farswan16@gmail.com";
            navigator.clipboard.writeText(email).then(() => {
                const originalSVG = copyEmailBtn.innerHTML;
                // Change to checkmark icon
                copyEmailBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#27c93f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                
                setTimeout(() => {
                    copyEmailBtn.innerHTML = originalSVG;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        });
    }
});


// --- Lightbox Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const captionText = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    
    if (!lightbox || !lightboxImg) return;

    // Attach click event to terminal items
    const terminalItems = document.querySelectorAll('.terminal-item');
    terminalItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            lightbox.style.display = "block";
            lightboxImg.src = item.getAttribute('data-img');
            captionText.innerHTML = item.querySelector('.file-name').innerText;
            // Prevent scrolling on body when lightbox is open
            document.body.style.overflow = "hidden";
        });
    });

    // Attach click event to timeline items
    const timelineItems = document.querySelectorAll('.timeline-content img');
    timelineItems.forEach(img => {
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            lightbox.style.display = "block";
            lightboxImg.src = img.src;
            captionText.innerHTML = "";
            // Prevent scrolling on body when lightbox is open
            document.body.style.overflow = "hidden";
        });
    });

    // Close on X button click
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            closeLightbox();
        });
    }

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.style.display === "block") {
            closeLightbox();
        }
    });

    function closeLightbox() {
        lightbox.style.display = "none";
        document.body.style.overflow = "auto";
    }
});

// --- Carousel Logic ---
window.moveCarousel = function(carouselId, direction) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    if (!track || slides.length === 0) return;

    let currentIndex = parseInt(carousel.getAttribute('data-index') || 0);
    const totalSlides = slides.length;

    currentIndex += direction;

    if (currentIndex >= totalSlides) {
        currentIndex = 0;
    } else if (currentIndex < 0) {
        currentIndex = totalSlides - 1;
    }

    carousel.setAttribute('data-index', currentIndex);
    const offset = currentIndex * -100;
    track.style.transform = `translateX(${offset}%)`;
};


