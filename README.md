# Akhlak Tahun Dua KSRI - Aplikasi Pembelajaran Interaktif

Aplikasi web interaktif untuk pembelajaran Akhlak Tahun Dua mengikut sukatan KSRI. Dibangunkan dengan React, TypeScript, dan Tailwind CSS.

## Teknologi

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Testing**: Vitest + Testing Library + Playwright
- **Code Quality**: ESLint + Prettier
- **Deployment**: Vercel

## Ciri-ciri Utama

- 📚 **Mod Belajar**: Baca dan ulang kaji nota pembelajaran
- 🧠 **Mod Kuiz**: Ujian 10 soalan dengan maklum balas segera
- 📝 **Mod Ujian**: Ujian komprehensif 30 soalan
- 🏆 **Papan Markah**: Rekod pencapaian pelajar
- 🔊 **Audio & Animasi**: Kesan bunyi dan animasi yang menarik
- 📱 **Responsif**: Berfungsi di semua peranti

## Persediaan Pembangunan

### Keperluan Sistem

- Node.js 18+
- npm atau yarn

### Pemasangan

1. Clone repository ini
2. Install dependencies:

   ```bash
   npm install
   ```

3. Jalankan server pembangunan:

   ```bash
   npm run dev
   ```

4. Buka http://localhost:5173 di pelayar

### Skrip Tersedia

- `npm run dev` - Jalankan server pembangunan
- `npm run build` - Bina untuk produksi
- `npm run preview` - Pratonton binaan produksi
- `npm run test` - Jalankan ujian unit
- `npm run test:coverage` - Jalankan ujian dengan laporan liputan
- `npm run test:e2e` - Jalankan ujian end-to-end
- `npm run lint` - Semak kod dengan ESLint
- `npm run format` - Format kod dengan Prettier

## Struktur Projek

```
src/
├── components/     # Komponen UI yang boleh digunakan semula
├── pages/         # Halaman aplikasi
├── utils/         # Fungsi utiliti
├── data/          # Data dan kandungan
├── hooks/         # Custom React hooks
├── types/         # Definisi TypeScript
└── test/          # Konfigurasi ujian
```

## Fasa Pembangunan

Projek ini dibahagikan kepada 13 fasa:

1. **Fasa 0**: Persediaan projek dan konfigurasi
2. **Fasa 1**: Struktur data dan utiliti localStorage
3. **Fasa 2**: Komponen UI asas dan susun atur
4. **Fasa 3**: Sistem pengurusan pengguna
5. **Fasa 4**: Menu utama dan navigasi
6. **Fasa 5**: Mod Belajar
7. **Fasa 6**: Mod Kuiz
8. **Fasa 7**: Mod Ujian
9. **Fasa 8**: Papan Markah
10. **Fasa 9**: Peningkatan audio dan visual
11. **Fasa 10**: Integrasi kandungan dan penambahbaikan
12. **Fasa 11**: Ujian dan jaminan kualiti
13. **Fasa 12**: Persediaan penyebaran
14. **Fasa 13**: Penyebaran produksi

## Ujian

### Ujian Unit

- Menggunakan Vitest + Testing Library
- Sasaran liputan: 85%+
- Jalankan dengan `npm run test`

### Ujian End-to-End

- Menggunakan Playwright
- Meliputi alur pengguna utama
- Jalankan dengan `npm run test:e2e`

## Penyebaran

Aplikasi ini disebarkan ke Vercel. Setiap fasa yang selesai akan di-tag dan di-push ke GitHub.

## Lesen

Projek ini dibangunkan untuk tujuan pendidikan mengikut sukatan KSRI Malaysia.
