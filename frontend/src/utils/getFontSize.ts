import type { WordFrequency } from "@/types/wordFrequency";

export const getFontSize = (
	frequency: number,
	wordFrequencies: WordFrequency[],
) => {
	const max = Math.max(...wordFrequencies.map((w) => w.value));
	const min = Math.min(...wordFrequencies.map((w) => w.value));
	const normalized = (frequency - min) / (max - min || 1);
	return 14 + normalized * 24;
};

// Esse arquivo teve auxílio de IA