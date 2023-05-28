import { Env } from "./Env";
import { RoutedDurableObject } from "./RoutedDurableObject";
import { hidFor } from "./hidFor";

type Block = {
    prev?: string;
    hids: string[];
};
type OpenBlock = Block;

export class Chainer extends RoutedDurableObject {
    constructor(
        public state: DurableObjectState,
        public env: Env,
    ) {
        super();
    }

    async addHid(hid: string) {
        let openBlock =
            (await this.state.storage.get<OpenBlock>("openBlock"))
            ?? { hids: [] };

        const HIDS_PER_BLOCK = 1000;
        if (openBlock.hids.length >= HIDS_PER_BLOCK) {
            // seal block
            const openBlockStr = JSON.stringify(openBlock);
            const blockHid = hidFor(openBlockStr);
            await this.env.HID_KV.put(blockHid, openBlockStr);
            openBlock = { prev: blockHid, hids: [] };
        }

        openBlock = { ...openBlock, hids: [...openBlock.hids, hid] };
        await this.state.storage.put("openBlock", openBlock);
        return openBlock;
    }

    getOpenBlock() {
        return this.state.storage.get<OpenBlock>(
            "openBlock",
            { allowConcurrency: true });
    }
}