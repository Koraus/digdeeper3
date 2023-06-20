import { caForDropzone } from "../../../model/sight";
import { LayoutContext } from "./LayoutContext";
import { Grass } from "./Grass";
import { Rock } from "./Rock";
import { Bricks } from "./Bricks";
import { Pickable, PickablePick } from "./Pickable";
import { Color, Matrix4, Quaternion, Vector3 } from "three";
import { epxandedSight } from "./CellsView";



const _m4s = Array.from({ length: 3 }, () => new Matrix4());
const _v3s = Array.from({ length: 3 }, () => new Vector3());
const _qs = Array.from({ length: 3 }, () => new Quaternion());


const autoColorTheme = ({ rockColor, grassColor, energyColor,
}: {
    rockColor: string,
    grassColor: string,
    energyColor: string
}) => {

    const toRGBArray = (rgbStr: string) => {
        const matches = rgbStr.match(/\d+/g);
        if (matches !== null) {
            return matches.map(Number);
        }
        return [];
    };

    const rgb2hsv = (rgb: number[]): number[] => {
        const [r, g, b] = rgb;
        const v = Math.max(r, g, b);
        const c = v - Math.min(r, g, b);
        const h = c && ((v == r)
            ? (g - b) / c : ((v == g)
                ? 2 + (b - r) / c : 4 + (r - g) / c));
        return [60 * (h < 0 ? h + 6 : h), v && c / v, v];
    };

    const hsv2rgb = (hsv: number[]): string => {
        const [h, s, v] = hsv;
        const f = (n: number, k = (n + h / 60) % 6) =>
            v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
        return `rgb(${Math.round(f(5))}, 
        ${Math.round(f(3))}, ${Math.round(f(1))})`;
    };

    const surfaceRockColor = () => {
        const rockColorHSV = rgb2hsv(toRGBArray(rockColor));
        const rockColorRGB = hsv2rgb(
            [rockColorHSV[0],
            rockColorHSV[1],
            (rockColorHSV[2] * 0.7)]);
        return rockColorRGB;
    };

    const surfaceGrassColor = () => {
        const grassColorHSV = rgb2hsv(toRGBArray(grassColor));
        const grassColorRGB = hsv2rgb(
            [grassColorHSV[0]
                , grassColorHSV[1],
            (grassColorHSV[2] * 0.7)]);
        return grassColorRGB;
    };

    const surfaceEnergyColor = () => {
        const energyColorHSV = rgb2hsv(toRGBArray(energyColor));
        const energyColorRGB = hsv2rgb(
            [energyColorHSV[0],
            energyColorHSV[1],
            (energyColorHSV[2] * 0.7)]);
        return energyColorRGB;
    };

    const bricksColor = () => {
        const color = rgb2hsv(toRGBArray(rockColor));
        const colorRGB = hsv2rgb([color[0], 0.2, 150]);
        return colorRGB;
    };

    const colorTheme = {
        rock: {
            mainColor: new Color(rockColor),
            snowColor: undefined,
        },
        grass: new Color(grassColor),
        pickable: new Color(energyColor),
        surface: {
            rock: new Color(surfaceRockColor()),
            grass: new Color(surfaceGrassColor()),
            energy: new Color(surfaceEnergyColor()),
            thickness: 2,
        },
        bricks: new Color(bricksColor()),
    };

    return colorTheme;
};

// const colorThemes = [autoColorTheme({
//     rockColor: "rgb(180, 60, 98)",
//     energyColor: "rgb(101, 93, 195)",
//     grassColor: "rgb(115, 170, 198)",
// })]

