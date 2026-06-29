/* ============================================
   IDEAL BLISTER — Interactive Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar scroll effect ─────────────── */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile menu toggle ───────────────── */
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    // Mobile dropdown toggle logic
    const dropdownToggle = document.getElementById('sectorsDropdownToggle');
    const dropdownContainer = dropdownToggle ? dropdownToggle.parentElement : null;
    if (dropdownToggle && dropdownContainer) {
      dropdownToggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          dropdownContainer.classList.toggle('active');
        }
      });
    }

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('open');
        if (dropdownContainer) {
          dropdownContainer.classList.remove('active');
        }
      });
    });
  }

  /* ── Scroll reveal animations ─────────── */
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ── Animated counters ────────────────── */
  const counterElements = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = prefix + current.toLocaleString('tr-TR') + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  /* ── Smooth scroll for anchor links ───── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── File upload interaction ──────────── */
  const fileUpload = document.getElementById('fileUpload');
  const fileInput = document.getElementById('fileInput');
  const fileUploadText = document.getElementById('fileUploadText');

  if (fileUpload && fileInput) {
    fileUpload.addEventListener('click', () => fileInput.click());

    fileUpload.addEventListener('dragover', (e) => {
      e.preventDefault();
      fileUpload.style.borderColor = 'var(--blue-500)';
      fileUpload.style.background = 'var(--blue-100)';
    });

    fileUpload.addEventListener('dragleave', () => {
      fileUpload.style.borderColor = '';
      fileUpload.style.background = '';
    });

    fileUpload.addEventListener('drop', (e) => {
      e.preventDefault();
      fileUpload.style.borderColor = '';
      fileUpload.style.background = '';
      if (e.dataTransfer.files.length > 0) {
        fileInput.files = e.dataTransfer.files;
        updateFileName(e.dataTransfer.files);
      }
    });

    fileInput.addEventListener('change', () => {
      updateFileName(fileInput.files);
    });

    function updateFileName(files) {
      if (files.length > 0) {
        const names = Array.from(files).map(f => f.name).join(', ');
        fileUploadText.innerHTML = `<strong style="color: var(--green-600);">✓ ${files.length} dosya seçildi:</strong> ${names}`;
      }
    }
  }

  /* ── Quote form submission ────────────── */
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Visual feedback
      const btn = quoteForm.querySelector('.btn-submit');
      const originalText = btn.textContent;
      btn.textContent = 'Gönderiliyor...';
      btn.style.opacity = '0.7';
      btn.disabled = true;

      // Simulate submission (replace with real endpoint)
      setTimeout(() => {
        btn.textContent = '✓ Gönderildi!';
        btn.style.opacity = '1';
        btn.style.background = 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)';
        btn.style.color = '#fff';
        showToast('Talebiniz alınmıştır. Teknik ekibimiz 24 saat içinde size dönüş yapacaktır.');

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.style.color = '';
          btn.disabled = false;
          quoteForm.reset();
          if (fileUploadText) {
            fileUploadText.innerHTML = '<span>Dosya yüklemek için tıklayın</span> veya sürükleyin';
          }
        }, 3000);
      }, 1200);
    });
  }

  /* ── Footer call-back form ────────────── */
  const callForm = document.getElementById('callBackForm');
  if (callForm) {
    callForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = callForm.querySelector('.footer-call-input');
      if (input && input.value.trim()) {
        showToast('Numaranız alındı. En kısa sürede sizi arayacağız!');
        input.value = '';
      }
    });
  }

  /* ── Toast notification ───────────────── */
  function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    if (toast && toastMessage) {
      toastMessage.textContent = message;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 4500);
    }
  }

  /* ── Sector Image Modal (Dynamic) ────── */
  const sectorData = {
    'sektor-kozmetik': {
      title: "Kozmetik Sektörü Örnekleri",
      desc: "Kozmetik ürünler için kristal netliğinde, şık ve koruyucu blister/vakum ambalaj çözümlerimiz.",
      images: [
        { src: "images/kozmetik_ruj.png", title: "Ruj Blister Ambalaj" },
        { src: "images/kozmetik_goz.png", title: "3'lü Göz Kalemi Seti Askılı Blister" },
        { src: "images/kozmetik_pudra.png", title: "12'li Far Tavası" },
        { src: "images/kozmetik_tirnak.png", title: "Tırnak Seti Karton Blister Ambalaj" }
      ]
    },
    'sektor-kirtasiye': {
      title: "Kırtasiye Sektörü Örnekleri",
      desc: "Kırtasiye sektörü için ürettiğimiz çeşitli blister ve seperatör ambalaj çözümleri.",
      images: [
        { src: "images/kirtasiye_kalem.png", title: "4'lü Kalem Seti Blister Ambalajı" },
        { src: "images/kirtasiye_pastel.png", title: "Pastel Boya Seperatörü" },
        { src: "images/kirtasiye_bant.png", title: "Bant ve Makas Blister Ambalajı" },
        { src: "images/kirtasiye_silgi.png", title: "Uçlu Kalem ve Silgi Seti Blister" }
      ]
    },
    'sektor-hirdavat': {
      title: "Hırdavat Sektörü Örnekleri",
      desc: "Hırdavat sektörü için ürettiğimiz yüksek mukavemetli blister ve kutu ambalaj çözümleri.",
      images: [
        { src: "images/hirdavat_delme.png", title: "Delme ve Vidalama Uçları Seti Ambalajı" },
        { src: "images/hirdavat_kontrol.png", title: "Kontrol Kalemi ve İzole Bant Elektrik Blister Ambalaj" },
        { src: "images/hirdavat_vida.png", title: "Askılı 20'li Vida Seti PVC Kutu" },
        { src: "images/hirdavat_pense.png", title: "Pense Blister Ambalaj" }
      ]
    },
    'sektor-oyuncak': {
      title: "Oyuncak Sektörü Örnekleri",
      desc: "Oyuncak sektörü için göz alıcı, sağlam ve güvenli blister ambalaj çözümlerimiz.",
      images: [
        { src: "images/oyuncak_asker.png", title: "Asker Seti Blister Ambalaj" },
        { src: "images/oyuncak_mutfak.png", title: "Mutfak Seti Karton Blister Ambalaj" },
        { src: "images/oyuncak_traktor.png", title: "Traktör Vakum Ambalaj" },
        { src: "images/oyuncak_pingpong.png", title: "Masa Tenisi Raketi ve Topu Blister" }
      ]
    }
  };

  const imageModal = document.getElementById('sectorImageModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalGrid = document.getElementById('modalGrid');
  const modalClose = document.getElementById('modalClose');
  const modalOverlay = document.getElementById('modalOverlay');

  if (imageModal && modalTitle && modalDesc && modalGrid && modalClose && modalOverlay) {
    
    // Attach click listeners to all clickable sector cards
    document.querySelectorAll('.clickable-card').forEach(card => {
      card.addEventListener('click', () => {
        const data = sectorData[card.id];
        if (!data) return;

        // Populate modal data
        modalTitle.textContent = data.title;
        modalDesc.textContent = data.desc;
        
        // Build image grid
        modalGrid.innerHTML = data.images.map((img, index) => `
          <div class="modal-image-card reveal">
            <div class="modal-image-wrapper">
              <img src="${img.src}" alt="${img.title}" loading="lazy" />
            </div>
            <div class="modal-image-info">
              <p>${img.title}</p>
            </div>
          </div>
        `).join('');

        // Open modal
        imageModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Trigger reveal animations inside modal with staggered delay
        setTimeout(() => {
          const modalReveals = imageModal.querySelectorAll('.reveal');
          modalReveals.forEach((el, idx) => {
            setTimeout(() => {
              el.classList.add('visible');
            }, idx * 100);
          });
        }, 100);
      });
    });

    const closeModal = () => {
      imageModal.classList.remove('active');
      document.body.style.overflow = '';
      
      // Reset reveal animations
      const modalReveals = imageModal.querySelectorAll('.reveal');
      modalReveals.forEach(el => el.classList.remove('visible'));
    };

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && imageModal.classList.contains('active')) {
        closeModal();
      }
    });
  }

});
