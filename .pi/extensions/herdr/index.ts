import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import sessionName from "./session-name.ts";

type HerdrExtension = (pi: ExtensionAPI) => void | Promise<void>;

const extensions: HerdrExtension[] = [
	sessionName,
];

export default async function herdrExtensions(pi: ExtensionAPI): Promise<void> {
	for (const register of extensions) {
		await register(pi);
	}
}
