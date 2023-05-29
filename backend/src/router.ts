import { Router, error, json, status } from "itty-router";
import { Env } from "./Env";
import { _throw } from "../../src/utils/_throw";
import { clientifyRoutedStub } from "./RoutedDurableObject";
import { hidFor } from "./hidFor";
import { Chainer } from "./Chainer";
import { PackedTrek, keyProjectPackedTrek } from "../../src/model/terms/PackedTrek";


const assertEvacuated = (_trek: PackedTrek) => {
    throw new Error("Not implemented");
};

function getChainerStub(
    name: string,
    env: Env,
) {
    const id = env.CHAINER.idFromName(name);
    const stub = env.CHAINER.get(id);
    return clientifyRoutedStub<Chainer>(stub);
}

export const router = Router();

router
    .options("*", () => status(204))
    .get("/hid_kv/:hid/:ctype?", async ({ params: {
        hid, ctype,
    } }, env: Env) => {
        const value = await env.HID_KV.get(hid, { type: "stream" });
        if (value === null) {
            return error(404, `Value for \`${hid}\` not found`);
        }
        return new Response(value, {
            ...(ctype === "json" ? {
                headers: { "Content-Type": "application/json" },
            } : {}),
        });
    })
    .post("/trek/", async (req, env: Env) => {
        const content = await req.json();

        const trek = keyProjectPackedTrek(content);
        assertEvacuated(trek);

        const trekStr = JSON.stringify(trek);
        const hid = hidFor(trekStr);
        await env.HID_KV.put(hid, trekStr);
        const openBlock = await getChainerStub("trek", env).addHid(hid);
        return json({ hid, openBlock });
    })
    .get("/trek/openBlock/", async (req, env: Env) => {
        const openBlock = await getChainerStub("trek", env).getOpenBlock();
        return json(openBlock);
    });