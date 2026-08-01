// `Wire UI: Open Playground` — a stub, on purpose.
//
// The command exports the current selection to playground.wire-ui.com. That
// site is 0.6 and does not exist yet; neither does the thing this command would
// have to produce — 0.6 specifies "URL-encoded share links (LZ-string
// compressed)", and the encoding, the template set and the framework parameter
// are all decided over there. Guessing at them here would mean writing an
// exporter against an imaginary contract and shipping links that 404.
//
// So the command registers, is discoverable, and says plainly that it is not
// live yet. When 0.6 lands: read the selection (or the whole document when the
// selection is empty), build the share URL from the real encoding, and open it
// with `vscode.env.openExternal`.
//
// Before publishing (Day 20) this must either be implemented or removed from
// `contributes.commands` — a palette entry that only ever apologises is worse
// than no entry.

import * as vscode from "vscode";

export const OPEN_PLAYGROUND_COMMAND_ID = "wire-ui.openPlayground";

export const PLAYGROUND_URL = "https://playground.wire-ui.com";

const UNAVAILABLE_MESSAGE =
	"Wire UI: the playground isn't live yet — Open Playground starts working when playground.wire-ui.com ships (0.6). Nothing was exported.";

/** Registers the command; the returned disposable unregisters it. */
export function registerOpenPlaygroundCommand(
	output: vscode.OutputChannel,
): vscode.Disposable {
	return vscode.commands.registerCommand(OPEN_PLAYGROUND_COMMAND_ID, () =>
		runOpenPlayground(output),
	);
}

export async function runOpenPlayground(
	output: vscode.OutputChannel,
): Promise<void> {
	output.appendLine(
		`Open Playground: ${PLAYGROUND_URL} is not live yet (ships with 0.6); nothing exported.`,
	);
	void vscode.window.showInformationMessage(UNAVAILABLE_MESSAGE);
}
