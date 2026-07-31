export {
	ADD_COMPONENT_COMMAND_ID,
	registerAddComponentCommand,
	runAddComponent,
} from "./command.js";
export {
	componentDirectoryCandidates,
	describeAddComponentPlan,
	planAddComponent,
} from "./plan.js";
export type { AddComponentPlan, AddComponentRequest } from "./plan.js";
export {
	partKind,
	splitParts,
	toPascalCase,
	validateComponentName,
	validatePartNames,
} from "./names.js";
export { scaffoldFiles } from "./templates/index.js";
export type { ScaffoldFile } from "./templates/index.js";
