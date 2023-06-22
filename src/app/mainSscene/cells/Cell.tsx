import { caForDropzone } from "../../../model/sight";
import { LayoutContext } from "./LayoutContext";
import { Grass } from "./Grass";
import { Rock } from "./Rock";
import { Bricks } from "./Bricks";
import { Pickable, PickablePick } from "./Pickable";
import { Color as ThreeColor, Matrix4, Quaternion, Vector3 } from "three";
import { epxandedSight } from "./CellsView";
import Color from "color";
import { Aqua } from "./Aqua";



const _m4s = Array.from({ length: 3 }, () => new Matrix4());
const _v3s = Array.from({ length: 3 }, () => new Vector3());
const _qs = Array.from({ length: 3 }, () => new Quaternion());


const autoColorTheme = ({
    rockColor, grassColor, energyColor,
}: {
    rockColor: Color,
    grassColor: Color,
    energyColor: Color,
}) => {
    const surfaceRockColor = Color.hsv(
        rockColor.hue(),
        rockColor.saturationv(),
        rockColor.value() * 0.6);

    const surfaceGrassColor = Color.hsv(
        grassColor.hue(),
        grassColor.saturationv() * 0.9,
        grassColor.value() * 0.8);

    const surfaceEnergyColor = Color.hsv(
        energyColor.hue(),
        energyColor.saturationv() * 0.7,
        energyColor.value() * 0.7);

    const bricksColor = Color.hsv(
        rockColor.hue() * 1.05,
        rockColor.saturationv() * 0.3,
        70);

    const colorTheme = {
        rock: {
            mainColor: new ThreeColor(rockColor.toString()),
            snowColor: undefined,
        },
        grass: new ThreeColor(grassColor.toString()),
        pickable: new ThreeColor(energyColor.toString()),
        surface: {
            rock: new ThreeColor(surfaceRockColor.toString()),
            grass: new ThreeColor(surfaceGrassColor.toString()),
            energy: new ThreeColor(surfaceEnergyColor.toString()),
            thickness: 2,
        },
        bricks: new ThreeColor(bricksColor.toString()),
    };

    return colorTheme;
};

const colorThemes1 = [
    autoColorTheme({
        rockColor: new Color("#965e3d"),
        energyColor: new Color("#74cbf3"),
        grassColor: new Color("#99ff24"),
    }),
];

const colorThemes = [{
    // floating world draft
    aqua: new ThreeColor("#5cbefb"),
    rock: undefined,
    grass: new ThreeColor("#90ea67"),
    pickable: new ThreeColor("#b635d3"),
    surface: {
        rock: undefined,
        grass: new ThreeColor("#d8dd76"),
        energy: new ThreeColor("#ffc57a"),
        thickness: 0.4,
    },
    bricks: new ThreeColor("#ff8968"),
}, {
    // floating world draft
    aqua: undefined,
    rock: undefined,
    grass: new ThreeColor("#90ea67"),
    pickable: new ThreeColor("#b635d3"),
    surface: {
        rock: undefined,
        grass: new ThreeColor("#d8dd76"),
        energy: new ThreeColor("#ffc57a"),
        thickness: 0.4,
    },
    bricks: new ThreeColor("#ff8968"),
}, {
    // earth-like vegetation of mideteranian climate
    aqua: undefined,
    rock: {
        mainColor: new ThreeColor("#2e444f"),
        snowColor: undefined,
    },
    grass: new ThreeColor("#90ea67"),
    pickable: new ThreeColor("#b635d3"),
    surface: {
        rock: new ThreeColor("#576c6e"),
        grass: new ThreeColor("#d8dd76"),
        energy: new ThreeColor("#ffc57a"),
        thickness: 2,
    },
    bricks: new ThreeColor("#ff8968"),
}, {
    // [name]
    aqua: undefined,
    rock: {
        mainColor: new ThreeColor("#782881"),
        snowColor: undefined,
    },
    grass: new ThreeColor("#980843"),
    pickable: new ThreeColor("#61C3EA"),
    surface: {
        rock: new ThreeColor("#2d282e"),
        grass: new ThreeColor("#6a3e4f"),
        energy: new ThreeColor("#a947b4"),
        thickness: 2,
    },
    bricks: new ThreeColor("#bf4967"),
}, {
    //     // snowy -- tbd
    //     aqua: undefined,
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
    aqua: undefined,
    rock: {
        mainColor: new ThreeColor("#670471"),
        snowColor: undefined,
    },
    grass: new ThreeColor("#cb276c"),
    pickable: new ThreeColor("#61C3EA"),
    surface: {
        rock: new ThreeColor("#66356b"),
        grass: new ThreeColor("#ce6d95"),
        energy: new ThreeColor("#ca7aa9"),
        thickness: 2,
    },
    bricks: new ThreeColor("#bf4967"),
}, {
    // mossy
    aqua: undefined,
    rock: {
        mainColor: new ThreeColor("#5a3b4d"),
        snowColor: new ThreeColor("#0e8960"),
    },
    grass: new ThreeColor("#98d06d"),
    pickable: new ThreeColor("#ff4a98"),
    surface: {
        rock: new ThreeColor("#97858f"),
        grass: new ThreeColor("#c9cf79"),
        energy: new ThreeColor("#cfc279"),
        thickness: 2,
    },
    bricks: new ThreeColor("#938572"),
}, {
    // Alien Planet
    aqua: undefined,
    rock: {
        mainColor: new ThreeColor("#6c6356"),
        snowColor: undefined,
    },
    grass: new ThreeColor("#175051"),
    pickable: new ThreeColor("#5cf1f4"),
    surface: {
        rock: new ThreeColor("#151f3b"),
        grass: new ThreeColor("#2a3246"),
        energy: new ThreeColor("#3d4866"),
        thickness: 2,
    },
    bricks: new ThreeColor("#155b84"),
}] as const;

export function Cell(ctx: LayoutContext) {

    const {
        rootMatrixWorld,
        state: { t, x, isVisited, dropzone, isCollected, trek },
        abuseBox,
    } = ctx;

    const cIndex =  Number(dropzone.world.ca.rule[1]);
    // Math.floor(t / 12) + 10;
    const colors = colorThemes[cIndex % colorThemes.length];

    const expSight = epxandedSight(trek);
    const caState = caForDropzone(dropzone)._at(t, x);

    const { visualStateMap } = expSight;
    const isGrass = caState === visualStateMap.grass;
    const isRock = caState === visualStateMap.rock;
    const isEnergy = caState === visualStateMap.energy;
    const visualKey = isGrass ? "grass" : isRock ? "rock" : "energy";
    const isAquea = colors.aqua ? true : false;

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
        if (isAquea && colors.aqua) {
            Aqua(colors.aqua, ctx);
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