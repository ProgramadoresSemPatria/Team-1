import type { Feedback } from "./feedback"

export type CsvAnalyze = {
  feedbacks: Feedback[]
  addFeedback: (feedback: Feedback) => void
  clearFeedbacks: () => void
}