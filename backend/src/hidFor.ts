import SHA256 from "crypto-js/sha256";
import Hex from "crypto-js/enc-hex";


export const hidFor = (content: string) => SHA256(content).toString(Hex);
