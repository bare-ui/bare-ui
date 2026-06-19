// A behavioral scenario is written once, framework-agnostically. It assumes a
// canonical fixture (identified by `fixture`) has already been mounted into the
// document by the framework under test, then drives and asserts on the DOM via
// @testing-library/dom queries + user-event. If the same scenario passes against
// React, Solid, and Vue, those implementations behave identically.

export interface Scenario<F extends string = string> {
	/** Human-readable test name (becomes the `it(...)` title). */
	name: string
	/** Which canonical fixture variant this scenario needs mounted. */
	fixture: F
	/** Drive + assert. The fixture is already in the document when this runs. */
	run: () => Promise<void>
}

export interface ParitySuite<F extends string = string> {
	/** Component under test, e.g. "Accordion". */
	component: string
	/** The fixture variants a framework must supply to run this suite. */
	fixtures: readonly F[]
	scenarios: Scenario<F>[]
}

/** A framework supplies one mount function per declared fixture variant. */
export type FixtureMap<F extends string> = Record<F, () => void>
