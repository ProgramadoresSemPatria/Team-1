export const switchSentimentForEnglish = (sentiment: string): string => {
    switch (sentiment) {
        case "positivo":
            return "Positive";
        case "neutro":
            return "Neutral";
        case "negativo":
            return "Negative";
        default:
            return sentiment;
    }
}