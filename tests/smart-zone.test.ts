import assert from "node:assert/strict";
import test from "node:test";
import type { SessionEntry } from "@earendil-works/pi-coding-agent";
import {
	CHECKPOINT_INSTRUCTIONS,
	effectiveThresholdTokens,
	formatSmartZoneProgress,
	restoreSmartZoneEnabled,
	SMART_ZONE_THRESHOLD_TOKENS,
} from "../extensions/smart-zone/index.ts";

function stateEntry({ enabled, id }: { enabled: boolean; id: string }): SessionEntry {
	return {
		type: "custom",
		id,
		parentId: null,
		timestamp: "2026-01-01T00:00:00.000Z",
		customType: "smart-zone-state",
		data: { enabled },
	};
}

test("uses the lower edge of the smart zone as the automatic threshold", () => {
	assert.equal(SMART_ZONE_THRESHOLD_TOKENS, 125_000);
	assert.equal(effectiveThresholdTokens({ contextWindow: 200_000 }), 125_000);
});

test("uses the model safety limit when it is below the smart-zone threshold", () => {
	assert.equal(effectiveThresholdTokens({ contextWindow: 128_000 }), 111_616);
});

test("formats current usage with a percentage progress bar", () => {
	assert.equal(
		formatSmartZoneProgress({ currentTokens: 55_000, thresholdTokens: 125_000 }),
		"55K/125K [████░░░░░░] 44%",
	);
	assert.equal(
		formatSmartZoneProgress({ currentTokens: 150_000, thresholdTokens: 125_000 }),
		"150K/125K [██████████] 100%",
	);
});

test("is disabled by default and restores the latest session setting", () => {
	assert.equal(restoreSmartZoneEnabled([]), false);
	assert.equal(
		restoreSmartZoneEnabled([
			stateEntry({ enabled: true, id: "enabled" }),
			stateEntry({ enabled: false, id: "disabled" }),
		]),
		false,
	);
	assert.equal(restoreSmartZoneEnabled([stateEntry({ enabled: true, id: "enabled" })]), true);
});

test("checkpoint instructions cover both provided-plan and no-plan handoffs", () => {
	assert.match(CHECKPOINT_INSTRUCTIONS, /If the user provided a plan:/);
	assert.match(CHECKPOINT_INSTRUCTIONS, /If the user did not provide a plan:/);
	assert.match(CHECKPOINT_INSTRUCTIONS, /\[x\] Completed/);
	assert.match(CHECKPOINT_INSTRUCTIONS, /immediate next action/);
	assert.match(CHECKPOINT_INSTRUCTIONS, /fresh agent/);
});
