/* ==========================================================================
   Samuel R. - Cyber Security Portfolio Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialise Background Node Network Canvas
    initNodeNetwork();

    // 2. Hero Section Typing Effect
    initHeroTyping();

    // 3. SOC Interactive Terminal
    initSOCTerminal();

    // 4. Achievement Counters
    initCounters();

    // 5. Interactive SVG Diagrams Hover/Click Details
    initSVGInteraction();

    // 6. Contact Form Security Log Simulation
    initContactForm();

    // 7. Mobile Menu Toggle
    initMobileMenu();
});

/* ==========================================================================
   1. Interactive Node Network Background
   ========================================================================== */
function initNodeNetwork() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    const maxParticles = Math.min(60, Math.floor((width * height) / 20000));
    const connectionDist = 120;
    
    let mouse = { x: null, y: null };

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Boundary checks with snapping to avoid jitter during resize
            if (this.x < 0) {
                this.x = 0;
                this.vx *= -1;
            } else if (this.x > width) {
                this.x = width;
                this.vx *= -1;
            }

            if (this.y < 0) {
                this.y = 0;
                this.vy *= -1;
            } else if (this.y > height) {
                this.y = height;
                this.vy *= -1;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
            ctx.fill();
        }
    }

    // Spawn Particles
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Check distance to other particles
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDist) {
                    const alpha = (1 - dist / connectionDist) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(189, 0, 255, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }

            // Check distance to mouse
            if (mouse.x !== null && mouse.y !== null) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDist * 1.5) {
                    const alpha = (1 - dist / (connectionDist * 1.5)) * 0.25;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

/* ==========================================================================
   2. Typing Effect for Hero Subtitle
   ========================================================================== */
function initHeroTyping() {
    const typingElement = document.getElementById('hero-typing-target');
    if (!typingElement) return;

    const phrases = [
        'SOC Analyst',
        'Cyber Security Analyst',
        'Blue Team Practitioner',
        'Threat Detection Specialist',
        'Incident Responder'
    ];

    let currentPhraseIdx = 0;
    let currentCharIdx = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentPhrase = phrases[currentPhraseIdx];
        
        if (isDeleting) {
            typingElement.textContent = currentPhrase.substring(0, currentCharIdx - 1);
            currentCharIdx--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = currentPhrase.substring(0, currentCharIdx + 1);
            currentCharIdx++;
            typingSpeed = 100;
        }

        if (!isDeleting && currentCharIdx === currentPhrase.length) {
            // Pause at the end of the word
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && currentCharIdx === 0) {
            isDeleting = false;
            currentPhraseIdx = (currentPhraseIdx + 1) % phrases.length;
            typingSpeed = 500; // brief pause before next word
        }

        setTimeout(type, typingSpeed);
    }

    setTimeout(type, 500);
}

/* ==========================================================================
   3. Interactive SOC Terminal Simulator
   ========================================================================== */
