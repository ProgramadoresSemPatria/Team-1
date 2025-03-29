import type { Feedback } from "@/types/feedback"

export const calculateStats = (data: Feedback[]) => {
    const total = data.length
    const positiveCount = data.filter((item) => item.Sentiment_Prediction === "positivo").length
    const neutralCount = data.filter((item) => item.Sentiment_Prediction === "neutro").length
    const negativeCount = data.filter((item) => item.Sentiment_Prediction === "negativo").length

    return {
      total,
      positiveCount,
      neutralCount,
      negativeCount,
      positivePercentage: (positiveCount / total) * 100,
      neutralPercentage: (neutralCount / total) * 100,
      negativePercentage: (negativeCount / total) * 100,
    }
  }