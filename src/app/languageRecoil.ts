import { atom, useRecoilValue } from "recoil";
import { localStorageAtomEffect } from "../utils/reactish/localStorageAtomEffect";


// const detectBrowserLanguage = () => {
//     let language = navigator.language;
//     if (language.includes("-")) {
//         language = language.split("-")[0];
//     }
//     return language;
// };

export const translation = {
    "Generate": {
        "en": "Generate",
        "ua": "Згенерувати",
    },
    "WASD / Arrows to move": {
        "en": "WASD / Arrows to move",
        "ua": "WASD / Стрілки для руху",
    },
    "Esc": {
        "en": "Esc",
        "ua": "Вихід",
    },
    "Restart": {
        "en": "Restart",
        "ua": "Перезапуск",
    },
    "New Dropzone": {
        "en": "New Dropzone",
        "ua": "Нове Місце Висадки",
    },
    "New World": {
        "en": "New World",
        "ua": "Новий Світ",
    },
    "Dev Choice Worlds": {
        "en": "Dev Choice Worlds",
        "uk": "Вибір Розробників",
    },
    "Generate Worlds": {
        "en": "Generate Worlds",
        "uk": "Створити світи",
    },
    "Bookmarked Drops": {
        "en": "Bookmarked Drops",
        "uk": "Додано в закладки",
    },
    "Drop History": {
        "en": "Drop History",
        "uk": "Історія зіграних світів",
    },

} as Record<string, Record<string, string>>;

export const languageRecoil = atom({
    key: "language",
    default: navigator.language,
    effects: [
        localStorageAtomEffect(),
    ],
});

export const useTranslate = () => {

    const lang = useRecoilValue(languageRecoil);
    return (term: string) => translation[term]?.[lang] ?? term;
};
