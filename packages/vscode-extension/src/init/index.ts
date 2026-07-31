export { INIT_COMMAND_ID, registerInitCommand, runInit } from "./command.js";
export {
	declaredDependencies,
	detectPackageManager,
	frameworkPackage,
	installCommand,
	installedFrameworks,
	missingPeers,
	resolveThemePath,
} from "./detect.js";
export type { DetectedPackageManager, PackageManager } from "./detect.js";
export { describePlan, minimalManifest, planInit } from "./plan.js";
export type { InitPlan, WorkspaceSnapshot } from "./plan.js";
export { starterThemeCss, themeImportHint } from "./theme.js";
