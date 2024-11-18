// src/global.d.ts atau root proyek Anda
declare global {
  interface Window {
    ethereum?: any; // Menambahkan 'ethereum' ke objek window, yang mungkin undefined
  }
}
