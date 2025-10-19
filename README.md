# Akhlak Tahun Dua KSRI - Aplikasi Pembelajaran Interaktif

Aplikasi web interaktif untuk pembelajaran Akhlak Tahun Dua mengikut sukatan KSRI. Dibangunkan dengan React, TypeScript, dan Tailwind CSS dengan fokus pada pengalaman pembelajaran yang menarik dan berkesan.

## 🚀 Teknologi

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Testing**: Vitest + Testing Library + Playwright
- **Code Quality**: ESLint + Prettier
- **Deployment**: Vercel
- **Audio**: Web Audio API untuk kesan bunyi
- **State Management**: React Context + Custom Hooks

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

## 📁 Struktur Projek

```
src/
├── components/           # Komponen UI yang boleh digunakan semula
│   ├── __tests__/       # Ujian unit untuk komponen
│   ├── AnswerOption.tsx # Komponen pilihan jawapan
│   ├── QuestionCard.tsx # Komponen kad soalan
│   ├── QuizResults.tsx  # Komponen keputusan kuiz
│   └── ...              # Komponen lain
├── pages/               # Halaman aplikasi utama
│   ├── __tests__/       # Ujian unit untuk halaman
│   ├── MainMenu.tsx     # Menu utama
│   ├── QuizMode.tsx     # Mod kuiz
│   ├── TestMode.tsx     # Mod ujian
│   └── StudyMode.tsx    # Mod belajar
├── hooks/               # Custom React hooks
│   ├── __tests__/       # Ujian unit untuk hooks
│   ├── useQuizMode.ts   # Hook untuk mod kuiz
│   ├── useTestMode.ts   # Hook untuk mod ujian
│   └── useAudio.ts      # Hook untuk audio
├── utils/               # Fungsi utiliti
│   ├── __tests__/       # Ujian unit untuk utiliti
│   ├── audio.ts         # Pengurusan audio
│   ├── localStorage.ts  # Pengurusan penyimpanan
│   └── shuffleOptions.ts # Fungsi untuk mengacak pilihan
├── contexts/            # React Context providers
│   ├── UserContext.tsx  # Konteks pengguna
│   └── BilingualContext.tsx # Konteks dwibahasa
├── types/               # Definisi TypeScript
│   └── index.ts         # Semua jenis data
├── data/                # Data dan kandungan
│   ├── akhlak_db.json   # Pangkalan data soalan
│   └── akhlak.txt       # Kandungan asal
└── test/                # Konfigurasi ujian
    └── setup.tsx        # Setup ujian
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

## 🧪 Ujian

### Ujian Unit

- Menggunakan Vitest + Testing Library
- Sasaran liputan: 85%+
- Jalankan dengan `npm run test`
- Meliputi komponen, hooks, dan utiliti

### Ujian End-to-End

- Menggunakan Playwright
- Meliputi alur pengguna utama
- Jalankan dengan `npm run test:e2e`
- Ujian merentas pelayar (Chrome, Firefox, Safari)

## 🏗️ Arkitektur Kod

### Prinsip Pembangunan

- **Type Safety**: Menggunakan TypeScript untuk keselamatan jenis
- **Component-Based**: Komponen yang boleh digunakan semula dan modular
- **Custom Hooks**: Logik perniagaan dipisahkan dalam custom hooks
- **Context API**: Pengurusan state global dengan React Context
- **Utility Functions**: Fungsi utiliti yang tulen dan boleh diuji
- **Error Handling**: Pengendalian ralat yang komprehensif

### Pola Reka Bentuk

- **Single Responsibility**: Setiap komponen/fungsi mempunyai satu tanggungjawab
- **Composition over Inheritance**: Menggunakan komposisi untuk membina UI
- **Custom Hooks Pattern**: Mengasingkan logik state dari komponen UI
- **Provider Pattern**: Menggunakan Context untuk state global
- **Factory Pattern**: Untuk penciptaan objek audio dan data

### Kualiti Kod

- **ESLint**: Pemeriksaan kod statik
- **Prettier**: Format kod yang konsisten
- **TypeScript**: Pemeriksaan jenis yang ketat
- **JSDoc**: Dokumentasi kod yang komprehensif
- **Testing**: Liputan ujian yang tinggi

## ⚡ Prestasi dan Pengoptimuman

### Pengoptimuman React

- **React.memo**: Memoization untuk komponen yang tidak berubah
- **useMemo**: Memoization untuk pengiraan yang mahal
- **useCallback**: Memoization untuk fungsi yang dipass sebagai props
- **Lazy Loading**: Memuat komponen secara malas
- **Code Splitting**: Pemisahan kod untuk mengurangkan bundle size

### Pengoptimuman Audio

- **Web Audio API**: Penggunaan API audio yang cekap
- **Audio Buffering**: Pre-loading audio untuk prestasi yang lancar
- **Volume Control**: Kawalan kelantangan yang responsif
- **Error Handling**: Pengendalian ralat audio yang robust

### Pengoptimuman Data

- **localStorage**: Penyimpanan data tempatan yang cekap
- **Data Validation**: Pengesahan data untuk integriti
- **Caching**: Cache data untuk mengurangkan beban
- **Lazy Loading**: Memuat data secara malas

## 🚀 Penyebaran

Aplikasi ini disebarkan ke Vercel dengan konfigurasi berikut:

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 18.x
- **Environment Variables**: Tiada (aplikasi frontend sahaja)

### Proses Penyebaran

1. Push kod ke branch `main`
2. Vercel secara automatik membina dan menyebarkan
3. URL produksi: [https://akhlak-flashcard.vercel.app](https://akhlak-flashcard.vercel.app)

## 📊 Metrik Prestasi

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **Bundle Size**: < 500KB (gzipped)
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🤝 Sumbangan

Projek ini dibangunkan untuk tujuan pendidikan mengikut sukatan KSRI Malaysia. Sumbangan dialu-alukan untuk:

- Pembetulan bug
- Penambahbaikan prestasi
- Penambahan ciri baru
- Peningkatan dokumentasi

## 📄 Lesen

Projek ini dibangunkan untuk tujuan pendidikan mengikut sukatan KSRI Malaysia. Kod sumber tersedia untuk tujuan pembelajaran dan rujukan.
