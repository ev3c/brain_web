/**
 * Tu Cerebro High-Tech - JavaScript Principal
 * Animaciones, interactividad y efectos visuales
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initCounterAnimations();
    initSenseCardInteractions();
    initNeuralBackground();
    initSmoothScroll();
    initHeaderScroll();
    initDiagramControls();
});

/**
 * Animaciones al hacer scroll
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Añadir delay escalonado para elementos en grid
                const siblings = entry.target.parentElement.children;
                const index = Array.from(siblings).indexOf(entry.target);
                entry.target.style.transitionDelay = `${index * 0.1}s`;
            }
        });
    }, observerOptions);

    // Observar elementos animables
    const animatableElements = document.querySelectorAll(
        '.stat-card, .sense-card, .pathway-step, .visual-fact, .region'
    );
    
    animatableElements.forEach(el => observer.observe(el));
}

/**
 * Animación de contadores numéricos
 */
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target);
                animateCounter(counter, target);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element, target) {
    const duration = 2000;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    const easeOutQuad = t => t * (2 - t);
    
    let frame = 0;
    const counter = setInterval(() => {
        frame++;
        const progress = easeOutQuad(frame / totalFrames);
        const currentValue = Math.round(target * progress);
        
        element.textContent = currentValue;
        
        if (frame === totalFrames) {
            clearInterval(counter);
            element.textContent = target;
        }
    }, frameDuration);
}

/**
 * Interacciones de las tarjetas de sentidos
 */
function initSenseCardInteractions() {
    const senseCards = document.querySelectorAll('.sense-card');
    
    senseCards.forEach(card => {
        // Efecto de hover con seguimiento del mouse
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                translateY(-8px) 
                scale(1.02)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
        
        // Click para expandir información
        card.addEventListener('click', () => {
            card.classList.toggle('expanded');
        });
    });
}

/**
 * Fondo neural interactivo
 */
