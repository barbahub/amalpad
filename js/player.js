// File: js/player.js
import { playerState } from './state.js';

// --- 1. KONFIGURASI & KONSTANTA (Mencegah Magic Strings) ---
const MAX_LEVEL = 50;

const CLASSES = {
    avatarBase: "w-24 h-24 bg-gradient-to-tr from-emerald-500 to-teal-600 rounded-full mx-auto flex items-center justify-center mb-4 text-4xl text-white font-extrabold relative z-10 transition-all duration-700",
    inputBase: "w-full bg-transparent outline-none py-1 mb-1 font-black text-2xl text-center transition relative z-10 placeholder-gray-300"
};

// Dictionary untuk Kosmetik Aura (DRY Principle)
const AURA_STYLES = {
    'aura_sss': { avatar: ['avatar-aura-sss'], name: ['name-aura-sss'] },
    'aura_vip': { avatar: ['avatar-aura-vip'], name: ['name-aura-vip'] },
    'aura_koin': { avatar: ['shadow-[0_0_30px_rgba(250,204,21,0.8)]', 'ring-4', 'ring-yellow-400'] },
    'aura_sakura': { avatar: ['shadow-[0_0_30px_rgba(244,114,182,0.8)]', 'ring-4', 'ring-pink-400'] }
};

// --- 2. REFERENSI ELEMEN UI (Lazy / Safe Caching) ---
const DOM = {
    inputName: document.getElementById('user-name'),
    displayLevel: document.getElementById('display-level'),
    displayExp: document.getElementById('display-exp'),
    expBar: document.getElementById('exp-bar'),
    displayTitleBot: document.getElementById('display-title-bot'),
    avatarInitial: document.getElementById('avatar-initial'),
    headerLevel: document.getElementById('header-level'),
    headerTitle: document.getElementById('header-title')
};

// --- 3. LOGIKA LEVEL & GELAR (KISS Principle) ---
export const getExpRequirement = (level) => 50 * level * (level + 1);

export const getTitle = (lvl) => {
    if (lvl < 10) return "NPC Duniawi";
    if (lvl < 20) return "Skena Ibadah";
    if (lvl < 30) return "Pendekar Subuh";
    if (lvl < 40) return "Suhu Akhlaq";
    if (lvl < 50) return "Bestie Hijrah";
    return "Backingan Pusat";
};

export function calculateLevelInfo(totalExp) {
    let level = 1;
    // Loop lebih efisien dengan pengecekan MAX_LEVEL di dalam kondisi
    while (level < MAX_LEVEL && totalExp >= getExpRequirement(level)) {
        level++;
    }
    
    const expForCurrentLvl = level === 1 ? 0 : getExpRequirement(level - 1);
    const expForNextLvl = getExpRequirement(level);
    
    return { 
        level, 
        expCurrent: totalExp - expForCurrentLvl, 
        expRequired: expForNextLvl - expForCurrentLvl 
    };
}

// --- 4. FUNGSI KOSMETIK (Modular & Clean) ---
function applyCosmetics(level) {
    if (!DOM.avatarInitial) return;

    // Reset Class UI dengan base string
    DOM.avatarInitial.className = CLASSES.avatarBase;
    if (DOM.inputName) DOM.inputName.className = CLASSES.inputBase;

    // Ekstraksi data secara aman (Destructuring)
    const { aura, name_fx } = playerState.equippedItems || {};

    // A. Terapkan Aura dari Dictionary
    if (AURA_STYLES[aura]) {
        DOM.avatarInitial.classList.add(...(AURA_STYLES[aura].avatar || []));
        if (DOM.inputName && AURA_STYLES[aura].name) {
            DOM.inputName.classList.add(...AURA_STYLES[aura].name);
        }
    } else {
        // Default Border Level
        const defaultBorder = level >= 30 ? ['ring-4', 'ring-yellow-400', 'shadow-lg', 'shadow-yellow-400/50'] :
                              level >= 10 ? ['ring-4', 'ring-blue-400'] : 
                                            ['ring-4', 'ring-gray-200', 'dark:ring-gray-600'];
        DOM.avatarInitial.classList.add(...defaultBorder);
    }

    // B. Terapkan Gaya Nama (Name FX) dengan Optional Chaining
    if (DOM.inputName) {
        if (name_fx && window.previewStyles?.[name_fx]) {
            // Filter Boolean membuang string kosong secara otomatis
            const styles = window.previewStyles[name_fx].split(' ').filter(Boolean);
            if (styles.length) DOM.inputName.classList.add(...styles);
        } else if (!['aura_sss', 'aura_vip'].includes(aura)) {
            DOM.inputName.classList.add('text-gray-800', 'dark:text-gray-100');
        }
    }
}

// --- 5. FUNGSI UPDATE UI KESELURUHAN (Batch Rendering) ---
export function updatePlayerUI() {
    const info = calculateLevelInfo(playerState.exp);
    const currentTitle = getTitle(info.level);

    if (DOM.inputName && playerState.name !== undefined) {
        DOM.inputName.value = playerState.name;
    }

    // Hindari DOM query berulang jika tidak perlu
    if (DOM.avatarInitial && !DOM.avatarInitial.querySelector('img')) {
        DOM.avatarInitial.innerText = playerState.name ? playerState.name.charAt(0).toUpperCase() : "A";
    }

    // Batch Update Teks (DRY: Tidak perlu if berulang-ulang)
    const textUpdates = [
        { el: DOM.headerLevel, text: `Lv. ${info.level}` },
        { el: DOM.headerTitle, text: currentTitle },
        { el: DOM.displayLevel, text: `Level ${info.level}` },
        { el: DOM.displayTitleBot, text: `🏆 Gelar: ${currentTitle}` },
        { el: DOM.displayExp, text: `${info.expCurrent.toLocaleString('id-ID')} / ${info.expRequired.toLocaleString('id-ID')} EXP` }
    ];

    textUpdates.forEach(({ el, text }) => {
        if (el) el.innerText = text;
    });

    // Update Progress Bar Dinamis
    if (DOM.expBar) {
        const percent = Math.min((info.expCurrent / info.expRequired) * 100, 100);
        DOM.expBar.style.width = `${percent}%`;
    }

    applyCosmetics(info.level);
}

// --- 6. INISIALISASI EVENT LISTENER ---
function initEvents() {
    if (DOM.inputName) {
        DOM.inputName.addEventListener('change', (e) => {
            const cleanName = e.target.value.trim();
            playerState.name = cleanName;
            localStorage.setItem('userName', cleanName);
            updatePlayerUI();
        });
    }
    document.addEventListener('stateUpdated', updatePlayerUI);
}

// Jalankan Listener
initEvents();
