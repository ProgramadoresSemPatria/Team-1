"use client";

import { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import type { Feedback } from "@/types/feedback";
import { getSentimentColor } from "@/utils/getSentimentColor";
import { truncateText } from "@/utils/truncateText";
import { switchSentimentForEnglish } from "@/utils/switchSentimentForEnglish";

interface SentimentTableProps {
	data: Feedback[];
	onClickSentiment: (feedback: Feedback) => void;
}

export function SentimentTable({
	data,
	onClickSentiment,
}: SentimentTableProps) {
	const [page, setPage] = useState(1);
	const itemsPerPage = 10;
	const totalPages = Math.ceil(data.length / itemsPerPage);

	const paginatedData = data.slice(
		(page - 1) * itemsPerPage,
		page * itemsPerPage,
	);

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[50px]">#</TableHead>
						<TableHead>Feedback</TableHead>
						<TableHead className="w-[150px]">Sentiment</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{paginatedData.length > 0 ? (
						paginatedData.map((item, index) => (
							// biome-ignore lint/suspicious/noArrayIndexKey:
							<TableRow key={index} onClick={() => onClickSentiment(item)}>
								<TableCell className="font-medium">
									{(page - 1) * itemsPerPage + index + 1}
								</TableCell>
								<TableCell>{truncateText(item.Text)}</TableCell>
								<TableCell>
									<Badge
										className={getSentimentColor(item.Sentiment_Prediction)}
									>
										{switchSentimentForEnglish(item.Sentiment_Prediction)}
									</Badge>
								</TableCell>
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={3} className="text-center py-4">
								No data available
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			{totalPages > 1 && (
				<div className="p-2 border-t">
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious
									onClick={() => setPage((p) => Math.max(1, p - 1))}
									className={
										page === 1
											? "pointer-events-none opacity-50"
											: "cursor-pointer"
									}
								/>
							</PaginationItem>

							<PaginationItem>
								<span className="text-sm text-muted-foreground px-2">
									{(page - 1) * itemsPerPage + 1}–
									{Math.min(page * itemsPerPage, data.length)} of {data.length}
								</span>
							</PaginationItem>

							<PaginationItem>
								<PaginationNext
									onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
									className={
										page === totalPages
											? "pointer-events-none opacity-50"
											: "cursor-pointer"
									}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			)}
		</div>
	);
}
