import type { jsx } from "@emotion/react";


export function SkillNumberPicker({
    value,
    setValue,
    min,
    max,
    format = (value) => value.toString(),
    css: cssProp,
    ...props
}: jsx.JSX.IntrinsicElements["div"] & {
    value: number;
    setValue: (value: number) => void;
    min: number;
    max: number;
    format?: (value: number) => string;
}) {
    return <div css={[{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    }, cssProp]} {...props}>
        <button
            css={{
                width: "1.5em",
            }}
            disabled={value <= min}
            onClick={() => setValue(value - 1)}
        >-</button>
        <span>{format(value)}</span>
        <button
            css={{
                width: "1.5em",
            }}
            disabled={value >= max}
            onClick={() => setValue(value + 1)}
        >+</button>
    </div>;
}
