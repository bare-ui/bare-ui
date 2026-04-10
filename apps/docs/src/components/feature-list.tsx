"use client";

function CheckIcon() {
	return (
		<svg className="size-3.5" viewBox="0 0 12 12" fill="none">
			<path
				d="M2.5 6L5 8.5L9.5 3.5"
				stroke="white"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

export function FeatureList({ children }: { children: React.ReactNode }) {
	return <div className="flex flex-col gap-2.5 my-4">{children}</div>;
}

export function FeatureItem({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex items-center gap-3">
			<span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#6366f1]">
				<CheckIcon />
			</span>
			<span className="text-sm">{children}</span>
		</div>
	);
}
