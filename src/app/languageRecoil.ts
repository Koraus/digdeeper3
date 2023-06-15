import { atom, useRecoilValue } from "recoil";
import { localStorageAtomEffect } from "../utils/reactish/localStorageAtomEffect";


export const translation = {
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
    "Restart": {
        "en": "Restart",
        "uk": "Переграти",
    },
    "New Dropzone": {
        "en": "New Dropzone",
        "uk": "Інше місце",
    },
    "New World": {
        "en": "New World",
        "uk": "Інший світ",
    },
    "Dev Choice": {
        "en": "Dev Choice",
        "uk": "Вибір Розробників",
    },
    "Generate-header": {
        "en": "Generate",
        "uk": "Створити",
    },
    "Bookmarked": {
        "en": "Bookmarked",
        "uk": "Закладки",
    },
    "History": {
        "en": "History",
        "uk": "Історія",
    },
    "Trending": {
        "en": "Trending",
        "uk": "Популярні",
    },
    "Skill Points": {
        "en": "Skill Points",
        "uk": "Очки Навиків",
    },
    "spent": {
        "en": "spent",
        "uk": "витрачено",
    },
    "total": {
        "en": "total",
        "uk": "всього",
    },
    "A skill point is given per level up.": {
        "en": "A skill point is given per level up.",
        "uk": "Очко навику отримується при піднятті рівня.",
    },
    "You can reallocate points for each new game.": {
        "en": "You can reallocate points for each new game.",
        "uk": "Очки можна перерозподілити для кожної нової гри.",
    },
    "Pick Neighborhood": {
        "en": "Pick Neighborhood",
        "uk": "Радіус збору",
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
        "uk": "Поточна + 4 прилеглі + 4 діагональні комірки",
    },
    "Reroll": {
        "en": "Reroll",
        "uk": "Перегенерувати",
    },
    "accept copilot hint": {
        "en": "accept copilot hint",
        "uk": "прийняти підказку копілота",
    },
    "undo": {
        "en": "undo",
        "uk": "скасувати хід",
    },
    "map": {
        "en": "map",
        "uk": "карта",
    },
    "visit basecamp": {
        "en": "visit basecamp",
        "uk": "базовий табір",
    },
    "help": {
        "en": "help",
        "uk": "управління",
    },
    "controls help": {
        "en": "controls help",
        "uk": "управління",
    },
    "Reload": {
        "en": "Reload",
        "uk": "Перезавантажити",
    },
};

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
    return (term: keyof typeof translation) =>
        (term in translation)
            ? resolveByLanguage(translation[term]) ?? term
            : term;
};
