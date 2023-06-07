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
    "change language:": {
        "en": "change language",
        "uk": "змінити мову",
    },
    "Generator:": {
        "en": "Generator:",
        "uk": "Генератор:",
    },
    "filter rock in": {
        "en": "filter rock in:",
        "uk": "відфільтрувати скелів в:",
    },
    "and energy in": {
        "en": "and energy in",
        "uk": "і енергію в:",
    },
    "Count:": {
        "en": "Count",
        "uk": "Кількість",
    },
    "Generate": {
        "en": "Generate",
        "uk": "Згенерувати",
    },
    "WASD / Arrows to move": {
        "en": "WASD / Arrows to move",
        "ua": "WASD / Стрілки для руху",
    },
    "Esc": {
        "en": "Esc",
        "uk": "Вихід",
    },
    "Restart": {
        "en": "Restart",
        "uk": "Перезапуск",
    },
    "New Dropzone": {
        "en": "New Dropzone",
        "uk": "Нове Місце Висадки",
    },
    "New World": {
        "en": "New World",
        "uk": "Новий Світ",
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
    "A skill point is given per level up.": {
        "en": "A skill point is given per level up.",
        "uk": "Очко навику надається при піднятті рівня",
    },
    "You can reallocate points for each new game.": {
        "eu": "You can reallocate points for each new game.",
        "uk": "Ви можете перерозподіляти очки для кожної нової гри.",
    },
    "Skill Points spent:": {
        "eu": "Skill Points spent:",
        "uk": "Витрачені бали навичок:",
    },
    "left": {
        "eu": "left",
        "uk": "залишилося",
    },
    "Pick Neighborhood:": {
        "eu": "Pick Neighborhood:",
        "uk": "Підбирати сусудні",
    },
    "Current Cell Only": {
        "eu": "Current Cell Only",
        "uk": "Лише поточна комірка",
    },
    "Current + 4 Adjacent Cells": {
        "eu": "Current + 4 Adjacent Cells",
        "uk": "Поточна + 4 прилеглі комірки",
    },
    "Current + 4 Adjacent + 4 Diagonal Cells": {
        "eu": "Current + 4 Adjacent + 4 Diagonal Cells",
        "uk": "Поточний + 4 суміжні + 4 діагональні клітинки",
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
