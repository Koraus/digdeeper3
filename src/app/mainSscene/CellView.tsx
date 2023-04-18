import { ThreeElements } from "@react-three/fiber";
import { v2 } from "../../utils/v";
import { useRecoilValue } from "recoil";
import { progressionRecoil } from "../progressionRecoil";
import { worldAt } from "../../model/terms";
import { progressionProblem } from "../../model/terms";
import { caForProblem } from "../../model/terms";

export function CellView({
    sx, st, tc, xc, ...props
}: {
    st: number;
    sx: number;
    tc: number;
    xc: number;
} & ThreeElements["group"]) {
    const progression = useRecoilValue(progressionRecoil);
    const world = worldAt(progression);
    const pos = world.playerPosition;

    const problem = progressionProblem(progression);
    const emptyState = problem.emptyState;

    const pos_t = pos[1];
    const t1 = Math.floor(pos_t / tc) * tc + st;
    const t = [t1, t1 + tc, t1 - tc]
        .sort((a, b) => Math.abs(pos_t - a) - Math.abs(pos_t - b))[0];

    const x1 = Math.floor(pos[0] / xc) * xc + sx;
    const x = [x1, x1 + xc, x1 - xc]
        .sort((a, b) => Math.abs(pos[0] - a) - Math.abs(pos[0] - b))[0];

    const isInBounds = t >= 0 && x >= 0 && x < problem.spaceSize;
    if (!isInBounds) {
        return null;
    }
    const caState = caForProblem(problem)._at(t, x);
    const isEmpty = world.emptyCells.some(p => v2.eqStrict(p, [x, t]));

    return <group {...props} position={[x, -t, 0]}>
        {!isEmpty
            && caState !== emptyState
            && <mesh>
                <boxGeometry />
                <meshPhongMaterial
                    color={["#8000FF", "#404040", "#80FF00"][caState]}
                />
            </mesh>
        }
        {!isEmpty
            && caState === emptyState
            && <mesh>
                <boxGeometry />
                <meshPhongMaterial
                    color={["#8000FF", "#404040", "#80FF00"][caState]}
                    transparent
                    opacity={0.3} />
            </mesh>
        }
        {isEmpty
            && caState !== emptyState
            && <mesh position={[0, 0, -0.5]}>
                <planeGeometry />
                <meshPhongMaterial
                    color={["#8000FF", "#404040", "#80FF00"][caState]}
                    transparent
                    opacity={(isInBounds && caState !== emptyState)
                        ? (isEmpty ? 0.3 : 1)
                        : 0.3} />
            </mesh>
        }
    </group>;
}