function initSOCTerminal() {
    const inputField = document.getElementById('terminal-input');
    const historyContainer = document.getElementById('terminal-history');
    const terminalBody = document.getElementById('terminal-body');
    const quickButtons = document.querySelectorAll('.term-btn');

    if (!inputField || !historyContainer) return;

    const commands = {
        help: 'List of available commands:\n - about    : Professional bio & summary\n - skills   : Samuel\'s technology stack & tools\n - projects : View core security projects & code repositories\n - certs    : Credentials & industry certifications\n - contact  : Secure contact details\n - clear    : Clear terminal screen\n - analyze  : Run a simulation of a security alert log investigation',
        about: 'Samuel R. | Cyber Security Analyst & SOC Analyst\n---------------------------------------------\nLocation: Tamil Nadu, India\nFocus: Log analysis, incident monitoring, and blue team engineering.\nPassionate about threat detection using Splunk & Wazuh, network capture parsing with Wireshark, and mapping adversarial behaviors to the MITRE ATT&CK framework.',
        skills: 'SKILLS DIRECTORY:\n=================\n[SIEM & Monitoring] : Splunk, Wazuh, Log Analysis, Alert Investigation\n[Threat Detection]  : MITRE ATT&CK mapping, IOC Analysis, Threat Intel\n[Security Tools]    : Nessus, Wireshark, Burp Suite, OSINT Tools\n[Networking]        : TCP/IP, Packet Analysis, DNS Security, Firewall Fundamentals\n[Environments]      : Kali Linux, Windows Security\n[Frameworks]        : OWASP Top 10, ISO 27001, GDPR, HIPAA',
        projects: 'CORE SECURITY PROJECT PORTFOLIO:\n===============================\n1. SECUREID NETWORK\n   Digital identity system using blockchain protocols.\n   Repo: github.com/sam-2105/secureid-network\n\n2. HASHLOCK\n   File integrity validator & tamper detection tool.\n   Repo: github.com/sam-2105/hashlock',
        certs: 'CERTIFICATION ROSTER:\n====================\n- EC-Council Certified SOC Analyst (CSA)\n- Certified Blue Team Practitioner\n- Certified IT Infrastructure & Cyber SOC Analyst\n- Certified Network Security Practitioner\n- CSI Linux Certified Investigator\n- Cisco Introduction to Cybersecurity\n- NPTEL Programming in Java\n- NPTEL Cloud Computing',
        contact: 'SECURE CHANNELS:\n================\n- Email    : rsamuel2105@gmail.com\n- LinkedIn : linkedin.com/in/samuelr21\n- GitHub   : github.com/sam-2105',
        clear: 'clear'
    };

    // Auto-welcome message
    writeToTerminal('Type "help" to view directory actions, or select a preset shortcut below.', 'info');

    // Button clicks trigger commands
    quickButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const cmd = btn.getAttribute('data-cmd');
            executeCommand(cmd);
        });
    });

    // Handle user inputs
    inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const val = inputField.value.trim().toLowerCase();
            inputField.value = '';
            if (val) executeCommand(val);
        }
    });

    function executeCommand(cmdStr) {
        // Output prompt command line
        writeToTerminal(`guest@samuel-soc-terminal:~$ ${cmdStr}`, 'input');

        if (cmdStr === 'clear') {
            historyContainer.innerHTML = '';
            return;
        }

        if (cmdStr === 'analyze') {
            runSimulation();
            return;
        }

        if (commands[cmdStr]) {
            writeToTerminal(commands[cmdStr], 'output');
        } else {
            writeToTerminal(`Command not found: "${cmdStr}". Type "help" for a list of valid actions.`, 'error');
        }
    }

    function writeToTerminal(text, type = 'output') {
        const line = document.createElement('div');
        line.className = `term-line ${type}`;
        line.textContent = text;
        historyContainer.appendChild(line);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    // Alert simulation steps
    function runSimulation() {
        inputField.disabled = true;
        const steps = [
            { text: '[*] [SOC-AGENT] Launching SIEM log parser pipeline...', type: 'info', delay: 400 },
            { text: '[!] [ALERT] HIGH priority rule triggered: "Multiple Failed SSH Logins Followed by Successful Login" on Host: PROD-DB-01', type: 'error', delay: 1000 },
            { text: '[*] [Triage] Retrieving source IP: 198.51.100.42 (Location: Unknown, Tor Exit Node confirmed)', type: 'info', delay: 1600 },
            { text: '[*] [Threat Hunting] Correlating with endpoint telemetry... Found process spawns: /bin/bash execution from sshd child process.', type: 'info', delay: 2400 },
            { text: '[!] [Indicators] Escalated user privileges detected: UID changed from 1004 (dbuser) to 0 (root). Privilege escalation exploit suspected.', type: 'error', delay: 3200 },
            { text: '[*] [Remediation] Recommending isolation of host PROD-DB-01 and disabling compromised DB credentials.', type: 'info', delay: 4000 },
            { text: '[SUCCESS] Incident log generated. Incident Response ticket IR-2026-4482 filed. Host status: QUARANTINED.', type: 'success', delay: 4800 }
        ];

        steps.forEach(step => {
            setTimeout(() => {
                writeToTerminal(step.text, step.type);
                if (step.text.includes('QUARANTINED')) {
                    inputField.disabled = false;
                    inputField.focus();
                }
            }, step.delay);
        });
    }
}

/* ==========================================================================
   4. Scroll-Triggered Counters Animation
   ========================================================================== */
