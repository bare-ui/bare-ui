import { describe, expect, it } from "vitest";
import type { McpDetection } from "./detect.js";
import { describeMcpDetails, describeMcpStatus, mcpState } from "./status.js";

const absent: McpDetection = { installed: false, configuredIn: [] };
const installed: McpDetection = {
	installed: true,
	installedVia: "manifest",
	configuredIn: [],
};
const configured: McpDetection = {
	installed: false,
	configuredIn: [".vscode/mcp.json"],
};

describe("mcpState", () => {
	it("ranks a configured workspace above a merely installed one", () => {
		expect(mcpState(configured)).toBe("configured");
		expect(mcpState(installed)).toBe("installed");
		expect(mcpState(absent)).toBe("absent");
	});

	it("counts a workspace as configured even when nothing is installed", () => {
		// The documented setup is `npx @wire-ui/mcp` — configured, not installed.
		expect(
			mcpState({ installed: false, configuredIn: [".mcp.json"] }),
		).toBe("configured");
	});
});

describe("describeMcpStatus", () => {
	it("gives each state its own icon", () => {
		const icons = [absent, installed, configured].map(
			(detection) => describeMcpStatus(detection).text,
		);
		expect(new Set(icons).size).toBe(3);
		for (const text of icons) expect(text).toContain("Wire UI");
	});

	it("names the config file in the tooltip when configured", () => {
		expect(describeMcpStatus(configured).tooltip).toContain(
			".vscode/mcp.json",
		);
	});

	it("says what to do when installed but unconfigured", () => {
		expect(describeMcpStatus(installed).tooltip).toContain("Click");
	});
});

describe("describeMcpDetails", () => {
	it("reports both facts, always", () => {
		for (const detection of [absent, installed, configured])
			expect(describeMcpDetails(detection)).toHaveLength(2);
	});

	it("distinguishes a declared install from a bare node_modules one", () => {
		const declared = describeMcpDetails(installed).join(" ");
		const undeclared = describeMcpDetails({
			installed: true,
			installedVia: "node_modules",
			configuredIn: [],
		}).join(" ");

		expect(declared).toContain("dependency of this workspace");
		expect(undeclared).toContain("node_modules");
	});

	it("does not present an unconfigured workspace as broken", () => {
		const detail = describeMcpDetails(absent).join(" ");
		// User-scoped configs are invisible from here, so "no config" is never a
		// finding about the user's setup.
		expect(detail).toContain("user-scoped");
		expect(detail).not.toMatch(/error|missing|must/i);
	});
});
