import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CardTotalAnalyzes = ({ total }: { total: number }) => {
	return (
		<Card>
			<CardHeader className="">
				<CardTitle className="text-2xl font-semibold">Feedbacks Analyzed</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{total}</div>
			</CardContent>
		</Card>
	);
};

export default CardTotalAnalyzes;
