import type { WordFrequency } from "@/types/wordFrequency";

export const getColor = (
	frequency: number,
	wordFrequencies: WordFrequency[],
) => {
	const max = Math.max(...wordFrequencies.map((w) => w.value));
	const min = Math.min(...wordFrequencies.map((w) => w.value));
	const normalized = (frequency - min) / (max - min || 1);

	const r = Math.round(59 + normalized * (34 - 59));
	const g = Math.round(130 + normalized * (197 - 130));
	const b = Math.round(246 + normalized * (94 - 246));

	return `rgb(${r}, ${g}, ${b})`;
};

// Esse arquivo teve auxílio de IA
