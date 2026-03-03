// File: js/state.js
// Fungsi: Brankas data utama (State Management)

const getSafeJSON = (key, fallback) => {
    try {
        const item = localStorage.getItem(key);
        return (item && item !== "undefined") ? JSON.parse(item) : fallback;
    } catch (e) {
        console.error(`Error parsing ${key} from localStorage`, e);
        return fallback;
    }
};

// State Utama (Gudang Data)
export const playerState = {
    name: localStorage.getItem('userName') || "",
    exp: parseInt(localStorage.getItem('totalExp')) || 0,
    koin: parseInt(localStorage.getItem('totalKoin')) || 0,
    level: 1,
    unlockedItems: getSafeJSON('unlockedItems', ["tasbih_kayu"]),
    inventory: getSafeJSON('inventory', {}),
    equippedItems: getSafeJSON('equippedItems', { tasbih_skin: 'tasbih_kayu', name_fx: null, aura: null })
};

// Fungsi Utama untuk merubah data (Action)
export function addExp(amount) {
    if (playerState.inventory['item_buff'] > 0) amount *= 2; 
    playerState.exp += amount;
    localStorage.setItem('totalExp', playerState.exp);
    document.dispatchEvent(new CustomEvent('stateUpdated', { detail: playerState }));
}

export function addKoin(amount) {
    playerState.koin += amount;
    localStorage.setItem('totalKoin', playerState.koin);
    document.dispatchEvent(new CustomEvent('stateUpdated', { detail: playerState }));
}
