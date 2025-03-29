import type { ModalFeedbackDetailsProps } from "@/types/modalFeedbackDetails";
import { getSentimentColor } from "@/utils/getSentimentColor";
import { switchSentimentForEnglish } from "@/utils/switchSentimentForEnglish";
import { X, ListCollapse } from "lucide-react";

const ModalFeedbackDetails: React.FC<ModalFeedbackDetailsProps> = ({
	onCloseModal,
	sentiment,
	feedback,
}) => {
	return (
		<div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
			<div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
				<div className="flex items-center justify-between p-6 border-b">
					<div className="flex items-center gap-3">
						<ListCollapse size={20} className="text-blue-500" />
						<h2 className="text-xl font-semibold text-gray-800">
							Feedback Details
						</h2>
					</div>
					<button
						type="button"
						className="text-gray-400 hover:text-gray-600 transition-colors"
						onClick={onCloseModal}
					>
						<X size={20} />
					</button>
				</div>

				<div className="p-6 overflow-y-auto max-h-[70vh]">
					<div className="space-y-6">
						<div className="bg-gray-50 p-5 rounded-xl border">
							<div className="flex flex-col gap-4">
								<div>
									<p className="text-xl font-bold text-black mb-1">Feedback:</p>
									<p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
										{feedback}
									</p>
								</div>

								<div className="flex items-center gap-2">
									<p className="text-xl font-bold text-black-500">
										Type of Sentiment:
									</p>
									<span
										className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-md font-semibold ${getSentimentColor(
											sentiment,
										)}`}
									>
										{switchSentimentForEnglish(sentiment)}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ModalFeedbackDetails;