function initNeuralBackground() {
    const background = document.querySelector('.neural-background');
    if (!background) return;
    
    // Crear puntos sinápticos adicionales
    const synapticContainer = document.querySelector('.synaptic-pulses');
    
    for (let i = 0; i < 30; i++) {
        const pulse = document.createElement('div');
        pulse.className = 'synaptic-dot';
        pulse.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: ${getRandomAccentColor()};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.5 + 0.2};
            animation: synapsePulse ${Math.random() * 4 + 3}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        synapticContainer.appendChild(pulse);
    }
    
    // Añadir estilos de animación
    const style = document.createElement('style');
    style.textContent = `
        @keyframes synapsePulse {
            0%, 100% { 
                opacity: 0.2; 
                transform: scale(1);
            }
            50% { 
                opacity: 0.8; 
                transform: scale(1.5);
                box-shadow: 0 0 10px currentColor;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Efecto parallax sutil con el mouse
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        
        background.style.transform = `translate(${x}px, ${y}px)`;
    });
}

function getRandomAccentColor() {
    const colors = [
        '#ff6b9d', // pink
        '#4ecdc4', // cyan
        '#a855f7', // purple
        '#ff8c42', // orange
        '#ffd93d', // yellow
        '#6bcb77', // green
        '#4d96ff', // blue
        '#ff6b6b'  // red
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Smooth scroll para navegación
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Controles del diagrama (zoom y pantalla completa)
 */
function initDiagramControls() {
    const diagramFrame = document.querySelector('.diagram-frame');
    const diagramImg = document.querySelector('.brain-diagram-img');
    const zoomInBtn = document.querySelector('.control-btn.zoom-in');
    const zoomOutBtn = document.querySelector('.control-btn.zoom-out');
    const fullscreenBtn = document.querySelector('.control-btn.fullscreen');
    
    if (!diagramFrame || !diagramImg) return;
    
    let currentZoom = 1;
    let isFullscreen = false;
    
    // Zoom In
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            if (currentZoom < 3) {
                currentZoom += 0.5;
                diagramImg.style.transform = `scale(${currentZoom})`;
                diagramImg.style.cursor = 'grab';
            }
        });
    }
    
    // Zoom Out
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            if (currentZoom > 1) {
                currentZoom -= 0.5;
                diagramImg.style.transform = `scale(${currentZoom})`;
                if (currentZoom === 1) {
                    diagramImg.style.cursor = 'zoom-in';
                }
            }
        });
    }
    
    // Fullscreen Toggle
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            isFullscreen = !isFullscreen;
            diagramFrame.classList.toggle('fullscreen', isFullscreen);
            document.body.style.overflow = isFullscreen ? 'hidden' : '';
            
            if (!isFullscreen) {
                currentZoom = 1;
                diagramImg.style.transform = '';
            }
        });
    }
    
    // Click on image to toggle zoom
    diagramImg.addEventListener('click', (e) => {
        if (!isFullscreen) {
            // Enter fullscreen on click
            isFullscreen = true;
            diagramFrame.classList.add('fullscreen');
            document.body.style.overflow = 'hidden';
        } else {
            // Toggle zoom in fullscreen
            if (currentZoom === 1) {
                currentZoom = 2;
                diagramImg.style.transform = `scale(${currentZoom})`;
                diagramImg.style.cursor = 'zoom-out';
            } else {
                currentZoom = 1;
                diagramImg.style.transform = '';
                diagramImg.style.cursor = 'zoom-in';
            }
        }
    });
    
    // Close fullscreen with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isFullscreen) {
            isFullscreen = false;
            diagramFrame.classList.remove('fullscreen');
            document.body.style.overflow = '';
            currentZoom = 1;
            diagramImg.style.transform = '';
        }
    });
    
    // Drag to pan when zoomed
    let isDragging = false;
    let startX, startY, scrollLeft, scrollTop;
    
    diagramImg.addEventListener('mousedown', (e) => {
        if (currentZoom > 1) {
            isDragging = true;
            diagramImg.style.cursor = 'grabbing';
            startX = e.pageX - diagramFrame.offsetLeft;
            startY = e.pageY - diagramFrame.offsetTop;
            scrollLeft = diagramFrame.scrollLeft;
            scrollTop = diagramFrame.scrollTop;
        }
    });
    
    diagramImg.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - diagramFrame.offsetLeft;
        const y = e.pageY - diagramFrame.offsetTop;
        const walkX = (x - startX) * 2;
        const walkY = (y - startY) * 2;
        
        const translateX = walkX;
        const translateY = walkY;
        
        diagramImg.style.transform = `scale(${currentZoom}) translate(${translateX}px, ${translateY}px)`;
    });
    
    diagramImg.addEventListener('mouseup', () => {
        isDragging = false;
        if (currentZoom > 1) {
            diagramImg.style.cursor = 'grab';
        }
    });
    
    diagramImg.addEventListener('mouseleave', () => {
        isDragging = false;
    });
}

/**
 * Efecto del header al hacer scroll
 */
function initHeaderScroll() {
    const header = document.querySelector('.main-header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Añadir sombra cuando se hace scroll
        if (currentScroll > 50) {
            header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
            header.style.background = 'rgba(10, 10, 15, 0.98)';
        } else {
            header.style.boxShadow = 'none';
            header.style.background = 'linear-gradient(to bottom, rgba(10, 10, 15, 0.95), rgba(10, 10, 15, 0.8))';
        }
        
        // Ocultar/mostrar header según dirección del scroll
        if (currentScroll > lastScroll && currentScroll > 300) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
}

/**
 * Animación del diagrama de neurona
 */
function initNeuronAnimation() {
    const signalPulse = document.querySelector('.signal-pulse');
    
    if (signalPulse) {
        // La animación ya está definida en CSS
        // Aquí podemos añadir interactividad adicional
        
        signalPulse.addEventListener('animationiteration', () => {
            // Crear efecto de "disparo" en los terminales
            const terminals = document.querySelectorAll('.terminal::after');
            terminals.forEach((terminal, index) => {
                setTimeout(() => {
                    terminal.style.animation = 'terminalFire 0.3s ease';
                }, index * 100);
            });
        });
    }
}

/**
 * Efecto de tipeo para textos
 */
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

/**
 * Crear conexiones neurales aleatorias (efecto visual)
 */
function createNeuralConnections() {
    const canvas = document.createElement('canvas');
    canvas.id = 'neural-canvas';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        opacity: 0.3;
    `;
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 2 + 1,
            color: getRandomAccentColor()
        };
    }
    
    function init() {
        resize();
        particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push(createParticle());
        }
    }
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((p, i) => {
            // Actualizar posición
            p.x += p.vx;
            p.y += p.vy;
            
            // Rebotar en bordes
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            
            // Dibujar partícula
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            
            // Conectar partículas cercanas
            particles.slice(i + 1).forEach(p2 => {
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(168, 85, 247, ${1 - distance / 150})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(draw);
    }
    
    window.addEventListener('resize', resize);
    init();
    draw();
}

// Inicializar conexiones neurales si el rendimiento lo permite
if (window.matchMedia('(min-width: 768px)').matches) {
    // createNeuralConnections(); // Descomentar para activar el canvas de partículas
}

/**
 * Preloader (opcional)
 */
function initPreloader() {
    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="brain-loader"></div>
            <p>Cargando sinapsis...</p>
        </div>
    `;
    preloader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #0a0a0f;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: opacity 0.5s ease;
    `;
    
    document.body.prepend(preloader);
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.remove(), 500);
        }, 1000);
    });
}

