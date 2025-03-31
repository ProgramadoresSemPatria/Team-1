import type { CsvAnalyze } from "@/types/csvAnalyze";
import { create } from "zustand";

export const useCsvAnalyzeStore = create<CsvAnalyze>((set) => ({
	feedbacks: [],
	addFeedback: (feedback) =>
		set((state) => ({
			feedbacks: [feedback, ...state.feedbacks],
		})),
	clearFeedbacks: () => set({ feedbacks: [] }),
}));
