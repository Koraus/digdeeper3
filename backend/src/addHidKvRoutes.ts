import { RouterType, error } from "itty-router";
import { Env } from "./Env";


export const addHidKvRoutes = (router: RouterType) => router
    .get("/hid_kv/:hid/:ctype?", async ({ params: {
        hid, ctype,
    } }, env: Env) => {
        const value = await env.HID_KV.get(hid, { type: "stream" });
        if (value === null) {
            return error(404, `Value for \`${hid}\` not found`);
        }
        return new Response(value, {
            headers: {
                ...(ctype === "json" ? {
                    "Content-Type": "application/json",
                } : {}),
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    });