/**
 * Verificar si la imagen del diagrama existe
 */
function checkDiagramImage() {
    const img = document.querySelector('.brain-diagram-img');
    if (!img) return;
    
    img.addEventListener('error', () => {
        // Si la imagen no carga, mostrar placeholder con instrucciones
        const container = img.parentElement;
        const placeholder = document.createElement('div');
        placeholder.className = 'diagram-placeholder';
        placeholder.innerHTML = `
            <div class="placeholder-content">
                <div class="placeholder-icon">🧠</div>
                <h3>Imagen del Diagrama</h3>
                <p>Para mostrar el diagrama completo, guarda la imagen como:</p>
                <code>brain.jpg</code>
                <p class="placeholder-hint">en la carpeta del proyecto</p>
            </div>
        `;
        placeholder.style.cssText = `
            width: 100%;
            min-height: 400px;
            background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(78, 205, 196, 0.1));
            border: 2px dashed rgba(168, 85, 247, 0.5);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .placeholder-content {
                padding: 3rem;
            }
            .placeholder-icon {
                font-size: 4rem;
                margin-bottom: 1rem;
                animation: pulse 2s ease-in-out infinite;
            }
            .placeholder-content h3 {
                font-family: var(--font-display);
                font-size: 1.5rem;
                color: var(--accent-purple);
                margin-bottom: 1rem;
            }
            .placeholder-content p {
                color: var(--text-secondary);
                margin-bottom: 0.5rem;
            }
            .placeholder-content code {
                display: inline-block;
                background: rgba(78, 205, 196, 0.2);
                color: var(--accent-cyan);
                padding: 0.5rem 1rem;
                border-radius: 8px;
                font-size: 1.1rem;
                margin: 1rem 0;
            }
            .placeholder-hint {
                font-size: 0.9rem;
                color: var(--text-muted);
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
        `;
        document.head.appendChild(style);
        
        img.style.display = 'none';
        container.insertBefore(placeholder, img);
    });
}

// Llamar al verificar imagen
checkDiagramImage();

// Debugging info
console.log('%c🧠 Tu Cerebro High-Tech', 'font-size: 24px; font-weight: bold; color: #a855f7;');
console.log('%c86 mil millones de neuronas trabajando para ti', 'font-size: 12px; color: #4ecdc4;');

