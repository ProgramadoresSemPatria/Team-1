import { useCsvAnalyzeStore } from "@/store/useCsvAnalyzeStore";
import type { WordFrequency } from "@/types/wordFrequency";
import { getColor } from "@/utils/getColor";
import { getFontSize } from "@/utils/getFontSize";
import { useEffect, useRef, useState } from "react";

export function WordCloud() {
	const [wordFrequencies, setWordFrequencies] = useState<WordFrequency[]>([]);
	const containerRef = useRef<HTMLDivElement>(null);

	const { feedbacks } = useCsvAnalyzeStore();

	useEffect(() => {
		//Esse useEffect teve ajuda de IA
		const stopWords = new Set([
			"a",
			"an",
			"the",
			"and",
			"or",
			"but",
			"is",
			"are",
			"was",
			"were",
			"be",
			"been",
			"being",
			"in",
			"on",
			"at",
			"to",
			"for",
			"with",
			"by",
			"about",
			"against",
			"between",
			"into",
			"through",
			"during",
			"before",
			"after",
			"above",
			"below",
			"from",
			"up",
			"down",
			"of",
			"off",
			"over",
			"under",
			"again",
			"further",
			"then",
			"once",
			"here",
			"there",
			"when",
			"where",
			"why",
			"how",
			"all",
			"any",
			"both",
			"each",
			"few",
			"more",
			"most",
			"other",
			"some",
			"such",
			"no",
			"nor",
			"not",
			"only",
			"own",
			"same",
			"so",
			"than",
			"too",
			"very",
			"s",
			"t",
			"can",
			"will",
			"just",
			"don",
			"dont",
			"should",
			"now",
			"im",
			"ive",
			"id",
			"youre",
			"youve",
			"youll",
			"hes",
			"shes",
			"its",
			"theyre",
			"weve",
			"theyve",
			"would",
			"could",
			"must",
			"one",
			"two",
			"three",
		]);

		const allText = feedbacks
			.map((f) => f.Text)
			.join(" ")
			.toLowerCase();
		const allWords = allText.split(/\s+/);

		const wordCount: Record<string, number> = {};

		// biome-ignore lint/complexity/noForEach: <explanation>
		allWords.forEach((word) => {
			const cleanWord = word.replace(/[^a-z]/g, "");
			if (cleanWord.length >= 3 && !stopWords.has(cleanWord)) {
				wordCount[cleanWord] = (wordCount[cleanWord] || 0) + 1;
			}
		});

		const wordFreqArray: WordFrequency[] = Object.entries(wordCount)
			.map(([word, value]) => ({ word, value }))
			.sort((a, b) => b.value - a.value)
			.slice(0, 30);

		setWordFrequencies(wordFreqArray);
	}, [feedbacks]);

	return (
		<div
			ref={containerRef}
			className="w-full h-[300px] flex flex-wrap justify-center items-center gap-3 p-4"
		>
			{wordFrequencies.length > 0 ? (
				wordFrequencies.map((word) => (
					<span
						key={word.word}
						className="inline-block px-2 py-1 rounded transition-all duration-200 hover:scale-110"
						style={{
							fontSize: `${getFontSize(word.value, wordFrequencies)}px`,
							color: getColor(word.value, wordFrequencies),
							fontWeight:
								word.value > wordFrequencies[0].value / 2 ? "bold" : "normal",
						}}
					>
						{word.word}
					</span>
				))
			) : (
				<div className="text-muted-foreground">Processando palavras...</div>
			)}
		</div>
	);
}
