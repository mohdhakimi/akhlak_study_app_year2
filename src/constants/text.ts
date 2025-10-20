// Bahasa Melayu text constants for the application
export const TEXT = {
  // App title and branding
  APP_TITLE: 'Pelajaran Subjek Tahun Dua KSRI',
  APP_SUBTITLE: 'Aplikasi Pembelajaran Interaktif',

  // Navigation and menus
  MAIN_MENU: 'Menu Utama',
  STUDY_MODE: 'Mod Belajar',
  DOA_MODE: 'Mod Doa',
  QUIZ_MODE: 'Mod Kuiz',
  TEST_MODE: 'Mod Ujian',
  LEADERBOARD: 'Papan Markah',
  BACK_TO_MENU: 'Kembali ke Menu',

  // User management
  SELECT_USER: 'Pilih Pengguna',
  CREATE_NEW_USER: 'Cipta Pengguna Baru',
  USER_NAME: 'Nama Pengguna',
  ENTER_NAME: 'Masukkan nama anda',
  SWITCH_USER: 'Tukar Pengguna',
  WELCOME: 'Selamat Datang',

  // Study mode
  SELECT_TOPIC: 'Pilih Topik',
  NEXT: 'Seterusnya',
  PREVIOUS: 'Sebelum',
  PROGRESS: 'Kemajuan',
  OF: 'dari',

  // Quiz and test
  SELECT_CATEGORY: 'Pilih Kategori',
  QUESTION: 'Soalan',
  CORRECT: 'Betul',
  INCORRECT: 'Salah',
  SCORE: 'Markah',
  PERCENTAGE: 'Peratus',
  RESULTS: 'Keputusan',
  YOUR_SCORE: 'Markah Anda',
  CORRECT_ANSWERS: 'Jawapan Betul',
  WRONG_ANSWERS: 'Jawapan Salah',
  REVIEW: 'Ulasan',

  // Leaderboard
  RANK: 'Kedudukan',
  PLAYER: 'Pemain',
  DATE: 'Tarikh',
  HIGH_SCORES: 'Markah Tertinggi',
  NO_SCORES: 'Tiada markah lagi',
  ENCOURAGEMENT:
    'Cuba ambil kuiz atau ujian untuk melihat markah anda di sini!',

  // Buttons and actions
  START: 'Mula',
  CONTINUE: 'Teruskan',
  FINISH: 'Selesai',
  TRY_AGAIN: 'Cuba Lagi',
  CLOSE: 'Tutup',
  SAVE: 'Simpan',
  CANCEL: 'Batal',
  CONFIRM: 'Sahkan',

  // Messages and feedback
  CONGRATULATIONS: 'Syabas!',
  EXCELLENT: 'Hebat!',
  WELL_DONE: 'Bagus!',
  KEEP_GOING: 'Teruskan!',
  GOOD_JOB: 'Kerja yang baik!',

  // Errors and validation
  NAME_REQUIRED: 'Nama diperlukan',
  NAME_TOO_SHORT: 'Nama terlalu pendek',
  NAME_ALREADY_EXISTS: 'Nama sudah wujud',
  INVALID_DATA: 'Data tidak sah',
  SAVE_ERROR: 'Gagal menyimpan',
  LOAD_ERROR: 'Gagal memuatkan data',

  // Settings
  SETTINGS: 'Tetapan',
  SOUND: 'Bunyi',
  ANIMATIONS: 'Animasi',
  LANGUAGE: 'Bahasa',
  ENABLED: 'Aktif',
  DISABLED: 'Tidak Aktif',

  // Accessibility
  LOADING: 'Memuatkan...',
  PLEASE_WAIT: 'Sila tunggu sebentar',

  // Time and dates
  TODAY: 'Hari ini',
  YESTERDAY: 'Semalam',
  THIS_WEEK: 'Minggu ini',
  THIS_MONTH: 'Bulan ini',

  // Quiz specific
  QUIZ_COMPLETE: 'Kuiz Selesai',
  TEST_COMPLETE: 'Ujian Selesai',
  TIME_UP: 'Masa Tamat',
  QUESTION_OF: 'Soalan',

  // Study specific
  TOPIC_COMPLETE: 'Topik Selesai',
  NOTES: 'Nota',
  READ_MORE: 'Baca Lagi',

  // Common words
  YES: 'Ya',
  NO: 'Tidak',
  OK: 'OK',
  DONE: 'Selesai',
  NEXT_STEP: 'Langkah Seterusnya',
  PREVIOUS_STEP: 'Langkah Sebelum',

  // Placeholders
  ENTER_YOUR_NAME: 'Masukkan nama anda di sini...',
  SEARCH: 'Cari...',

  // Instructions
  INSTRUCTIONS: 'Arahan',
  HOW_TO_PLAY: 'Cara Bermain',
  SELECT_ANSWER: 'Pilih jawapan yang betul',
  CLICK_TO_CONTINUE: 'Klik untuk teruskan',

  // Statistics
  TOTAL_QUESTIONS: 'Jumlah Soalan',
  CORRECT_ANSWERS_COUNT: 'Jawapan Betul',
  WRONG_ANSWERS_COUNT: 'Jawapan Salah',
  AVERAGE_SCORE: 'Purata Markah',
  BEST_SCORE: 'Markah Terbaik',
  ATTEMPTS: 'Percubaan',

  // Motivational messages
  MOTIVATION: {
    KEEP_LEARNING: 'Teruskan belajar!',
    YOU_CAN_DO_IT: 'Anda boleh buat!',
    PRACTICE_MAKES_PERFECT: 'Latihan menjadikan sempurna',
    EVERY_MISTAKE_IS_LEARNING: 'Setiap kesilapan adalah pembelajaran',
    EXCELLENT: 'Hebat!',
    GREAT_PROGRESS: 'Kemajuan yang hebat!',
    GOOD_JOB: 'Bagus!',
    ALMOST_THERE: 'Hampir sampai!',
    PERFECT_SCORE: 'Markah sempurna!',
    IMPROVEMENT: 'Peningkatan yang baik!',
  },
} as const

// Helper function to get motivational message
export const getMotivationalMessage = (
  score: number,
  total: number
): string => {
  const percentage = (score / total) * 100

  if (percentage === 100) {
    return TEXT.MOTIVATION.PERFECT_SCORE
  } else if (percentage >= 90) {
    return TEXT.MOTIVATION.EXCELLENT
  } else if (percentage >= 80) {
    return TEXT.MOTIVATION.GREAT_PROGRESS
  } else if (percentage >= 70) {
    return TEXT.MOTIVATION.GOOD_JOB
  } else if (percentage >= 60) {
    return TEXT.MOTIVATION.ALMOST_THERE
  } else if (percentage >= 50) {
    return TEXT.MOTIVATION.IMPROVEMENT
  } else {
    return TEXT.MOTIVATION.KEEP_LEARNING
  }
}

// Helper function to format score display
export const formatScore = (score: number, total: number): string => {
  return `${score}/${total} (${Math.round((score / total) * 100)}%)`
}

// Helper function to format date in Bahasa Melayu
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ms-MY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
