import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";

const TARGET_THRESHOLD_TOKENS = 125_000;
const THRESHOLD_TOLERANCE = 0.1;
const MIN_THRESHOLD_TOKENS = TARGET_THRESHOLD_TOKENS * (1 - THRESHOLD_TOLERANCE);
const MAX_THRESHOLD_TOKENS = TARGET_THRESHOLD_TOKENS * (1 + THRESHOLD_TOLERANCE);
const CONTEXT_RESERVE_TOKENS = 16_384;

const CHECKPOINT_INSTRUCTIONS = `Make the checkpoint suitable for immediately continuing the work after compaction.
- In ## Goal, explicitly restate the original goal of the requested work rather than only the latest action.
- At the start of ## Progress, state the overall current state.
- In ### Done, list everything completed.
- In ### In Progress, identify exactly what is currently underway.
- In ## Next Steps, include everything still pending in execution order.
- If the user approved an implementation plan and the work is following it, use that plan as the backbone of the checkpoint. Preserve its steps and order instead of replacing it with a generic summary.
- Record the approved plan under an ### Approved Plan subsection of ## Critical Context. Mark every step as [x] Completed, [~] In Progress, or [ ] Pending based only on evidence in the conversation. Preserve important details from each step and note any approved changes or deviations.
- Align ### Done, ### In Progress, and ## Next Steps with the plan statuses. The first next step should continue the in-progress plan item, followed by the remaining pending items in plan order.
- Preserve constraints, blockers, decisions, exact file paths, commands, function names, and error messages needed to resume without the discarded context.`;

function selectThresholdTokens({ random = Math.random }: { random?: () => number } = {}): number {
	const sample = Math.max(0, Math.min(1, random()));
	return Math.round(MIN_THRESHOLD_TOKENS + sample * (MAX_THRESHOLD_TOKENS - MIN_THRESHOLD_TOKENS));
}

function effectiveThresholdTokens({
	selectedThresholdTokens,
	contextWindow,
}: {
	selectedThresholdTokens: number;
	contextWindow: number;
}): number {
	const modelSafeThreshold = Math.max(1, contextWindow - CONTEXT_RESERVE_TOKENS);
	return Math.min(selectedThresholdTokens, modelSafeThreshold);
}

function formatTokenCount(tokens: number): string {
	return `${Math.round(tokens / 1_000)}K`;
}

export default function dumbZone(pi: ExtensionAPI): void {
	let selectedThresholdTokens = selectThresholdTokens();
	let compactionInFlight = false;

	function notify(ctx: ExtensionContext, message: string, level: "info" | "warning" | "error"): void {
		if (ctx.hasUI) {
			ctx.ui.notify(message, level);
		}
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
		compactionInFlight = true;
		notify(ctx, `Dumb Zone: compacting at ${formatTokenCount(currentTokens)} tokens`, "info");

		ctx.compact({
			customInstructions: CHECKPOINT_INSTRUCTIONS,
			onComplete: () => {
				notify(ctx, "Dumb Zone: compaction complete", "info");

				if (resumeAfterCompaction) {
					pi.sendMessage(
						{
							customType: "dumb-zone-continuation",
							content:
								"Continue the work that was in progress immediately before automatic context compaction. Use the checkpoint summary as authoritative context.",
							display: false,
						},
						{ deliverAs: "followUp", triggerTurn: true },
					);
				}
			},
			onError: (error) => {
				compactionInFlight = false;
				notify(ctx, `Dumb Zone: compaction failed: ${error.message}`, "error");
			},
		});
	}

	pi.on("session_start", () => {
		selectedThresholdTokens = selectThresholdTokens();
		compactionInFlight = false;
	});

	pi.on("turn_end", (event, ctx) => {
		if (compactionInFlight) {
			return;
		}

		const usage = ctx.getContextUsage();
		if (!usage || usage.tokens === null) {
			return;
		}

		const thresholdTokens = effectiveThresholdTokens({
			selectedThresholdTokens,
			contextWindow: usage.contextWindow,
		});
		if (usage.tokens < thresholdTokens) {
			return;
		}

		triggerCompaction({
			ctx,
			currentTokens: usage.tokens,
			resumeAfterCompaction: event.toolResults.length > 0 && !ctx.hasPendingMessages(),
		});
	});

	pi.on("session_compact", () => {
		selectedThresholdTokens = selectThresholdTokens();
		compactionInFlight = false;
	});

	pi.registerCommand("dumb-zone", {
		description: "Show Dumb Zone context usage and the next compaction threshold",
		handler: async (_args, ctx) => {
			const usage = ctx.getContextUsage();
			if (!usage || usage.tokens === null) {
				notify(
					ctx,
					`Dumb Zone: next threshold ${formatTokenCount(selectedThresholdTokens)} tokens; current usage is not available yet`,
					"warning",
				);
				return;
			}

			const thresholdTokens = effectiveThresholdTokens({
				selectedThresholdTokens,
				contextWindow: usage.contextWindow,
			});
			notify(
				ctx,
				`Dumb Zone: ${formatTokenCount(usage.tokens)} / ${formatTokenCount(thresholdTokens)} tokens`,
				"info",
			);
		},
	});
}
