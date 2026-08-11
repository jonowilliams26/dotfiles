import type { ExtensionAPI, ExtensionContext, SessionEntry } from "@earendil-works/pi-coding-agent";

export const SMART_ZONE_THRESHOLD_TOKENS = 125_000;
const CONTEXT_RESERVE_TOKENS = 16_384;
const STATE_ENTRY_TYPE = "smart-zone-state";
const STATUS_KEY = "smart-zone";

export const CHECKPOINT_INSTRUCTIONS = `Create a self-contained continuation checkpoint for a fresh agent. The checkpoint must make it possible to resume the task immediately after compaction without access to the discarded conversation.

First determine whether the user provided a plan for the current task.

If the user provided a plan:
- Revise that plan in place while preserving its steps, order, requirements, and important detail.
- Mark every step as [x] Completed, [~] In Progress, or [ ] Pending based only on evidence in the conversation.
- State the overall current progress, identify exactly what is underway, and identify the immediate next action.
- Keep every remaining item in execution order. Record approved changes, deviations, blockers, and reasons.

If the user did not provide a plan:
- Clearly restate the task and its goal.
- Create an ordered continuation plan with the steps needed to reach the goal.
- Mark completed work, work in progress, the immediate next action, and all remaining work.

In either case:
- Distinguish completed, in-progress, blocked, and pending work; do not infer completion without evidence.
- Preserve constraints, preferences, decisions and rationale, exact file paths, commands, function or type names, validation results, and error messages needed to continue.
- Include unresolved questions, risks, and any other context a fresh agent would need.
- Make the first next step continue the current in-progress item, then list remaining items in order.
- Prefer concise, concrete facts over a narrative recap.`;

type SmartZoneState = Readonly<{
	enabled: boolean;
}>;

function isSmartZoneState(value: unknown): value is SmartZoneState {
	return typeof value === "object" && value !== null && "enabled" in value && typeof value.enabled === "boolean";
}

export function restoreSmartZoneEnabled(entries: readonly SessionEntry[]): boolean {
	let enabled = false;

	for (const entry of entries) {
		if (entry.type === "custom" && entry.customType === STATE_ENTRY_TYPE && isSmartZoneState(entry.data)) {
			enabled = entry.data.enabled;
		}
	}

	return enabled;
}

export function effectiveThresholdTokens({ contextWindow }: { contextWindow: number }): number {
	const modelSafeThreshold = Math.max(1, contextWindow - CONTEXT_RESERVE_TOKENS);
	return Math.min(SMART_ZONE_THRESHOLD_TOKENS, modelSafeThreshold);
}

function formatTokenCount(tokens: number): string {
	return `${Math.round(tokens / 1_000)}K`;
}

export function formatSmartZoneProgress({
	currentTokens,
	thresholdTokens,
	barWidth = 10,
}: {
	currentTokens: number;
	thresholdTokens: number;
	barWidth?: number;
}): string {
	const progress = Math.max(0, Math.min(1, currentTokens / thresholdTokens));
	const filledSegments = Math.round(progress * barWidth);
	const bar = `${"█".repeat(filledSegments)}${"░".repeat(barWidth - filledSegments)}`;
	return `${formatTokenCount(currentTokens)}/${formatTokenCount(thresholdTokens)} [${bar}] ${Math.round(progress * 100)}%`;
}

