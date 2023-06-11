import { atom, useRecoilValue } from "recoil";
import { localStorageAtomEffect } from "../utils/reactish/localStorageAtomEffect";


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
        "en": "You can reallocate points for each new game.",
        "uk": "Ви можете перерозподіляти очки для кожної нової гри.",
    },
    "Skill Points spent:": {
        "en": "Skill Points spent:",
        "uk": "Витрачені бали навичок:",
    },
    "left": {
        "en": "left",
        "uk": "залишилося",
    },
    "Pick Neighborhood:": {
        "en": "Pick Neighborhood:",
        "uk": "Підбирати сусудні",
    },
    "Current Cell Only": {
        "en": "Current Cell Only",
        "uk": "Лише поточна комірка",
    },
    "Current + 4 Adjacent Cells": {
        "en": "Current + 4 Adjacent Cells",
        "uk": "Поточна + 4 прилеглі комірки",
    },
    "Current + 4 Adjacent + 4 Diagonal Cells": {
        "en": "Current + 4 Adjacent + 4 Diagonal Cells",
        "uk": "Поточний + 4 суміжні + 4 діагональні клітинки",
    },
} as Record<string, Record<string, string>>;

const resolveByLanguage = <T>(
    languages: readonly string[],
    translations: Readonly<Record<string, T>>,
) => {
    for (const language of languages) {
        if (language in translations) {
            return translations[language];
        }
    }
    for (const language of languages) {
        const languageShort = language.split("-")[0];
        if (languageShort in translations) {
            return translations[languageShort];
        }
    }
};

export const languageRecoil = atom({
    key: "language",
    default: undefined as string | undefined,
    effects: [
        localStorageAtomEffect(),
    ],
});

export const useResolveByLanguage = () => {
    const selectedLanguage = useRecoilValue(languageRecoil);
    const languages =
        selectedLanguage
            ? [selectedLanguage, ...navigator.languages]
            : navigator.languages;
    return <T>(translations: Readonly<Record<string, T>>) =>
        resolveByLanguage(languages, translations);
};

export const useTranslate = () => {
    const resolveByLanguage = useResolveByLanguage();
    return (term: string) =>
        (term in translation)
            ? resolveByLanguage(translation[term]) ?? term
            : term;
};
