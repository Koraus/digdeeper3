import { PackedTrek, keyifyPackedTrek } from "../model/terms/PackedTrek";


export async function submitTrek(trek: PackedTrek) {
    const useProdBackInDev = true;
    const backUrl = (useProdBackInDev || !import.meta.env.DEV)
        ? "https://dd3.x-pl.art/"
        : "http://127.0.0.1:8787/";

    const res = await fetch(new URL("trek", backUrl), {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: keyifyPackedTrek(trek),
    });
    if (!res.ok) {
        console.error("submitTrek", res);
        return;
    }
    const obj = await res.json();
    console.log("submitTrek", obj);
}
