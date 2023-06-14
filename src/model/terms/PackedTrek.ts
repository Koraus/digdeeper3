import { pipe } from "fp-ts/lib/function";
import * as D from "io-ts/Decoder";
import { version } from "../version";
import { DropDecoder } from "./Drop";
import { decode } from "../../utils/keyifyUtils";
import { encode, getValueAt } from "../../utils/base64Array";


const asIdGuard = <T>(fn: (x: T) => boolean) => fn as (x: T) => x is typeof x;

export const PackedTrekDecoder = pipe(
    D.struct({
        v: D.literal(version),
        drop: DropDecoder,

        // expect long treks, let trek assertion fail if data is invalid
        bytecodeLength: pipe(
            D.number,
            D.refine(
                Number.isInteger as (x: unknown) => x is number,
                "integer"),
        ),
        bytecodeBase64: D.string,
    }),
    D.refine(
        asIdGuard(({ bytecodeLength, bytecodeBase64 }) => {
            for (
                let i = bytecodeLength;
                i < bytecodeBase64.length * (6 / instructionBitStride);
                i++
            ) {
                if (getValueAt(instructionBitStride, bytecodeBase64, i) !== 0) {
                    return false;
                }
            }
            return true;
        }),
        "extra base64 bits are zeroed",
    ),
);

export type PackedTrek = D.TypeOf<typeof PackedTrekDecoder>;
export const keyProjectPackedTrek = decode(PackedTrekDecoder);
export const keyifyPackedTrek =
    (x: PackedTrek) => JSON.stringify(keyProjectPackedTrek(x));


export const namedInstructions = {
    forward: 0b000, // t++
    backward: 0b001, // t--
    left: 0b010, // x--
    right: 0b011, // x++

    knightForwardLeft: 0b100000, // t += 2, x--
    knightForwardRight: 0b100001, // t += 2, x++
    knightBackwardLeft: 0b100010, // t -= 2, x--
    knightBackwardRight: 0b100011, // t -= 2, x++
    knightLeftForward: 0b100100, // t++, x -= 2
    knightLeftBackward: 0b100101, // t--, x -= 2
    knightRightForward: 0b100110, // t++, x += 2
    knightRightBackward: 0b100111, // t--, x += 2
} as const;

type ReverseMap<T extends Record<
    keyof T,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    keyof any
>> = {
        [P in T[keyof T]]: {
            [K in keyof T]: T[K] extends P ? K : never
        }[keyof T];
    }
export const nameByInstruction = Object.fromEntries(
    Object.entries(namedInstructions)
        .map(([name, instruction]) => [instruction, name]),
) as Readonly<ReverseMap<typeof namedInstructions>>;
export type Instruction =
    typeof namedInstructions[keyof typeof namedInstructions];

export const instructionBitStride = 3;
export const createBytecodeReader = ({
    bytecodeLength,
    bytecodeBase64,
}: {
    bytecodeLength: number,
    bytecodeBase64: string,
}) => {
    let index = 0;
    return {
        isEnd() {
            return index >= bytecodeLength;
        },
        read() {
            let instruction = getValueAt(
                instructionBitStride,
                bytecodeBase64,
                index++,
            );
            if (instruction >= 0b100) {
                instruction <<= instructionBitStride;
                instruction |= getValueAt(
                    instructionBitStride,
                    bytecodeBase64,
                    index++,
                );
            }
            return instruction as Instruction;
        },
    };
};
export function* enumerateBytecode(bytecode: {
    bytecodeLength: number,
    bytecodeBase64: string,
}) {
    const reader = createBytecodeReader(bytecode);
    while (!reader.isEnd()) { yield reader.read(); }
}

export const createBytecodeWriter = () => {
    let index = 0;
    const buffer = [] as number[];
    return {
        write(instruction: Instruction) {
            if (instruction >= 0b100) {
                buffer[index++] = instruction >> instructionBitStride;
                buffer[index++] = instruction & 0b111;
            } else {
                buffer[index++] = instruction;
            }
        },
        get() {
            return {
                bytecodeLength: index,
                bytecodeBase64: encode(
                    instructionBitStride,
                    buffer,
                ),
            };
        },
    };
};
export const writeBytecode = (instructions: Iterable<Instruction>) => {
    const writer = createBytecodeWriter();
    for (const instruction of instructions) { writer.write(instruction); }
    return writer.get();
};