function initCounters() {
    const counters = document.querySelectorAll('.counter-animate');
    if (counters.length === 0) return;

    const speed = 100; // The lower the slower

    const startCount = (entry) => {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'));
        const count = parseInt(counter.innerText);
        const increment = Math.ceil(target / speed);

        if (count < target) {
            counter.innerText = count + increment;
            setTimeout(() => startCount(entry), 20);
        } else {
            counter.innerText = target + '+';
        }
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.innerText = '0';
                startCount(entry);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

/* ==========================================================================
   5. Interactive SVG Diagram Nodes Interaction
   ========================================================================== */
function initSVGInteraction() {
    const svgNodes = document.querySelectorAll('.svg-node');
    const detailPanel = document.createElement('div');
    
    detailPanel.style.position = 'absolute';
    detailPanel.style.background = 'rgba(5, 10, 25, 0.95)';
    detailPanel.style.border = '1px solid var(--cyan)';
    detailPanel.style.borderRadius = '4px';
    detailPanel.style.padding = '0.75rem 1rem';
    detailPanel.style.fontSize = '0.8rem';
    detailPanel.style.fontFamily = 'var(--font-mono)';
    detailPanel.style.color = '#fff';
    detailPanel.style.zIndex = '10';
    detailPanel.style.display = 'none';
    detailPanel.style.pointerEvents = 'none';
    detailPanel.style.boxShadow = 'var(--shadow-cyan)';
    detailPanel.style.maxWidth = '250px';

    const visualWraps = document.querySelectorAll('.project-visual');
    visualWraps.forEach(wrap => {
        wrap.style.position = 'relative';
    });

    svgNodes.forEach(node => {
        node.addEventListener('mouseenter', (e) => {
            const parentWrap = node.closest('.project-visual');
            if (!parentWrap) return;

            parentWrap.appendChild(detailPanel);
            
            const info = node.getAttribute('data-info') || 'Interactive Component';
            detailPanel.textContent = info;
            detailPanel.style.display = 'block';

            // Position calculation
            const rect = node.getBoundingClientRect();
            const parentRect = parentWrap.getBoundingClientRect();
            
            const left = rect.left - parentRect.left + (rect.width / 2) - 125;
            const top = rect.top - parentRect.top - 50;

            detailPanel.style.left = `${Math.max(10, Math.min(parentRect.width - 260, left))}px`;
            detailPanel.style.top = `${Math.max(10, top)}px`;
        });

        node.addEventListener('mouseleave', () => {
            detailPanel.style.display = 'none';
        });
    });
}

/* ==========================================================================
   6. Contact Form Security Simulation
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get fields
        const name = document.getElementById('form-name').value;
        const email = document.getElementById('form-email').value;
        const msg = document.getElementById('form-msg').value;

        if (!name || !email || !msg) return;

        // Visual alert simulation in terminal-like dialog
        const originalBtnText = form.querySelector('button').innerHTML;
        const btn = form.querySelector('button');
        btn.disabled = true;
        btn.innerHTML = '<span class="hero-pulse"></span> PROCESSING TRANSMISSION...';

        setTimeout(() => {
            btn.style.background = 'var(--green)';
            btn.style.borderColor = 'var(--green)';
            btn.style.color = '#000';
            btn.innerHTML = 'SUCCESS: TRANSMISSION SECURED';
            
            // Output confirmation log to user
            alert(`[LOG] Communication channel secure.\n\nFrom: ${name} <${email}>\nStatus: Message queued. Samuel R. will respond shortly.\nKey Signature: SHA256 VALIDATED`);
            
            // Reset form
            form.reset();
            
            setTimeout(() => {
                btn.disabled = false;
                btn.style.background = '';
                btn.style.borderColor = '';
                btn.style.color = '';
                btn.innerHTML = originalBtnText;
            }, 3000);
        }, 1500);
    });
}

/* ==========================================================================
   7. Mobile Menu Trigger
   ========================================================================== */
function initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        if (menu.style.display === 'flex') {
            menu.style.display = '';
            toggle.innerHTML = '&#9776;';
        } else {
            menu.style.display = 'flex';
            menu.style.flexDirection = 'column';
            menu.style.position = 'absolute';
            menu.style.top = '100%';
            menu.style.left = '0';
            menu.style.width = '100%';
            menu.style.background = 'rgba(5, 8, 20, 0.98)';
            menu.style.borderBottom = '1px solid var(--border-color)';
            menu.style.padding = '1.5rem';
            menu.style.gap = '1.5rem';
            toggle.innerHTML = '&times;';
        }
    });

    // Close menu when links are clicked
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                menu.style.display = '';
                toggle.innerHTML = '&#9776;';
            }
        });
    });

    // Reset inline menu styles when resizing back to desktop sizes
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            menu.removeAttribute('style');
            toggle.innerHTML = '&#9776;';
        }
    });
}
