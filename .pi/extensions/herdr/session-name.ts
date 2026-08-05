import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";

const MAX_AGENT_NAME_LENGTH = 32;

/** Convert a Pi session display name to Herdr's [a-z][a-z0-9_-]{0,31} format. */
export function toHerdrAgentName(sessionName: string): string {
	const slug = sessionName
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9_-]+/g, "-")
		.replace(/^[-_]+|[-_]+$/g, "");

	const prefixed = /^[a-z]/.test(slug) ? slug : `pi-${slug || "session"}`;
	return prefixed
		.slice(0, MAX_AGENT_NAME_LENGTH)
		.replace(/[-_]+$/g, "");
}

function isHerdrTui(ctx: ExtensionContext): boolean {
	return ctx.mode === "tui" && process.env.HERDR_ENV === "1" && !!process.env.HERDR_PANE_ID;
}

function errorDetail(stdout: string, stderr: string, code: number | null): string {
	const output = (stderr || stdout).trim();
	return output || `herdr exited with code ${code ?? "unknown"}`;
}

export default function herdrSessionName(pi: ExtensionAPI) {
	async function syncName(
		sessionName: string | undefined,
		ctx: ExtensionContext,
		notifyNormalization: boolean,
	): Promise<void> {
		if (!isHerdrTui(ctx)) return;

		const paneId = process.env.HERDR_PANE_ID!;
		const herdrName = sessionName ? toHerdrAgentName(sessionName) : undefined;
		const args = herdrName
			? ["agent", "rename", paneId, herdrName]
			: ["agent", "rename", paneId, "--clear"];
		const result = await pi.exec("herdr", args, { timeout: 5000 });

		if (result.code !== 0) {
			ctx.ui.notify(`Could not sync Herdr agent name: ${errorDetail(result.stdout, result.stderr, result.code)}`, "warning");
			return;
		}

		if (notifyNormalization && sessionName && herdrName !== sessionName) {
			ctx.ui.notify(`Herdr agent name normalized to ${herdrName}`, "info");
		}
	}

	pi.on("session_start", async (_event, ctx) => {
		// Preserve a name assigned by `herdr agent start` when the Pi session is unnamed.
		const sessionName = pi.getSessionName();
		if (sessionName) await syncName(sessionName, ctx, false);
	});

	pi.on("session_info_changed", async (event, ctx) => {
		await syncName(event.name, ctx, true);
	});
}
