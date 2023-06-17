import { RouterType, json } from "itty-router";
import { Env } from "./Env";
import { clientifyRoutedStub } from "./RoutedDurableObject";
import { hidFor } from "./hidFor";
import { Chainer } from "./Chainer";
import { keyProjectPackedTrek } from "../../src/model/terms/PackedTrek";
import { assertEvacuation } from "../../src/model/assertEvacuation";


function getChainerStub(
    name: string,
    env: Env,
) {
    const id = env.CHAINER.idFromName(name);
    const stub = env.CHAINER.get(id);
    return clientifyRoutedStub<Chainer>(stub);
}

export const addTrekRoutes = (router: RouterType) => router
    .post("/trek/", async (req, env: Env) => {
        const content = await req.json();

        const trek = keyProjectPackedTrek(content);
        assertEvacuation(trek);

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
