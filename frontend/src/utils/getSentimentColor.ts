export const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
        case "positivo":
            return "bg-green-100 text-green-800 hover:bg-green-100";
        case "neutro":
            return "bg-blue-100 text-blue-800 hover:bg-blue-100";
        case "negativo":
            return "bg-red-100 text-red-800 hover:bg-red-100";
        default:
            return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
};