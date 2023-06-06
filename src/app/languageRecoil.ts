import { atom } from "recoil";
import { localStorageAtomEffect } from "../utils/reactish/localStorageAtomEffect";


export const translation = {
    "Generate": { "en": "Generate", "ua": "Згенерувати" },
    "WASD / Arrows to move": { "en": "WASD / Arrows to move", 
    "ua": "WASD / Стрілки для руху" },
    
    "Esc": { "en": "Esc", "ua": "Вихід" },
    "Restart": { "en": "Restart", "ua": "Перезапуск" },
    "New Dropzone": { "en": "New Dropzone", "ua": "Нове місце висадки" },
    "New World": { "en": "New World", "ua": "Новий світ" },
} as Record<string, Record<string, string>>;

export const languageRecoil = atom({
    key: "language",
    default: {
        language: navigator.language,
    },
    effects: [
        localStorageAtomEffect(),
    ],
});