export default function smartZone(pi: ExtensionAPI): void {
	let enabled = false;
	let compactionInFlight = false;

	function notify(ctx: ExtensionContext, message: string, level: "info" | "warning" | "error"): void {
		if (ctx.hasUI) {
			ctx.ui.notify(message, level);
		}
	}

	function updateStatus(ctx: ExtensionContext): void {
		if (!enabled) {
			ctx.ui.setStatus(STATUS_KEY, undefined);
			return;
		}

		const usage = ctx.getContextUsage();
		if (!usage || usage.tokens === null) {
			ctx.ui.setStatus(STATUS_KEY, `smart-zone: ?/${formatTokenCount(SMART_ZONE_THRESHOLD_TOKENS)} [░░░░░░░░░░] --%`);
			return;
		}

		const thresholdTokens = effectiveThresholdTokens({ contextWindow: usage.contextWindow });
		ctx.ui.setStatus(
			STATUS_KEY,
			`smart-zone: ${formatSmartZoneProgress({ currentTokens: usage.tokens, thresholdTokens })}`,
		);
	}

	function persistState(): void {
		pi.appendEntry(STATE_ENTRY_TYPE, { enabled } satisfies SmartZoneState);
	}

	function triggerCompaction({
		ctx,
		currentTokens,
		resumeAfterCompaction,
	}: {
		ctx: ExtensionContext;
		currentTokens: number;
		resumeAfterCompaction: boolean;
	}): void {
		if (compactionInFlight) {
			return;
		}

		compactionInFlight = true;
		notify(ctx, `Smart Zone: compacting at ${formatTokenCount(currentTokens)} tokens`, "info");

		ctx.compact({
			customInstructions: CHECKPOINT_INSTRUCTIONS,
			onComplete: () => {
				compactionInFlight = false;
				notify(ctx, "Smart Zone: compaction complete", "info");
				updateStatus(ctx);

				if (enabled && resumeAfterCompaction) {
					pi.sendMessage(
						{
							customType: "smart-zone-continuation",
							content:
								"Continue the work that was underway immediately before automatic context compaction. Use the continuation checkpoint as authoritative context, resume the in-progress item first, and then proceed through the remaining plan.",
							display: false,
						},
						{ deliverAs: "followUp", triggerTurn: true },
					);
				}
			},
			onError: (error) => {
				compactionInFlight = false;
				notify(ctx, `Smart Zone: compaction failed: ${error.message}`, "error");
				updateStatus(ctx);
			},
		});
	}

	function compactIfNeeded({
		ctx,
		resumeAfterCompaction,
	}: {
		ctx: ExtensionContext;
		resumeAfterCompaction: boolean;
	}): void {
		if (!enabled || compactionInFlight) {
			return;
		}

		const usage = ctx.getContextUsage();
		if (!usage || usage.tokens === null) {
			return;
		}

		const thresholdTokens = effectiveThresholdTokens({ contextWindow: usage.contextWindow });
		if (usage.tokens < thresholdTokens) {
			return;
		}

		triggerCompaction({ ctx, currentTokens: usage.tokens, resumeAfterCompaction });
	}

	function setEnabled({ ctx, value }: { ctx: ExtensionContext; value: boolean }): void {
		if (enabled === value) {
			notify(ctx, `Smart Zone is already ${enabled ? "enabled" : "disabled"}`, "info");
			updateStatus(ctx);
			return;
		}

		enabled = value;
		persistState();
		updateStatus(ctx);
		notify(ctx, `Smart Zone ${enabled ? "enabled" : "disabled"}`, "info");

		if (enabled) {
			compactIfNeeded({ ctx, resumeAfterCompaction: false });
		}
	}

	pi.on("session_start", (_event, ctx) => {
		enabled = restoreSmartZoneEnabled(ctx.sessionManager.getBranch());
		compactionInFlight = false;
		updateStatus(ctx);
	});

	pi.on("turn_end", (event, ctx) => {
		updateStatus(ctx);
		compactIfNeeded({
			ctx,
			resumeAfterCompaction: event.toolResults.length > 0 && !ctx.hasPendingMessages(),
		});
	});

	pi.on("session_compact", (_event, ctx) => {
		compactionInFlight = false;
		updateStatus(ctx);
	});

	pi.on("session_shutdown", (_event, ctx) => {
		ctx.ui.setStatus(STATUS_KEY, undefined);
	});

	pi.registerCommand("smart-zone", {
		description: "Toggle Smart Zone automatic compaction, or use on, off, or status",
		handler: async (args, ctx) => {
			const action = args.trim().toLowerCase();

			if (action === "" || action === "toggle") {
				setEnabled({ ctx, value: !enabled });
				return;
			}
			if (action === "on" || action === "enable") {
				setEnabled({ ctx, value: true });
				return;
			}
			if (action === "off" || action === "disable") {
				setEnabled({ ctx, value: false });
				return;
			}
			if (action !== "status") {
				notify(ctx, "Usage: /smart-zone [on|off|status]", "warning");
				return;
			}

			const usage = ctx.getContextUsage();
			if (!usage || usage.tokens === null) {
				notify(
					ctx,
					`Smart Zone is ${enabled ? "enabled" : "disabled"}; current context usage is not available yet`,
					"info",
				);
				return;
			}

			const thresholdTokens = effectiveThresholdTokens({ contextWindow: usage.contextWindow });
			notify(
				ctx,
				`Smart Zone is ${enabled ? "enabled" : "disabled"}: ${formatSmartZoneProgress({ currentTokens: usage.tokens, thresholdTokens })}`,
				"info",
			);
		},
	});
}
