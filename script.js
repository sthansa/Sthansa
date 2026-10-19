/**
 * AURELIA SENA — EDITORIAL STUDIO SCRIPTS
 * Human-crafted interactions: Live Jakarta Clock, Dual View Switcher,
 * Hover Image Previews, Case Study Drawer Modal, and Toast Feedback.
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Live Jakarta Local Clock (WIB - UTC+7)
  const liveClockEl = document.getElementById('liveClock');
  
  function updateJakartaTime() {
    if (!liveClockEl) return;
    const now = new Date();
    const options = {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    const timeFormatter = new Intl.DateTimeFormat('id-ID', options);
    liveClockEl.textContent = `${timeFormatter.format(now)} WIB`;
  }
  
  updateJakartaTime();
  setInterval(updateJakartaTime, 1000);


  // 2. Theme Toggle (Light / Dark) with persistence
  const themeToggle = document.getElementById('themeToggle');
  const themeText = document.getElementById('themeText');
  const htmlRoot = document.documentElement;

  const savedTheme = localStorage.getItem('aurelia_theme_pref') || 'light';
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = htmlRoot.getAttribute('data-theme') || 'light';
      const target = current === 'dark' ? 'light' : 'dark';
      applyTheme(target);
      localStorage.setItem('aurelia_theme_pref', target);
      showToast(target === 'dark' ? 'Mode Gelap diaktifkan' : 'Mode Terang diaktifkan');
    });
  }

  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mainNavigation = document.getElementById('mainNavigation');

  if (mobileMenuToggle && mainNavigation) {
    mobileMenuToggle.addEventListener('click', () => {
      const isOpen = mainNavigation.classList.toggle('is-open');
      mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
      mobileMenuToggle.setAttribute('aria-label', isOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi');
    });

    mainNavigation.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNavigation.classList.remove('is-open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.setAttribute('aria-label', 'Buka menu navigasi');
      });
    });
  }

  function applyTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    if (themeText) {
      themeText.textContent = theme === 'dark' ? 'Gelap' : 'Terang';
    }
  }

  // 2b. Skill Showcase Carousel
  const skillCarousel = document.querySelector('[data-skill-carousel]');
  if (skillCarousel) {
    const skillTrack = skillCarousel.querySelector('.skill-track');
    const skillSlides = [...skillCarousel.querySelectorAll('[data-skill-slide]')];
    const skillDots = [...skillCarousel.querySelectorAll('[data-skill-dot]')];
    const previousSkill = skillCarousel.querySelector('[data-skill-prev]');
    const nextSkill = skillCarousel.querySelector('[data-skill-next]');
    let activeSkill = 0;

    function renderSkillCarousel() {
      const activeSlide = skillSlides[activeSkill];
      if (!activeSlide || !skillTrack) return;

      const stage = skillCarousel.querySelector('.skill-stage');
      const gap = parseFloat(getComputedStyle(skillTrack).gap) || 0;
      const slideWidth = activeSlide.offsetWidth;
      const offset = (stage.clientWidth - slideWidth) / 2 - activeSkill * (slideWidth + gap);

      skillTrack.style.transform = `translateX(${offset}px)`;
      skillSlides.forEach((slide, index) => {
        slide.classList.toggle('is-current', index === activeSkill);
        slide.setAttribute('aria-hidden', index === activeSkill ? 'false' : 'true');
      });
      skillDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === activeSkill);
        dot.setAttribute('aria-current', index === activeSkill ? 'true' : 'false');
      });
    }

    function showSkill(index) {
      activeSkill = (index + skillSlides.length) % skillSlides.length;
      renderSkillCarousel();
    }

    previousSkill?.addEventListener('click', () => showSkill(activeSkill - 1));
    nextSkill?.addEventListener('click', () => showSkill(activeSkill + 1));
    skillDots.forEach(dot => {
      dot.addEventListener('click', () => showSkill(Number(dot.dataset.skillDot)));
    });
    window.addEventListener('resize', renderSkillCarousel);
    renderSkillCarousel();
  }


  // 3. Dual View Switcher: Bento Grid vs Index Table
  const viewGridBtn = document.getElementById('viewGridBtn');
  const viewListBtn = document.getElementById('viewListBtn');
  const worksGridView = document.getElementById('worksGridView');
  const worksListView = document.getElementById('worksListView');

  if (viewGridBtn && viewListBtn && worksGridView && worksListView) {
    viewGridBtn.addEventListener('click', () => {
      viewGridBtn.classList.add('active');
      viewGridBtn.setAttribute('aria-selected', 'true');
      viewListBtn.classList.remove('active');
      viewListBtn.setAttribute('aria-selected', 'false');

      worksGridView.classList.remove('hidden');
      worksListView.classList.add('hidden');
    });

    viewListBtn.addEventListener('click', () => {
      viewListBtn.classList.add('active');
      viewListBtn.setAttribute('aria-selected', 'true');
      viewGridBtn.classList.remove('active');
      viewGridBtn.setAttribute('aria-selected', 'false');

      worksListView.classList.remove('hidden');
      worksGridView.classList.add('hidden');
    });
  }


  // 4. Index Table Floating Hover Image Preview
  const indexRows = document.querySelectorAll('.index-row');
  const hoverPreview = document.getElementById('hoverPreview');
  const hoverPreviewImg = document.getElementById('hoverPreviewImg');

  if (hoverPreview && hoverPreviewImg) {
    indexRows.forEach(row => {
      row.addEventListener('mouseenter', (e) => {
        const imgSrc = row.getAttribute('data-preview');
        if (imgSrc) {
          hoverPreviewImg.src = imgSrc;
          hoverPreview.classList.add('visible');
          movePreview(e);
        }
      });

      row.addEventListener('mousemove', (e) => {
        movePreview(e);
      });

      row.addEventListener('mouseleave', () => {
        hoverPreview.classList.remove('visible');
      });
    });

    function movePreview(e) {
      const xOffset = 30;
      const yOffset = 20;
      hoverPreview.style.left = `${e.clientX + xOffset}px`;
      hoverPreview.style.top = `${e.clientY + yOffset}px`;
    }
  }


  // 5. Case Study Data & Interactive Drawer Modal (Teknik Informatika Focus)
  const caseStudyData = {
    'modal-aesthetica': {
      category: 'FULL-STACK WEB APP',
      year: '2025',
      client: 'Luminous Creation',
      role: 'Full-Stack Developer',
      timeline: 'Maret — Juni 2025',
      title: 'Aplikasi Absensi Karyawan — GPS & Selfie',
      image: 'assets/images/absensi-dashboard.png',
      imageCaption: 'Dashboard admin untuk memantau kehadiran, keterlambatan, izin, sakit, cuti, dan lembur karyawan.',
      problem: 'Perusahaan membutuhkan sistem absensi karyawan berbasis website yang dapat mencatat kehadiran dan permohonan izin secara terintegrasi.',
      solution: 'Mengembangkan frontend, backend, database, dan integrasi fitur GPS serta selfie untuk mendukung proses absensi dan pengelolaan data karyawan.',
      impact: 'Sistem membantu mengelola data absensi, validasi lokasi, bukti selfie, serta proses pengajuan dan pengelolaan permohonan izin.',
      tech: ['HTML & CSS', 'PHP', 'Laravel', 'MySQL', 'GPS', 'Selfie'],
      gallery: [
        {
          image: 'assets/images/absensi-selfie.png',
          title: 'Foto Selfie Kehadiran',
          description: 'Area kamera pada halaman E-Presensi untuk mengambil foto selfie sebagai bukti kehadiran karyawan.'
        },
        {
          image: 'assets/images/absensi-gps.png',
          title: 'Validasi Lokasi GPS',
          description: 'Peta lokasi pada halaman E-Presensi untuk memastikan absensi dilakukan dari area yang diizinkan.'
        }
      ]
    },
    'modal-spatial': {
      category: 'WEB APPLICATION',
      year: '2025 — 2026',
      client: 'Yayasan Pendidikan Muara Ilmu',
      role: 'Full-Stack Developer',
      timeline: 'November 2025 — Maret 2026',
      title: 'Aplikasi Ujian Sekolah — Sistem Anti Kecurangan',
      image: 'assets/images/project-2.jpg',
      imageCaption: 'Dashboard admin Sistem Ujian CBT untuk mengelola pengguna, peserta, guru, mata pelajaran, soal, ujian, hasil, dan laporan.',
      problem: 'Sekolah membutuhkan aplikasi ujian berbasis web dengan mekanisme yang membantu mengurangi peluang kecurangan saat ujian berlangsung.',
      solution: 'Merancang dan mengembangkan frontend, backend, database, serta fitur Randomization Algorithm dan Browser Lockdown.',
      impact: 'Aplikasi mendukung pelaksanaan ujian sekolah yang lebih terarah dan membantu menjaga integritas proses pengerjaan.',
      tech: ['PHP', 'Laravel', 'MySQL', 'Randomization Algorithm', 'Browser Lockdown'],
      gallery: [
        {
          image: 'assets/images/project-3.jpg',
          title: 'Halaman Soal Ujian',
          description: 'Perbandingan dua soal berbeda yang ditampilkan kepada peserta. Keduanya memiliki timer, pilihan jawaban, navigasi nomor soal, dan tombol untuk menyelesaikan ujian.'
        },
        {
          image: 'assets/images/project-4.jpg',
          title: 'Browser Lockdown',
          description: 'Layar keamanan yang muncul ketika siswa membuka tab lain saat ujian berlangsung. Sistem mendeteksi perpindahan tab dan mengunci status ujian sebagai pelanggaran.'
        },
        {
          image: 'assets/images/project-5.jpg',
          title: 'Dokumentasi Implementasi',
          description: 'Dokumentasi saat menjelaskan dan mendampingi guru dalam memahami penggunaan sistem ujian, pengelolaan soal, peserta, hasil, dan laporan.'
        }
      ]
    },
    'modal-vanguard': {
      category: 'WEB ENGINEERING & CMS',
      year: '2025',
      client: 'Studio Showcase',
      role: 'Web Engineer',
      timeline: '2 Bulan',
      title: 'Vanguard — Web Portal Studio dengan Optimasi Core Web Vitals',
      image: 'assets/images/project-3.jpg',
      problem: 'Portofolio visual dengan banyak aset resolusi tinggi rentan mengalami Largest Contentful Paint (LCP) lambat dan pergeseran tata letak (Cumulative Layout Shift).',
      solution: 'Melakukan optimasi pipeline aset gambar, lazy loading bertahap, preconnecting font, serta penulisan stylesheet CSS murni tanpa framework tambahan.',
      impact: 'Mencapai skor Google PageSpeed sempurna 100/100, First Contentful Paint (FCP) di bawah 0.4 detik, dan zero layout shift.',
      tech: ['Vanilla CSS Subgrid', 'SEO On-Page', 'Core Web Vitals', 'HTML5 Semantik', 'Performance Tuning']
    },
    'modal-aura': {
      category: 'SISTEM INFORMASI & BASIS DATA',
      year: '2024',
      client: 'Information System Platform',
      role: 'Database & Backend Analyst',
      timeline: '3 Bulan',
      title: 'AURA — Arsitektur Sistem Informasi & Manajemen Token Digital',
      image: 'assets/images/project-4.jpg',
      problem: 'Struktur basis data yang redundan dan tidak ternormalisasi menyebabkan query laporan lambat dan integritas relasi entitas terganggu.',
      solution: 'Merancang ulang Entity Relationship Diagram (ERD) dengan normalisasi bentuk ketiga (3NF), menambahkan indexing pada kolom pencarian utama, dan menyusun dokumentasi API terstruktur.',
      impact: 'Kecepatan eksekusi query gabungan meningkat 70% dan integritas referensial data terjaga sepenuhnya.',
      tech: ['Relational Database (MySQL)', 'ERD Modeling 3NF', 'Indexing & Optimization', 'System Analysis', 'API Design']
    }
  };

  const caseDrawer = document.getElementById('caseDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerContent = document.getElementById('drawerContent');

  function openDrawer(modalId) {
    const data = caseStudyData[modalId];
    if (!data || !drawerContent || !caseDrawer) return;

    drawerContent.innerHTML = `
      <div class="drawer-header">
        <span class="drawer-scope">${data.category} // ${data.year}</span>
        <h2 class="drawer-title">${data.title}</h2>
      </div>

      <div class="drawer-meta-grid">
        <div>
          <span>KLIEN</span>
          <strong>${data.client}</strong>
        </div>
        <div>
          <span>PERAN SAYA</span>
          <strong>${data.role}</strong>
        </div>
        <div>
          <span>DURASI PENGERJAAN</span>
          <strong>${data.timeline}</strong>
        </div>
        <div>
          <span>STATUS</span>
          <strong>Produksi / Live</strong>
        </div>
      </div>

      <div class="drawer-image-box">
        <img src="${data.image}" alt="${data.title}" class="drawer-main-image">
        ${data.imageCaption ? `<p class="drawer-image-caption">${data.imageCaption}</p>` : ''}
      </div>

      ${data.gallery ? `
        <div class="drawer-gallery">
          ${data.gallery.map(item => `
            <figure class="drawer-gallery-item">
              <img src="${item.image}" alt="${item.title}" class="drawer-gallery-image">
              <figcaption>
                <strong>${item.title}</strong>
                <span>${item.description}</span>
              </figcaption>
            </figure>
          `).join('')}
        </div>
      ` : ''}

      <div class="drawer-section">
        <h4 class="drawer-section-title">Latar Belakang & Masalah</h4>
        <p class="drawer-section-p">${data.problem}</p>
      </div>

      <div class="drawer-section">
        <h4 class="drawer-section-title">Solusi & Pendekatan Desain</h4>
        <p class="drawer-section-p">${data.solution}</p>
      </div>

      <div class="drawer-section">
        <h4 class="drawer-section-title">Dampak & Hasil Terukur</h4>
        <p class="drawer-section-p">${data.impact}</p>
      </div>

      <div class="drawer-section">
        <h4 class="drawer-section-title">Perangkat & Teknologi</h4>
        <div class="tech-stack-row" style="margin-top: 0.5rem;">
          ${data.tech.map(t => `<span class="tech-pill">${t}</span>`).join('')}
        </div>
      </div>
    `;

    caseDrawer.classList.add('open');
    caseDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!caseDrawer) return;
    caseDrawer.classList.remove('open');
    caseDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Attach triggers from bento cards
  document.querySelectorAll('.case-study-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const modalId = btn.getAttribute('data-modal');
      openDrawer(modalId);
    });
  });

  // Attach triggers from table rows
  document.querySelectorAll('.index-row').forEach(row => {
    row.addEventListener('click', () => {
      const modalId = row.getAttribute('data-modal');
      openDrawer(modalId);
    });
  });

  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  // Image lightbox with zoom controls for the project documentation.
  const lightbox = document.getElementById('imageLightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxZoomIn = document.getElementById('lightboxZoomIn');
  const lightboxZoomOut = document.getElementById('lightboxZoomOut');
  const lightboxReset = document.getElementById('lightboxReset');
  let lightboxScale = 1;

  function renderLightboxScale() {
    if (lightboxImage) {
      lightboxImage.style.transform = `scale(${lightboxScale})`;
    }
  }

  function openLightbox(image, title, description) {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = image;
    lightboxImage.alt = title;
    lightboxCaption.innerHTML = `<strong>${title}</strong><span>${description || 'Klik tombol zoom untuk melihat detail gambar.'}</span>`;
    lightboxScale = 1;
    renderLightboxScale();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    if (lightboxImage) lightboxImage.src = '';
  }

  drawerContent?.addEventListener('click', (event) => {
    const image = event.target.closest('.drawer-main-image, .drawer-gallery-image');
    if (!image) return;
    const item = image.closest('.drawer-gallery-item');
    const title = item?.querySelector('strong')?.textContent || image.alt;
    const description = item?.querySelector('span')?.textContent || document.querySelector('.drawer-image-caption')?.textContent;
    openLightbox(image.src, title, description);
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', event => {
    if (event.target === lightbox) closeLightbox();
  });
  lightboxZoomIn?.addEventListener('click', () => {
    lightboxScale = Math.min(lightboxScale + 0.25, 3);
    renderLightboxScale();
  });
  lightboxZoomOut?.addEventListener('click', () => {
    lightboxScale = Math.max(lightboxScale - 0.25, 0.5);
    renderLightboxScale();
  });
  lightboxReset?.addEventListener('click', () => {
    lightboxScale = 1;
    renderLightboxScale();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox?.classList.contains('open')) {
      closeLightbox();
      return;
    }
    if (e.key === 'Escape' && caseDrawer && caseDrawer.classList.contains('open')) {
      closeDrawer();
    }
  });


  // 6. Toast Notification Helper
  const toastEl = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMessage');
  let toastTimeout = null;

  function showToast(msg) {
    if (!toastEl || !toastMsg) return;
    toastMsg.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2500);
  }


  // 7. Instant Email Copy Handlers
  function copyEmailToClipboard(email) {
    navigator.clipboard.writeText(email).then(() => {
      showToast(`Email ${email} berhasil disalin! 📋`);
    }).catch(() => {
      showToast('Gagal menyalin, silakan salin secara manual.');
    });
  }

  const copyEmailHero = document.getElementById('copyEmailHero');
  if (copyEmailHero) {
    copyEmailHero.addEventListener('click', () => {
      const email = copyEmailHero.getAttribute('data-email') || 'Suthansagading13@gmail.com';
      copyEmailToClipboard(email);
    });
  }

  const copyEmailContact = document.getElementById('copyEmailContact');
  if (copyEmailContact) {
    copyEmailContact.addEventListener('click', () => {
      const email = document.getElementById('targetEmail')?.textContent || 'Suthansagading13@gmail.com';
      copyEmailToClipboard(email);
    });
  }


  // 8. Contact Form Submission
  const topicPills = document.querySelectorAll('.topic-pill');
  const selectedTopicInput = document.getElementById('selectedTopicInput');

  topicPills.forEach(pill => {
    pill.addEventListener('click', () => {
      topicPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      if (selectedTopicInput) {
        selectedTopicInput.value = pill.getAttribute('data-topic');
      }
    });
  });

  const inquiryForm = document.getElementById('studioInquiryForm');
  const submitBtn = document.getElementById('submitBtn');
  const formNotice = document.getElementById('formNotice');

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('clientName')?.value.trim();
      const email = document.getElementById('clientEmail')?.value.trim();
      const message = document.getElementById('clientMessage')?.value.trim();

      if (!name || !email || !message) {
        showToast('Mohon lengkapi kolom nama, email, dan pesan.');
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Mohon gunakan alamat email yang valid.');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Mengirim pesan...</span>`;
      }

      const recipient = 'Suthansagading13@gmail.com';
      const subject = `Pesan portfolio dari ${name}`;
      const body = [
        `Nama: ${name}`,
        `Email: ${email}`,
        '',
        'Pesan:',
        message
      ].join('\n');
      const gmailComposeUrl = [
        'https://mail.google.com/mail/?view=cm&fs=1',
        `to=${encodeURIComponent(recipient)}`,
        `su=${encodeURIComponent(subject)}`,
        `body=${encodeURIComponent(body)}`
      ].join('&');
      const gmailWindow = window.open(gmailComposeUrl, '_blank', 'noopener,noreferrer');

      if (!gmailWindow) {
        window.location.href = gmailComposeUrl;
      }
      if (submitBtn) submitBtn.style.display = 'none';
      if (formNotice) formNotice.classList.add('show');
      inquiryForm.reset();
    });
  }

});
