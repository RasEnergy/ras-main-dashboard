"use client";

import { useState } from "react";
import { CalendarIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { DateRange } from "react-date-range";
import { format } from "date-fns";

interface DateRangePickerProps {
	dateRange: { from: Date; to: Date };
	onDateRangeChange: (dateRange: { from: Date; to: Date }) => void;
}

export const DateRangePicker = ({
	dateRange,
	onDateRangeChange,
}: DateRangePickerProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const handleSelect = (ranges: {
		selection: { startDate: Date; endDate: Date };
	}) => {
		onDateRangeChange({
			from: ranges.selection.startDate,
			to: ranges.selection.endDate,
		});
		setIsOpen(false);
	};

	return (
		<div className="relative">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="relative flex items-center justify-center w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
				<CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
				{format(dateRange.from, "MM/dd/yyyy")} -{" "}
				{format(dateRange.to, "MM/dd/yyyy")}
				<ChevronRightIcon className="h-5 w-5 ml-2 text-gray-400" />
			</button>
			{isOpen && (
				<div className="absolute top-full left-0 z-10 mt-2 w-full rounded-md bg-white shadow-lg">
					<DateRange
						ranges={[
							{
								startDate: dateRange.from,
								endDate: dateRange.to,
								key: "selection",
							},
						]}
						onChange={handleSelect}
						minDate={new Date()}
					/>
				</div>
			)}
		</div>
	);
};
