// File: js/player.js
// Fungsi: Mengatur logika Level, Gelar, dan Tampilan Profil Pemain

import { playerState } from './state.js';

// --- 1. REFERENSI ELEMEN UI (Aman dari Crash) ---
const inputName = document.getElementById('user-name');
const displayLevel = document.getElementById('display-level');
const displayExp = document.getElementById('display-exp');
const expBar = document.getElementById('exp-bar');
const displayTitleBot = document.getElementById('display-title-bot');
const avatarInitial = document.getElementById('avatar-initial');
const headerLevel = document.getElementById('header-level');
const headerTitle = document.getElementById('header-title');

// --- 2. LOGIKA LEVEL & GELAR ---
export function getExpRequirement(level) {
    return 50 * level * (level + 1);
}

export function getTitle(lvl) {
    if(lvl < 10) return "NPC Duniawi";
    if(lvl < 20) return "Skena Ibadah";
    if(lvl < 30) return "Pendekar Subuh";
    if(lvl < 40) return "Suhu Akhlaq";
    if(lvl < 50) return "Bestie Hijrah";
    return "Backingan Pusat";
}

export function calculateLevelInfo(totalExp) {
    let lvl = 1;
    while (totalExp >= getExpRequirement(lvl)) {
        lvl++;
        if (lvl >= 50) { lvl = 50; break; } // Max level 50
    }
    let expForCurrentLvl = lvl === 1 ? 0 : getExpRequirement(lvl - 1);
    let expForNextLvl = getExpRequirement(lvl);
    let currentLevelExp = totalExp - expForCurrentLvl;
    let requiredExp = expForNextLvl - expForCurrentLvl;

    return { level: lvl, expCurrent: currentLevelExp, expRequired: requiredExp };
}

// --- 3. FUNGSI UPDATE UI KESELURUHAN ---
export function updatePlayerUI() {
    let info = calculateLevelInfo(playerState.exp);
    let currentTitle = getTitle(info.level);

    // Update Input & Avatar
    if (inputName && playerState.name) inputName.value = playerState.name;
    if (avatarInitial) {
        avatarInitial.innerText = playerState.name ? playerState.name.charAt(0).toUpperCase() : "A";
    }

    // Update Text Header & Profil
    if (headerLevel) headerLevel.innerText = `Lv. ${info.level}`;
    if (headerTitle) headerTitle.innerText = currentTitle;
    if (displayLevel) displayLevel.innerText = `Level ${info.level}`;

    // Update Progress Bar EXP yang dinamis
    let percent = (info.expCurrent / info.expRequired) * 100;
    if (expBar && displayExp && displayTitleBot) {
        displayExp.innerText = `${info.expCurrent.toLocaleString('id-ID')} / ${info.expRequired.toLocaleString('id-ID')} EXP`;
        expBar.style.width = `${Math.min(percent, 100)}%`;
        displayTitleBot.innerText = `🏆 Gelar: ${currentTitle}`;
    }
}

// --- 4. EVENT LISTENER AUTO-SAVE NAMA ---
if (inputName) {
    inputName.addEventListener('change', (e) => {
        playerState.name = e.target.value;
        localStorage.setItem('userName', e.target.value);
        updatePlayerUI();
    });
}

// --- 5. LISTENER OTOMATIS DARI BRANKAS DATA ---
// Jika EXP bertambah di state.js, otomatis perbarui UI Profil tanpa lag!
document.addEventListener('stateUpdated', updatePlayerUI);
