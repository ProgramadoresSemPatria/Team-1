import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type CardSentimentProps = {
	count: number;
	total: number;
	percentage: number;
	sentiment: "positive" | "neutral" | "negative";
	title: string;
};

const CardSentiment: React.FC<CardSentimentProps> = ({
	count,
	total,
	percentage,
	sentiment,
	title,
}) => {
	return (
		<Card>
			<CardHeader className="">
				<CardTitle className="text-2xl font-semibold">{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<div
					className={`text-2xl font-bold ${
						sentiment === "positive"
							? "text-green-600"
							: sentiment === "neutral"
								? "text-blue-600"
								: "text-red-600"
					}`}
				>
					{percentage.toFixed(1)}%
				</div>
				<p className="text-sm text-muted-foreground">
					{count} of {total} feedbacks
				</p>
			</CardContent>
		</Card>
	);
};

export default CardSentiment;
