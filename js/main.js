// File: js/main.js
// Fungsi: Entry point (Penghubung semua modul)

import { playerState, addExp, addKoin } from './state.js';
import { updatePlayerUI } from './player.js'; // 👈 KITA IMPORT LOGIKA PLAYER DI SINI

console.log("🚀 AmalPad Modular V2 Berhasil Booting!");

// 1. Inisialisasi Tampilan Profil Saat Web Dibuka
updatePlayerUI();

// 2. Fungsi pendengar Koin (tetap dipertahankan)
document.addEventListener('stateUpdated', (e) => {
    const data = e.detail;
    const koinDisplay = document.getElementById('koin-display');
    const shopKoinDisplay = document.getElementById('shop-koin-display');
    
    if(koinDisplay) koinDisplay.innerText = data.koin.toLocaleString('id-ID');
    if(shopKoinDisplay) shopKoinDisplay.innerText = data.koin.toLocaleString('id-ID');
});

// 3. UJI COBA: Kita tembak 250 EXP dan 50 Koin otomatis setelah 2 detik
setTimeout(() => {
    console.log("Menjalankan test penambahan EXP dan Koin...");
    addExp(250); 
    addKoin(50);
}, 2000);
