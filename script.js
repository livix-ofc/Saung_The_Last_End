/* ==========================================================
   SAUNG THE LAST END - script.js

   Daftar isi
   1. Pengaturan (nomor WhatsApp, tautan lokasi)
   2. Data menu
   3. Fungsi bantu
   4. Tautan WhatsApp dan lokasi
   5. Navigasi
   6. Hero (cahaya pelita dan kunang-kunang)
   7. Daftar menu (tab, filter, pencarian)
   8. Menu andalan
   9. Pesanan (keranjang) dan kirim ke WhatsApp
   10. Mulai
   ========================================================== */
(() => {
  'use strict';

  /* ---------- 1. PENGATURAN ---------- */
  const CONFIG = {
    // GANTI dengan nomor WhatsApp saung.
    // Format internasional: diawali 62, tanpa tanda +, spasi, atau tanda hubung.
    // Contoh: 0812-3456-7890 ditulis '6281234567890'.
    waNumber: '6285185229506',

    // Tautan lokasi Google Maps
    mapsUrl: 'https://maps.app.goo.gl/cS4vBRkdA42QpVJL8',

    // Alamat teks (opsional). Kalau diisi, tampil di bagian Lokasi.
    alamat: '',

    sapaan: 'Halo Saung The Last End, saya ingin bertanya.'
  };

  /* ---------- 2. DATA MENU ----------
     Format tiap baris: [tipe, jenis, nama, harga, best seller?]
     Untuk menambah atau mengubah menu, cukup edit daftar ini. */
  const DAFTAR_MENU = [
    // Makanan
    ['makanan', 'Paket', 'Paket Seruit Komplit', 35000, true],
    ['makanan', 'Paket', 'Paket Nila Bakar', 32000, true],
    ['makanan', 'Paket', 'Paket Ayam Kampung', 38000, false],
    ['makanan', 'Paket', 'Paket Lele Goreng (2 ekor)', 25000, false],
    ['makanan', 'Paket', 'Paket Hemat Berdua', 75000, false],
    ['makanan', 'Paket', 'Paket Hemat Berempat', 145000, false],
    ['makanan', 'Nila', 'Nila Bakar', 28000, false],
    ['makanan', 'Nila', 'Nila Goreng', 27000, false],
    ['makanan', 'Nila', 'Nila Pekhos Pati', 32000, false],
    ['makanan', 'Lele', 'Lele Bakar', 18000, false],
    ['makanan', 'Lele', 'Lele Goreng', 16000, false],
    ['makanan', 'Baung', 'Baung Pindang', 40000, true],
    ['makanan', 'Baung', 'Baung Goreng', 38000, false],
    ['makanan', 'Baung', 'Baung Pepes', 40000, false],
    ['makanan', 'Jelabat', 'Jelabat Pindang', 45000, false],
    ['makanan', 'Jelabat', 'Jelabat Pepes', 53000, false],
    ['makanan', 'Jelabat', 'Jelabat Steam', 48000, false],
    ['makanan', 'Gurame', 'Gurame Bakar', 55000, false],
    ['makanan', 'Gurame', 'Gurame Goreng', 53000, false],
    ['makanan', 'Gurame', 'Gurame Asam Manis', 60000, false],
    ['makanan', 'Patin', 'Patin Bakar', 30000, false],
    ['makanan', 'Ayam Kampung', 'Ayam Kampung Goreng', 32000, false],
    ['makanan', 'Ayam Kampung', 'Ayam Kampung Bakar', 35000, false],
    ['makanan', 'Ayam Kampung', 'Ayam Kampung Semur', 35000, false],

    // Minuman
    ['minuman', 'Teh', 'Es Teh', 5000, false],
    ['minuman', 'Teh', 'Teh Panas', 4000, false],
    ['minuman', 'Jeruk', 'Es Jeruk', 8000, false],
    ['minuman', 'Jeruk', 'Jeruk Panas', 7000, false],
    ['minuman', 'Spesial', 'Es Kelapa Muda', 12000, true],
    ['minuman', 'Spesial', 'Es Ombay Lin', 12000, false],
    ['minuman', 'Spesial', 'Es Seruit', 12000, false],
    ['minuman', 'Kopi', 'Kopi Hitam', 6000, false],
    ['minuman', 'Kopi', 'Kopi Susu', 10000, false],
    ['minuman', 'Jus', 'Jus Alpukat', 15000, false],
    ['minuman', 'Jus', 'Jus Mangga', 12000, false],
    ['minuman', 'Spesial', 'Wedang Jahe', 8000, false],
    ['minuman', 'Spesial', 'Bandrek', 10000, false]
  ];

  const MENU = DAFTAR_MENU.map(([tipe, grup, nama, harga, best]) => ({
    id: nama.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    tipe, grup, nama, harga, best
  }));
  const BY_ID = new Map(MENU.map((m) => [m.id, m]));

  /* ---------- 3. FUNGSI BANTU ---------- */
  const $ = (selektor, root = document) => root.querySelector(selektor);
  const $$ = (selektor, root = document) => [...root.querySelectorAll(selektor)];

  const rupiah = (angka) => 'Rp' + new Intl.NumberFormat('id-ID').format(angka);

  // huruf kecil dan tanpa aksen, supaya pencarian tidak sensitif huruf besar
  const normal = (teks) => teks.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

  const kurangiGerak = window.matchMedia('(prefers-reduced-motion: reduce)');

  const waUrl = (teks) => `https://wa.me/${CONFIG.waNumber}?text=${encodeURIComponent(teks)}`;

  // 6281234567890 -> 0812-3456-7890
  const tampilNomor = (nomor) => {
    const lokal = nomor.startsWith('62') ? '0' + nomor.slice(2) : nomor;
    return lokal.replace(/^(\d{4})(\d{4})(\d+)$/, '$1-$2-$3');
  };

  const IKON = {
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    minus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    ikan: '<svg class="papan-ikon" viewBox="0 0 48 32" aria-hidden="true"><path d="M4 16c8-10 20-12 30-4l10-6v20l-10-6C24 28 12 26 4 16Z" fill="currentColor"/><circle cx="14" cy="14" r="1.8" fill="#ecd6a4"/></svg>',
    gelas: '<svg class="papan-ikon" viewBox="0 0 32 40" aria-hidden="true"><path d="M6 12h20l-2.5 24a3 3 0 0 1-3 2.6h-9a3 3 0 0 1-3-2.6L6 12Z" fill="currentColor"/><path d="M20 12 24 2" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>'
  };

  /* ---------- 4. TAUTAN WHATSAPP DAN LOKASI ---------- */
  function aturTautan() {
    $$('[data-wa]').forEach((a) => { a.href = waUrl(CONFIG.sapaan); });
    $$('[data-maps]').forEach((a) => { a.href = CONFIG.mapsUrl; });
    $$('[data-wa-teks]').forEach((el) => { el.textContent = tampilNomor(CONFIG.waNumber); });

    if (CONFIG.alamat) {
      const alamat = $('#alamat');
      alamat.textContent = CONFIG.alamat;
      alamat.hidden = false;
    }

    const tahun = $('#tahun');
    if (tahun) tahun.textContent = new Date().getFullYear();

    if (CONFIG.waNumber === '6281234567890') {
      console.info('[Saung] Nomor WhatsApp masih contoh. Ganti CONFIG.waNumber di js/script.js.');
    }
  }

  /* ---------- 5. NAVIGASI ---------- */
  function aturNavigasi() {
    const nav = $('#nav');
    const burger = $('#burger');
    const tautan = $('#navLinks');

    // bilah navigasi mendapat latar saat halaman digulir
    const saatGulir = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
    saatGulir();
    window.addEventListener('scroll', saatGulir, { passive: true });

    // menu seluler
    const buka = (nilai) => {
      nav.classList.toggle('is-open', nilai);
      burger.setAttribute('aria-expanded', String(nilai));
      burger.setAttribute('aria-label', nilai ? 'Tutup menu navigasi' : 'Buka menu navigasi');
    };
    burger.addEventListener('click', () => buka(!nav.classList.contains('is-open')));
    tautan.addEventListener('click', (e) => { if (e.target.closest('a')) buka(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        buka(false);
        burger.focus();
      }
    });
    window.matchMedia('(min-width: 901px)').addEventListener('change', (e) => { if (e.matches) buka(false); });

    // tandai tautan sesuai bagian yang sedang dilihat
    const peta = new Map($$('a[href^="#"]', tautan).map((a) => [a.getAttribute('href').slice(1), a]));
    const pengamat = new IntersectionObserver((daftar) => {
      daftar.forEach((entri) => {
        if (!entri.isIntersecting) return;
        peta.forEach((a) => a.removeAttribute('aria-current'));
        const a = peta.get(entri.target.id);
        if (a) a.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    [...peta.keys(), 'beranda'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) pengamat.observe(el);
    });
  }

  /* ---------- 6. HERO ---------- */

  // Cahaya pelita mengikuti kursor (atau jari). Kalau tidak ada gerakan,
  // cahaya melayang sendiri pelan-pelan.
  function aturCahaya() {
    const hero = $('.hero');
    if (!hero) return;

    let targetX = hero.clientWidth * 0.35;
    let targetY = hero.clientHeight * 0.4;
    let x = targetX;
    let y = targetY;
    let terakhirGerak = -1e9;
    let rafId = 0;

    const terapkan = () => {
      hero.style.setProperty('--lx', x.toFixed(1) + 'px');
      hero.style.setProperty('--ly', y.toFixed(1) + 'px');
    };
    terapkan();

    hero.addEventListener('pointermove', (e) => {
      const kotak = hero.getBoundingClientRect();
      targetX = e.clientX - kotak.left;
      targetY = e.clientY - kotak.top;
      terakhirGerak = performance.now();
      if (kurangiGerak.matches) { x = targetX; y = targetY; terapkan(); }
    });

    function jalan(t) {
      if (t - terakhirGerak > 2600) {
        targetX = hero.clientWidth * (0.5 + 0.34 * Math.sin(t / 3600));
        targetY = hero.clientHeight * (0.46 + 0.2 * Math.cos(t / 2900));
      }
      x += (targetX - x) * 0.08;
      y += (targetY - y) * 0.08;
      terapkan();
      rafId = requestAnimationFrame(jalan);
    }

    // animasi berhenti saat hero tidak terlihat, supaya hemat baterai
    new IntersectionObserver(([entri]) => {
      if (kurangiGerak.matches) return;
      if (entri.isIntersecting && !rafId) {
        rafId = requestAnimationFrame(jalan);
      } else if (!entri.isIntersecting && rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    }).observe(hero);
  }

  // Kunang-kunang di atas canvas
  function aturKunangKunang() {
    const kanvas = $('#fireflies');
    if (!kanvas) return;
    const ctx = kanvas.getContext('2d');
    if (!ctx) return;

    let lebar = 0;
    let tinggi = 0;
    let lebarTerakhir = 0;
    let serangga = [];
    let rafId = 0;
    const acak = (a, b) => a + Math.random() * (b - a);

    function ukur() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      lebar = kanvas.clientWidth;
      tinggi = kanvas.clientHeight;
      kanvas.width = Math.round(lebar * dpr);
      kanvas.height = Math.round(tinggi * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const jumlah = Math.max(14, Math.min(46, Math.round((lebar * tinggi) / 28000)));
      serangga = Array.from({ length: jumlah }, () => ({
        x: acak(0, lebar),
        y: acak(tinggi * 0.35, tinggi * 0.95),
        r: acak(1, 2.4),
        sudut: acak(0, Math.PI * 2),
        laju: acak(0.12, 0.4),
        fase: acak(0, Math.PI * 2),
        kedip: acak(0.6, 1.5)
      }));
      lebarTerakhir = lebar;
    }

    function gambar(t) {
      ctx.clearRect(0, 0, lebar, tinggi);
      ctx.globalCompositeOperation = 'lighter';
      for (const k of serangga) {
        k.sudut += Math.sin(t / 1700 + k.fase) * 0.03;
        k.x += Math.cos(k.sudut) * k.laju;
        k.y += Math.sin(k.sudut) * k.laju * 0.6 - 0.03;
        if (k.x < -10) k.x = lebar + 10;
        if (k.x > lebar + 10) k.x = -10;
        if (k.y < tinggi * 0.2) k.y = tinggi * 0.98;
        if (k.y > tinggi + 10) k.y = tinggi * 0.3;

        const denyut = 0.5 + 0.5 * Math.sin((t / 900) * k.kedip + k.fase);
        const alfa = 0.15 + 0.85 * denyut * denyut;
        const g = ctx.createRadialGradient(k.x, k.y, 0, k.x, k.y, k.r * 8);
        g.addColorStop(0, `rgba(255,226,140,${alfa})`);
        g.addColorStop(0.25, `rgba(255,200,90,${alfa * 0.45})`);
        g.addColorStop(1, 'rgba(255,200,90,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(k.x, k.y, k.r * 8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function jalan(t) {
      gambar(t);
      rafId = requestAnimationFrame(jalan);
    }

    ukur();
    if (kurangiGerak.matches) {
      gambar(0); // satu gambar diam saja
      return;
    }

    new IntersectionObserver(([entri]) => {
      if (entri.isIntersecting && !rafId) {
        rafId = requestAnimationFrame(jalan);
      } else if (!entri.isIntersecting && rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    }).observe(kanvas);

    let tunda = 0;
    window.addEventListener('resize', () => {
      clearTimeout(tunda);
      tunda = setTimeout(() => {
        if (kanvas.clientWidth !== lebarTerakhir) ukur();
      }, 200);
    });
  }

  /* ---------- 7. DAFTAR MENU ---------- */
  const state = { tipe: 'makanan', grup: 'Semua', q: '' };
  const cart = new Map(); // id -> jumlah

  // Tombol tambah, atau kontrol jumlah kalau menu sudah ada di pesanan.
  // varian 'lebar' dipakai di papan andalan, 'bulat' di daftar menu.
  function kontrolHTML(m, varian) {
    const jumlah = cart.get(m.id) || 0;
    if (jumlah === 0) {
      return varian === 'lebar'
        ? `<button class="add-lebar" type="button" data-add="${m.id}" aria-label="Tambah ${m.nama} ke pesanan">${IKON.plus}Tambah ke pesanan</button>`
        : `<button class="add" type="button" data-add="${m.id}" aria-label="Tambah ${m.nama} ke pesanan">${IKON.plus}</button>`;
    }
    return `<div class="step" role="group" aria-label="Jumlah ${m.nama}">`
      + `<button type="button" data-dec="${m.id}" aria-label="Kurangi ${m.nama}">${IKON.minus}</button>`
      + `<span class="qty" aria-live="polite">${jumlah}</span>`
      + `<button type="button" data-add="${m.id}" aria-label="Tambah ${m.nama}">${IKON.plus}</button>`
      + '</div>';
  }

  function menuTampil() {
    const kata = normal(state.q);
    return MENU.filter((m) =>
      m.tipe === state.tipe
      && (state.grup === 'Semua' || m.grup === state.grup)
      && (!kata || normal(m.nama + ' ' + m.grup).includes(kata))
    );
  }

  function gambarChip() {
    const grup = ['Semua', ...new Set(MENU.filter((m) => m.tipe === state.tipe).map((m) => m.grup))];
    $('#chips').innerHTML = grup.map((g) =>
      `<button class="chip" type="button" data-grup="${g}" aria-pressed="${g === state.grup}">${g}</button>`
    ).join('');
  }

  function tandaiChip() {
    $$('#chips .chip').forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.grup === state.grup)));
  }

  function gambarMenu(animasi) {
    const daftar = $('#menuList');
    const data = menuTampil();
    daftar.innerHTML = data.map((m, i) =>
      `<li class="row${animasi ? ' is-in' : ''}" style="--i:${i}">`
      + `<span class="row-nama">${m.nama}${m.best ? '<span class="badge">Best seller</span>' : ''}</span>`
      + '<span class="pemisah" aria-hidden="true"></span>'
      + `<span class="row-harga">${rupiah(m.harga)}</span>`
      + `<div class="ctrl" data-ctrl="${m.id}" data-varian="bulat">${kontrolHTML(m, 'bulat')}</div>`
      + '</li>'
    ).join('');
    daftar.hidden = data.length === 0;
    $('#menuKosong').hidden = data.length > 0;
  }

  function aturTab(tipe, grup = 'Semua') {
    state.tipe = tipe;
    state.grup = grup;
    $$('.tab').forEach((t) => {
      const aktif = t.dataset.tab === tipe;
      t.setAttribute('aria-selected', String(aktif));
      t.tabIndex = aktif ? 0 : -1;
    });
    $('#menuPanel').setAttribute('aria-labelledby', 'tab-' + tipe);
    $$('.menu-foto img').forEach((img) => img.classList.toggle('is-on', img.dataset.untuk === tipe));
    $('#cari').placeholder = tipe === 'makanan' ? 'Cari menu, misalnya gurame' : 'Cari minuman, misalnya kopi';
    gambarChip();
    gambarMenu(true);
  }

  function aturMenu() {
    const tabs = $$('.tab');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => aturTab(tab.dataset.tab));
      tab.addEventListener('keydown', (e) => {
        const kunci = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
        if (!kunci.includes(e.key)) return;
        e.preventDefault();
        let i = tabs.indexOf(tab);
        if (e.key === 'ArrowRight') i = (i + 1) % tabs.length;
        else if (e.key === 'ArrowLeft') i = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') i = 0;
        else i = tabs.length - 1;
        tabs[i].focus();
        aturTab(tabs[i].dataset.tab);
      });
    });

    $('#chips').addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      state.grup = chip.dataset.grup;
      tandaiChip();
      gambarMenu(true);
    });

    $('#cari').addEventListener('input', (e) => {
      state.q = e.target.value;
      gambarMenu(false);
    });

    $('#resetCari').addEventListener('click', () => {
      state.q = '';
      state.grup = 'Semua';
      $('#cari').value = '';
      tandaiChip();
      gambarMenu(true);
      $('#cari').focus();
    });

    // daftar "Lihat menu per jenis" di bagian Tentang
    $$('.ikan-list button').forEach((tombol) => {
      tombol.addEventListener('click', () => {
        state.q = '';
        $('#cari').value = '';
        aturTab(tombol.dataset.tipe, tombol.dataset.grup);
        $('#menu').scrollIntoView({ behavior: kurangiGerak.matches ? 'auto' : 'smooth', block: 'start' });
      });
    });

    aturTab('makanan');
  }

  /* ---------- 8. MENU ANDALAN ---------- */
  function gambarAndalan() {
    $('#andalanList').innerHTML = MENU.filter((m) => m.best).map((m) =>
      '<div class="papan-item"><article class="papan">'
      + '<span class="badge">Best seller</span>'
      + (m.tipe === 'minuman' ? IKON.gelas : IKON.ikan)
      + `<h3 class="papan-nama">${m.nama}</h3>`
      + `<p class="papan-harga">${rupiah(m.harga)}</p>`
      + `<div class="ctrl" data-ctrl="${m.id}" data-varian="lebar">${kontrolHTML(m, 'lebar')}</div>`
      + '</article></div>'
    ).join('');
  }

  /* ---------- 9. PESANAN ---------- */
  const KUNCI_SIMPAN = 'saung-the-last-end:pesanan';

  function muatPesanan() {
    try {
      const mentah = JSON.parse(localStorage.getItem(KUNCI_SIMPAN) || '[]');
      if (!Array.isArray(mentah)) return;
      mentah.forEach(([id, jumlah]) => {
        if (BY_ID.has(id) && Number.isInteger(jumlah) && jumlah > 0 && jumlah < 100) cart.set(id, jumlah);
      });
    } catch (_) { /* penyimpanan tidak tersedia, abaikan */ }
  }

  function simpanPesanan() {
    try { localStorage.setItem(KUNCI_SIMPAN, JSON.stringify([...cart])); } catch (_) { /* abaikan */ }
  }

  const totalItem = () => [...cart.values()].reduce((a, b) => a + b, 0);
  const totalHarga = () => [...cart].reduce((a, [id, q]) => a + (BY_ID.get(id)?.harga || 0) * q, 0);

  function perbaruiBar(lompat) {
    const bar = $('#orderBar');
    const jumlah = totalItem();
    bar.hidden = jumlah === 0;
    $('#barJumlah').textContent = jumlah;
    $('#barTotal').textContent = rupiah(totalHarga());
    if (lompat) {
      bar.classList.remove('bump');
      void bar.offsetWidth; // mulai ulang animasi
      bar.classList.add('bump');
    }
  }

  // isi pesan WhatsApp
  function susunPesan() {
    const baris = [...cart].map(([id, q]) => {
      const m = BY_ID.get(id);
      return m ? `${q}x ${m.nama} = ${rupiah(m.harga * q)}` : null;
    }).filter(Boolean);

    let teks = `Halo Saung The Last End, saya ingin memesan:\n\n${baris.join('\n')}\n\nTotal: ${rupiah(totalHarga())}`;

    const info = [];
    const nama = $('#fNama').value.trim();
    const catatan = $('#fCatatan').value.trim();
    if (nama) info.push('Nama: ' + nama);
    if (catatan) info.push('Catatan: ' + catatan);
    if (info.length) teks += '\n\n' + info.join('\n');
    return teks;
  }

  function perbaruiTautanKirim() {
    const a = $('#kirimWa');
    const kosong = cart.size === 0;
    a.setAttribute('aria-disabled', String(kosong));
    a.tabIndex = kosong ? -1 : 0;
    a.href = kosong ? '#' : waUrl(susunPesan());
  }

  function gambarPesanan() {
    const entri = [...cart].map(([id, q]) => ({ m: BY_ID.get(id), q })).filter((e) => e.m);
    const daftar = $('#cartList');
    daftar.innerHTML = entri.map(({ m, q }) =>
      '<li class="cart-item">'
      + `<div><p class="ci-nama">${m.nama}</p><p class="ci-harga">${rupiah(m.harga)} per item</p></div>`
      + kontrolHTML(m, 'bulat')
      + `<strong class="ci-sub">${rupiah(m.harga * q)}</strong>`
      + '</li>'
    ).join('');
    daftar.hidden = entri.length === 0;
    $('#cartKosong').hidden = entri.length > 0;
    $('#kosongkan').hidden = entri.length === 0;
    $('#sheetTotal').textContent = rupiah(totalHarga());
    perbaruiTautanKirim();
  }

  // semua tombol tambah/kurang di halaman diperbarui dari data pesanan
  function segarkanKontrol(id) {
    $$(id ? `[data-ctrl="${id}"]` : '[data-ctrl]').forEach((el) => {
      const m = BY_ID.get(el.dataset.ctrl);
      if (m) el.innerHTML = kontrolHTML(m, el.dataset.varian);
    });
  }

  function ubahJumlah(tombol, id, selisih, aksi) {
    const m = BY_ID.get(id);
    if (!m) return;
    const dalamLaci = Boolean(tombol.closest('dialog'));
    const kontrol = tombol.closest('[data-ctrl]');

    const baru = Math.max(0, Math.min(99, (cart.get(id) || 0) + selisih));
    if (baru === 0) cart.delete(id); else cart.set(id, baru);
    simpanPesanan();
    perbaruiBar(selisih > 0);
    segarkanKontrol(id);

    // fokus keyboard tetap di tombol yang sama setelah isinya diganti
    if (dalamLaci) {
      gambarPesanan();
      const tujuan = $(`#sheet [data-${aksi}="${id}"]`) || $('#sheet .sheet-tutup');
      tujuan.focus();
    } else if (kontrol) {
      const tujuan = kontrol.querySelector(`[data-${aksi}]`) || kontrol.querySelector('[data-add]');
      if (tujuan) tujuan.focus();
    }
  }

  function aturPesanan() {
    const laci = $('#sheet');
    const bar = $('#orderBar');

    document.addEventListener('click', (e) => {
      const tambah = e.target.closest('[data-add]');
      const kurang = e.target.closest('[data-dec]');
      if (tambah) ubahJumlah(tambah, tambah.dataset.add, 1, 'add');
      else if (kurang) ubahJumlah(kurang, kurang.dataset.dec, -1, 'dec');
    });

    bar.addEventListener('click', () => {
      gambarPesanan();
      if (typeof laci.showModal === 'function') laci.showModal();
      else laci.setAttribute('open', '');
      document.body.classList.add('no-scroll');
    });
    laci.addEventListener('close', () => document.body.classList.remove('no-scroll'));
    // klik di area gelap di luar laci menutupnya
    laci.addEventListener('click', (e) => { if (e.target === laci) laci.close(); });

    $('#fNama').addEventListener('input', perbaruiTautanKirim);
    $('#fCatatan').addEventListener('input', perbaruiTautanKirim);

    $('#kirimWa').addEventListener('click', (e) => {
      if (cart.size === 0) e.preventDefault();
    });

    $('#kosongkan').addEventListener('click', () => {
      cart.clear();
      simpanPesanan();
      segarkanKontrol();
      perbaruiBar(false);
      gambarPesanan();
      $('#sheet .sheet-tutup').focus();
    });

    segarkanKontrol();
    perbaruiBar(false);
  }

  /* ---------- 10. MULAI ---------- */
  muatPesanan();
  aturTautan();
  aturNavigasi();
  aturCahaya();
  aturKunangKunang();
  gambarAndalan();
  aturMenu();
  aturPesanan();
})();
