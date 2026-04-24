"use client";

import { useState } from "react";
import s from "./live-code-window.module.css";

type Framework = "react" | "vue" | "solid";

type CodeMap = Partial<Record<Framework, string>>;

const LABELS: Record<Framework, string> = {
	react: "React",
	vue: "Vue",
	solid: "Solid",
};

const FILENAMES: Record<Framework, string> = {
	react: "Dropdown.tsx",
	vue: "Dropdown.vue",
	solid: "Dropdown.tsx",
};

interface LiveCodeWindowProps {
	code: CodeMap;
	/** Which frameworks are selectable; if a framework is missing from `code`, the tab is disabled */
	frameworks?: Framework[];
	defaultFramework?: Framework;
	className?: string;
	style?: React.CSSProperties;
}

export function LiveCodeWindow({
	code,
	frameworks = ["react", "vue", "solid"],
	defaultFramework = "react",
	className,
	style,
}: LiveCodeWindowProps) {
	const [active, setActive] = useState<Framework>(defaultFramework);

	const activeCode = code[active];
	const activeFile = FILENAMES[active];

	return (
		<div
			className={`${s.window} ${className ?? ""}`}
			style={style}
		>
			{/* Traffic lights + tabs + filename */}
			<div className={s.bar}>
				<span className={`${s.dot} ${s.dotRed}`} />
				<span className={`${s.dot} ${s.dotYellow}`} />
				<span className={`${s.dot} ${s.dotGreen}`} />

				<div className={s.tabs}>
					{frameworks.map((fw) => {
						const available = code[fw] !== undefined;
						const isActive = fw === active;
						return (
							<button
								key={fw}
								type="button"
								disabled={!available}
								onClick={() => available && setActive(fw)}
								className={s.tab}
								data-active={isActive || undefined}
								data-disabled={!available || undefined}
								title={
									!available
										? `${LABELS[fw]} — coming soon`
										: undefined
								}
							>
								{LABELS[fw]}
								{!available && (
									<span className={s.soon}>Soon</span>
								)}
							</button>
						);
					})}
				</div>

				<span className={s.filename}>{activeFile}</span>
			</div>

			<pre className={s.block}>
				<code>
					{activeCode ??
						`// ${LABELS[active]} support is coming soon.`}
				</code>
			</pre>
		</div>
	);
}
