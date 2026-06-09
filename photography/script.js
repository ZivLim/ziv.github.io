/* =============================================
   JADEN — Shared Interactions
   Nav, scroll animations, lightbox, filters, counters
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ---- NAVIGATION ----
    const nav = document.getElementById('mainNav');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const navLinkEls = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 80) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }, { passive: true });

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('open');
            document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
        });
    }

    navLinkEls.forEach(link => {
        link.addEventListener('click', () => {
            if (navToggle) navToggle.classList.remove('active');
            if (navLinks) navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ---- HERO SLIDESHOW (home page) ----
    const heroSlides = document.querySelectorAll('.hero-slide');
    let currentSlide = 0;

    if (heroSlides.length > 1) {
        setInterval(() => {
            heroSlides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % heroSlides.length;
            heroSlides[currentSlide].classList.add('active');
        }, 6000);
    }

    // ---- SCROLL ANIMATIONS ----
    const animatedElements = document.querySelectorAll('[data-animate]');

    if (animatedElements.length > 0) {
        const animObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const parent = entry.target.closest('.portfolio-grid, .services-grid, .testimonials-track, .home-cta-inner');
                    const delay = parent ? [...parent.children].indexOf(entry.target) * 120 : 0;

                    setTimeout(() => {
                        entry.target.classList.add('in-view');
                    }, delay);

                    animObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

        animatedElements.forEach(el => animObserver.observe(el));
    }

    // ---- COUNTER ANIMATION ----
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');

    if (statNumbers.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(el => counterObserver.observe(el));
    }

    function animateCounter(el) {
        const target = parseInt(el.dataset.count);
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        }
        requestAnimationFrame(update);
    }

    // ---- PORTFOLIO FILTERS ----
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;

                portfolioItems.forEach(item => {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.classList.remove('hidden');
                        item.style.position = '';
                        item.style.visibility = '';
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });
    }

    // ---- LIGHTBOX ----
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const lightboxImg = document.getElementById('lightboxImg');
        const lightboxTitle = document.getElementById('lightboxTitle');
        const lightboxSub = document.getElementById('lightboxSub');
        const lightboxClose = document.getElementById('lightboxClose');
        const lightboxPrev = document.getElementById('lightboxPrev');
        const lightboxNext = document.getElementById('lightboxNext');

        let lbItems = [];
        let lbIndex = 0;

        function collectItems() {
            lbItems = [];
            document.querySelectorAll('.portfolio-item:not(.hidden)').forEach(item => {
                const img = item.querySelector('img');
                const title = item.querySelector('h3')?.textContent || '';
                const sub = item.querySelector('.portfolio-item-overlay p')?.textContent || '';
                lbItems.push({ src: img.src, title, sub });
            });
        }

        function openLightbox(index) {
            collectItems();
            lbIndex = index;
            updateLightbox();
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        function updateLightbox() {
            const item = lbItems[lbIndex];
            if (!item) return;
            lightboxImg.style.opacity = '0';
            setTimeout(() => {
                lightboxImg.src = item.src;
                lightboxImg.alt = item.title;
                lightboxTitle.textContent = item.title;
                lightboxSub.textContent = item.sub;
                lightboxImg.style.opacity = '1';
            }, 200);
        }

        portfolioItems.forEach((item) => {
            item.addEventListener('click', () => {
                const visible = [...document.querySelectorAll('.portfolio-item:not(.hidden)')];
                const idx = visible.indexOf(item);
                openLightbox(idx >= 0 ? idx : 0);
            });
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', () => {
            lbIndex = (lbIndex - 1 + lbItems.length) % lbItems.length;
            updateLightbox();
        });
        lightboxNext.addEventListener('click', () => {
            lbIndex = (lbIndex + 1) % lbItems.length;
            updateLightbox();
        });
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') { lbIndex = (lbIndex - 1 + lbItems.length) % lbItems.length; updateLightbox(); }
            if (e.key === 'ArrowRight') { lbIndex = (lbIndex + 1) % lbItems.length; updateLightbox(); }
        });
    }

    // ---- SMOOTH SCROLL for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = target.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({ top: offset, behavior: 'smooth' });
            }
        });
    });

    // ---- CONTACT FORM ----
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = document.getElementById('formSubmit');
            const original = btn.textContent;
            btn.textContent = 'SENDING...';
            btn.style.opacity = '0.6';
            btn.disabled = true;

            setTimeout(() => {
                btn.textContent = '✓ MESSAGE SENT';
                btn.style.background = '#22c55e';
                btn.style.opacity = '1';

                setTimeout(() => {
                    btn.textContent = original;
                    btn.style.background = '';
                    btn.disabled = false;
                    contactForm.reset();
                }, 3000);
            }, 1500);
        });
    }

    // ---- PARALLAX on hero (home page) ----
    const hero = document.getElementById('hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            if (scrollY < hero.offsetHeight) {
                const heroBg = hero.querySelector('.hero-bg');
                if (heroBg) heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
            }
        }, { passive: true });
    }

    // ---- SERVICE CARD GLOW ----
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.background = `radial-gradient(300px circle at ${x}px ${y}px, rgba(255, 59, 59, 0.04), var(--charcoal-light) 60%)`;
        });
        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('service-card--featured')) {
                card.style.background = 'var(--charcoal-light)';
            } else {
                card.style.background = '';
            }
        });
    });
    
    // ---- 2D FILM GALLERY SCROLL & VIEWER ----
    const filmTrackContainer = document.getElementById('filmTrackContainer');
    const filmTrack = document.getElementById('filmTrack');
    
    // Animation observer for unspooling effect
    if (filmTrack) {
        // Set initial hidden state (tucked into camera)
        const frames = filmTrack.querySelectorAll('.css-film-frame');
        frames.forEach(f => f.style.transform = 'translateX(-300px) scale(0.8) rotate(0)');
        
        const galleryObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                filmTrack.classList.add('animating-intro');
                frames.forEach((f, i) => {
                     setTimeout(() => {
                         f.style.transform = ''; // Removes inline style, falling back to CSS irregular rotations!
                     }, i * 150); // Staggered pull out
                });
                
                setTimeout(() => {
                    filmTrack.classList.remove('animating-intro');
                }, 1500);
                
                galleryObserver.disconnect();
            }
        }, { threshold: 0.3 });
        
        const section = document.getElementById('portfolio-film');
        if (section) galleryObserver.observe(section);
    }

    if (filmTrackContainer) {
        let isDown = false;
        let startX;
        let scrollLeft;

        filmTrackContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            filmTrackContainer.style.cursor = 'grabbing';
            startX = e.pageX - filmTrackContainer.offsetLeft;
            scrollLeft = filmTrackContainer.scrollLeft;
        });
        
        filmTrackContainer.addEventListener('mouseleave', () => {
            isDown = false;
            filmTrackContainer.style.cursor = 'grab';
        });
        
        filmTrackContainer.addEventListener('mouseup', () => {
            isDown = false;
            filmTrackContainer.style.cursor = 'grab';
        });
        
        filmTrackContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - filmTrackContainer.offsetLeft;
            const walk = (x - startX) * 2; // Scroll-fast speed
            filmTrackContainer.scrollLeft = scrollLeft - walk;
        });
        
        // Touch events
        filmTrackContainer.addEventListener('touchstart', (e) => {
            isDown = true;
            startX = e.touches[0].pageX - filmTrackContainer.offsetLeft;
            scrollLeft = filmTrackContainer.scrollLeft;
        }, { passive: true });
        
        filmTrackContainer.addEventListener('touchend', () => {
            isDown = false;
        });
        
        filmTrackContainer.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            const x = e.touches[0].pageX - filmTrackContainer.offsetLeft;
            const walk = (x - startX) * 2;
            filmTrackContainer.scrollLeft = scrollLeft - walk;
        }, { passive: true });
    }
    
    const photoViewer = document.getElementById('photoViewer');
    if (photoViewer) {
        const viewerImg = document.getElementById('viewerImg');
        const viewerTitle = document.getElementById('viewerTitle');
        const viewerSub = document.getElementById('viewerSub');
        const viewerClose = document.getElementById('viewerClose');
        
        // Global function for onclick attributes in HTML
        window.openPhotoViewer = function(src, title, sub) {
            viewerImg.src = src;
            viewerTitle.textContent = title;
            viewerSub.textContent = sub;
            photoViewer.classList.add('active');
            photoViewer.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        };
        
        const closeViewer = () => {
            photoViewer.classList.remove('active');
            photoViewer.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            setTimeout(() => { viewerImg.src = ''; }, 400);
        };
        
        viewerClose.addEventListener('click', closeViewer);
        photoViewer.addEventListener('click', (e) => {
             if (e.target === photoViewer) closeViewer();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && photoViewer.classList.contains('active')) {
                closeViewer();
            }
        });
    }
});
