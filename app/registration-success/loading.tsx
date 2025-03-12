import { CheckCircle } from "lucide-react";

export default function Loading() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				<div className="shadow-xl border-t-4 border-t-green-500 overflow-hidden bg-white rounded-lg">
					<div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-center p-8 pb-16">
						<div className="flex items-center justify-center mb-4">
							<div className="bg-white rounded-full p-4 shadow-lg">
								<CheckCircle className="h-16 w-16 text-green-500" />
							</div>
						</div>
						<div className="h-8 w-48 bg-white/20 rounded-md mx-auto animate-pulse"></div>
					</div>
					<div className="pt-6 text-center -mt-6 bg-white rounded-t-3xl relative z-10 p-6">
						<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
							<div className="h-4 w-3/4 bg-gray-200 rounded-md mx-auto mb-2 animate-pulse"></div>
							<div className="h-4 w-5/6 bg-gray-200 rounded-md mx-auto mb-2 animate-pulse"></div>
							<div className="h-4 w-2/3 bg-gray-200 rounded-md mx-auto animate-pulse"></div>

							<div className="flex items-center justify-center mt-6 mb-2">
								<div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
									<div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
								</div>
							</div>
							<div className="h-3 w-1/2 bg-gray-200 rounded-md mx-auto animate-pulse"></div>
						</div>
					</div>
					<div className="flex justify-center gap-4 pt-2 pb-6 bg-white">
						<div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse"></div>
						<div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse"></div>
					</div>
				</div>
			</div>
		</div>
	);
}
