import { describe, it } from 'vitest'
import type { FixtureMap, ParitySuite } from './types'

// Registers a suite's scenarios as vitest tests for one framework. The framework
// test file just provides its `render`-backed fixtures; everything else (the
// scenario bodies) is shared, so the three frameworks run byte-identical
// assertions. `vitest` is imported here (not passed in) because the consumer
// runs under the same vitest instance, which dedupes to one module.
export function runParitySuite<F extends string>(
	framework: string,
	suite: ParitySuite<F>,
	fixtures: FixtureMap<F>,
): void {
	describe(`${suite.component} parity [${framework}]`, () => {
		for (const scenario of suite.scenarios) {
			it(scenario.name, async () => {
				fixtures[scenario.fixture]()
				await scenario.run()
			})
		}
	})
}
