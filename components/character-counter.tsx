import { cn } from "@/lib/utils";

interface CharacterCounterProps {
	current: number;
	max: number;
	className?: string;
	showWarningAt?: number; // Percentage at which to show warning (0-100)
}

export function CharacterCounter({
	current,
	max,
	className,
	showWarningAt = 90,
}: CharacterCounterProps) {
	const percentage = (current / max) * 100;
	const isWarning = percentage >= showWarningAt && percentage < 100;
	const isError = percentage >= 100;

	return (
		<div className={cn("flex items-center gap-2 text-xs", className)}>
			<div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
				<div
					className={cn(
						"h-full transition-all duration-300",
						isError ? "bg-red-500" : isWarning ? "bg-amber-500" : "bg-green-500"
					)}
					style={{ width: `${Math.min(percentage, 100)}%` }}
				/>
			</div>
			<span
				className={cn(
					"tabular-nums",
					isError
						? "text-red-500"
						: isWarning
						? "text-amber-500"
						: "text-gray-500"
				)}>
				{current}/{max}
			</span>
		</div>
	);
}