const colorThemes = [{
    // floating world draft
    rock: undefined,
    grass: new Color("#90ea67"),
    pickable: new Color("#b635d3"),
    surface: {
        rock: undefined,
        grass: new Color("#d8dd76"),
        energy: new Color("#ffc57a"),
        thickness: 0.4,
    },
    bricks: new Color("#ff8968"),
}, {
    // earth-like vegetation of mideteranian climate
    rock: {
        mainColor: new Color("#2e444f"),
        snowColor: undefined,
    },
    grass: new Color("#90ea67"),
    pickable: new Color("#b635d3"),
    surface: {
        rock: new Color("#576c6e"),
        grass: new Color("#d8dd76"),
        energy: new Color("#ffc57a"),
        thickness: 2,
    },
    bricks: new Color("#ff8968"),
}, {
    // [name]
    rock: {
        mainColor: new Color("#782881"),
        snowColor: undefined,
    },
    grass: new Color("#980843"),
    pickable: new Color("#61C3EA"),
    surface: {
        rock: new Color("#2d282e"),
        grass: new Color("#6a3e4f"),
        energy: new Color("#a947b4"),
        thickness: 2,
    },
    bricks: new Color("#bf4967"),
}, {
    //     // snowy -- tbd
    //     rock: {
    //         mainColor: new Color("#0b76ab"),
    //         snowColor: new Color("#cae0fb"),
    //     },
    //     rockSnow: new Color("#cae0fb"),
    //     grass: new Color("#e66ce8"),
    //     pickable: new Color("#5bef20"),
    //     surface: {
    //         rock: new Color("#576c6e"),
    //         grass: new Color("#d8dd76"),
    //         energy: new Color("#ffc57a"),
    //  thickness: 2,
    //     },
    //     bricks: new Color("#fb9658"),
    // }, {
    // cherry
    rock: {
        mainColor: new Color("#670471"),
        snowColor: undefined,
    },
    grass: new Color("#cb276c"),
    pickable: new Color("#61C3EA"),
    surface: {
        rock: new Color("#66356b"),
        grass: new Color("#ce6d95"),
        energy: new Color("#ca7aa9"),
        thickness: 2,
    },
    bricks: new Color("#bf4967"),
}, {
    // mossy
    rock: {
        mainColor: new Color("#5a3b4d"),
        snowColor: new Color("#0e8960"),
    },
    grass: new Color("#98d06d"),
    pickable: new Color("#ff4a98"),
    surface: {
        rock: new Color("#97858f"),
        grass: new Color("#c9cf79"),
        energy: new Color("#cfc279"),
        thickness: 2,
    },
    bricks: new Color("#938572"),
}, {
    // Alien Planet
    rock: {
        mainColor: new Color("#6c6356"),
        snowColor: undefined,
    },
    grass: new Color("#175051"),
    pickable: new Color("#5cf1f4"),
    surface: {
        rock: new Color("#151f3b"),
        grass: new Color("#2a3246"),
        energy: new Color("#3d4866"),
        thickness: 2,
    },
    bricks: new Color("#155b84"),
}] as const;

export function Cell(ctx: LayoutContext) {

    const {
        rootMatrixWorld,
        state: { t, x, isVisited, dropzone, isCollected, trek },
        abuseBox,
    } = ctx;

    const cIndex =
        Number(dropzone.world.ca.rule[1]);
    // Math.floor(t / 12) + 10;
    const colors = colorThemes[cIndex % colorThemes.length];

    const expSight = epxandedSight(trek);
    const caState = caForDropzone(dropzone)._at(t, x);

    const { visualStateMap } = expSight;
    const isGrass = caState === visualStateMap.grass;
    const isRock = caState === visualStateMap.rock;
    const isEnergy = caState === visualStateMap.energy;
    const visualKey = isGrass ? "grass" : isRock ? "rock" : "energy";

    const surfaceColor = colors.surface[visualKey];
    if (surfaceColor) {
        const surface = abuseBox();
        surface.setColor(surfaceColor);
        surface.setMatrix(_m4s[1].compose(
            _v3s[0].set(0, -colors.surface.thickness / 2, 0),
            _qs[0].identity(),
            _v3s[1].set(1, colors.surface.thickness, 1),
        ).premultiply(rootMatrixWorld));
    }
    if (isEnergy) {
        if (isCollected) {
            const isJustCollected = isCollected && !ctx.prevState?.isCollected;
            if (isJustCollected) {
                PickablePick(colors.pickable, ctx);
            }
        } else {
            Pickable(colors.pickable, ctx);
        }
    }

    if (!isVisited) {
        if (isGrass) {
            Grass(colors.grass, ctx);
        }
        if (isRock && colors.rock) {
            Rock(colors.rock, ctx);
        }
    } else {
        if (isRock && !surfaceColor) {
            const surface = abuseBox();
            surface.setColor(colors.bricks);
            surface.setMatrix(_m4s[1].compose(
                _v3s[0].set(0, -colors.surface.thickness / 2, 0),
                _qs[0].identity(),
                _v3s[1].set(1, colors.surface.thickness, 1),
            ).premultiply(rootMatrixWorld));
        }
        Bricks(colors.bricks, ctx);
    }
}
