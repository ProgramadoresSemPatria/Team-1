import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import type { SentimentStats } from "@/types/sentimentStats";

Chart.register(...registerables);

export function SentimentDonutChart({
	negativeCount,
	neutralCount,
	positiveCount,
	total,
}: SentimentStats) {
	const chartRef = useRef<HTMLCanvasElement>(null);
	const chartInstance = useRef<Chart | null>(null);

	useEffect(() => {
		if (!chartRef.current) return;

		if (chartInstance.current) {
			chartInstance.current.destroy();
		}

		const ctx = chartRef.current.getContext("2d");
		if (!ctx) return;

		chartInstance.current = new Chart(ctx, {
			type: "doughnut",
			data: {
				labels: ["Positive", "Neutral", "Negative"],
				datasets: [
					{
						data: [positiveCount, neutralCount, negativeCount],
						backgroundColor: [
							"rgba(34, 197, 94, 0.7)", 
							"rgba(59, 130, 246, 0.7)", 
							"rgba(239, 68, 68, 0.7)", 
						],
						borderColor: [
							"rgba(34, 197, 94, 1)",
							"rgba(59, 130, 246, 1)",
							"rgba(239, 68, 68, 1)",
						],
						borderWidth: 1,
						hoverOffset: 4,
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						position: "right",
						labels: {
							usePointStyle: true,
							padding: 20,
							font: {
								size: 12,
							},
						},
					},
					tooltip: {
						callbacks: {
							label: (context) => {
								const label = context.label || "";
								const value = context.raw as number;
								const percentage = Math.round((value / total) * 100);
								return `${label}: ${value} (${percentage}%)`;
							},
						},
					},
				},
				cutout: "60%",
			},
		});

		return () => {
			if (chartInstance.current) {
				chartInstance.current.destroy();
			}
		};
	}, [negativeCount, neutralCount, positiveCount, total]);

	return (
		<div className="w-full h-[300px] flex items-center justify-center">
			<canvas ref={chartRef} />
		</div>
	);
}
