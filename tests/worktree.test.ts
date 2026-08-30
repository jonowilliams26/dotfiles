import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import type { ExecOptions, ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { branchToPathSlug, chooseSplitDirection, createWorktreePane } from "../extensions/git/worktree.ts";

type Invocation = Readonly<{
	command: string;
	args: readonly string[];
	options: ExecOptions | undefined;
}>;

function layoutResponse({ paneId, height, width }: { paneId: string; height: number; width: number }): string {
	return JSON.stringify({
		result: {
			layout: {
				panes: [{ pane_id: paneId, rect: { height, width, x: 0, y: 0 } }],
			},
		},
	});
}

async function runPaneCreation({
	height,
	width,
	failAgentStart = false,
}: {
	height: number;
	width: number;
	failAgentStart?: boolean;
}): Promise<{ invocations: Invocation[]; ok: boolean }> {
	const invokingPaneId = "w1:p1";
	const createdPaneId = "w1:p2";
	const invocations: Invocation[] = [];
	const root = await mkdtemp(join(tmpdir(), "pi-worktree-test-"));
	const path = join(root, "repo", "feature-task-abc123");

	const exec: ExtensionAPI["exec"] = async (command, args, options) => {
		invocations.push({ command, args: [...args], options });
		if (command === "herdr" && args[0] === "pane" && args[1] === "layout") {
			return { stdout: layoutResponse({ paneId: invokingPaneId, height, width }), stderr: "", code: 0, killed: false };
		}
		if (command === "herdr" && args[0] === "pane" && args[1] === "split") {
			return {
				stdout: JSON.stringify({ result: { pane: { pane_id: createdPaneId } } }),
				stderr: "",
				code: 0,
				killed: false,
			};
		}
		if (command === "herdr" && args[0] === "pane" && args[1] === "run" && failAgentStart) {
			return { stdout: "", stderr: "agent failed", code: 1, killed: false };
		}
		return { stdout: "", stderr: "", code: 0, killed: false };
	};

	try {
		const result = await createWorktreePane({
			pi: { exec },
			repository: root,
			base: "origin/main",
			branch: "feature/task-abc123",
			path,
			invokingPaneId,
			agentName: "task-agent-abc123",
			herdrLabel: "Task pane",
		});
		return { invocations, ok: result.ok };
	} finally {
		await rm(root, { recursive: true, force: true });
	}
}

function commandNames(invocations: readonly Invocation[]): string[] {
	return invocations.map(({ command, args }) => [command, ...args.slice(0, 2)].join(" "));
}

test("uses Herdr's branch slug convention", () => {
	assert.equal(branchToPathSlug("feature/Add OAuth_2"), "feature-add-oauth-2");
});

test("splits wide panes right and narrow or tall panes down", () => {
	assert.equal(chooseSplitDirection({ width: 180, height: 50 }), "right");
	assert.equal(chooseSplitDirection({ width: 80, height: 50 }), "down");
	assert.equal(chooseSplitDirection({ width: 80, height: 90 }), "down");
});

test("creates one right pane, launches Pi, then focuses it without creating a workspace or tab", async () => {
	const { invocations, ok } = await runPaneCreation({ width: 180, height: 50 });
	assert.equal(ok, true);

	const worktrees = invocations.filter(({ command, args }) => command === "git" && args[0] === "worktree" && args[1] === "add");
	assert.equal(worktrees.length, 1);
	assert.deepEqual(worktrees[0]?.args.slice(0, 4), ["worktree", "add", "-b", "feature/task-abc123"]);
	assert.match(worktrees[0]?.args[4] ?? "", /feature-task-abc123$/);
	assert.equal(worktrees[0]?.args[5], "origin/main");

	const splits = invocations.filter(({ command, args }) => command === "herdr" && args[0] === "pane" && args[1] === "split");
	assert.equal(splits.length, 1);
	assert.equal(splits[0]?.args[2], "w1:p1");
	assert.equal(splits[0]?.args[4], "right");
	assert.equal(splits[0]?.args[5], "--cwd");
	assert.match(splits[0]?.args[6] ?? "", /feature-task-abc123$/);
	assert.equal(splits[0]?.args[7], "--no-focus");
	assert.equal(invocations.some(({ args }) => args.includes("workspace") || args.includes("tab")), false);

	const rename = invocations.find(({ args }) => args[0] === "pane" && args[1] === "rename");
	assert.deepEqual(rename?.args, ["pane", "rename", "w1:p2", "Task pane"]);
	const start = invocations.find(({ args }) => args[0] === "pane" && args[1] === "run");
	assert.deepEqual(start?.args, ["pane", "run", "w1:p2", "pi.cmd"]);
	const agentRename = invocations.find(({ args }) => args[0] === "agent" && args[1] === "rename");
	assert.deepEqual(agentRename?.args, ["agent", "rename", "w1:p2", "task-agent-abc123"]);
	const focus = invocations.find(({ args }) => args[0] === "agent" && args[1] === "focus");
	assert.deepEqual(focus?.args, ["agent", "focus", "task-agent-abc123"]);

	assert.deepEqual(commandNames(invocations), [
		"herdr pane layout",
		"git worktree add",
		"herdr pane split",
		"herdr pane rename",
		"herdr pane run",
		"herdr agent get",
		"herdr agent rename",
		"herdr agent focus",
	]);
});

test("creates a downward pane for a narrow invoking pane", async () => {
	const { invocations, ok } = await runPaneCreation({ width: 80, height: 50 });
	assert.equal(ok, true);
	const split = invocations.find(({ command, args }) => command === "herdr" && args[0] === "pane" && args[1] === "split");
	assert.equal(split?.args[4], "down");
});

test("does not focus or clean up resources when Pi fails to launch", async () => {
	const { invocations, ok } = await runPaneCreation({ width: 180, height: 50, failAgentStart: true });
	assert.equal(ok, false);
	assert.equal(invocations.some(({ args }) => args[0] === "agent" && args[1] === "focus"), false);
	assert.equal(invocations.some(({ args }) => args.includes("close") || args.includes("remove")), false);
	assert.deepEqual(commandNames(invocations), [
		"herdr pane layout",
		"git worktree add",
		"herdr pane split",
		"herdr pane rename",
		"herdr pane run",
	]);
});
