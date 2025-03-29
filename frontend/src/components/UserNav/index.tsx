import { LogOut, User } from "lucide-react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserNav() {
	const userName = "Gabriel Melo";

	const userInitials = userName
		.split(" ")
		.map((name) => name[0])
		.join("")
		.toUpperCase();

	const email = "biel@biel.com";

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="flex items-center gap-2 hover:bg-accent hover:text-accent-foreground rounded-full p-1"
				>
					<Avatar className="h-12 w-12">
						<AvatarImage src="/placeholder.svg" alt="@user" />
						<AvatarFallback>{userInitials}</AvatarFallback>
					</Avatar>
					<span className="hidden md:inline-flex text-lg font-medium">
						{userName}
					</span>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-lg font-medium leading-none">{userName}</p>
						<p className="text-md leading-none text-muted-foreground">
							{email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<User className="mr-2 h-8 w-8" />
						<span>Perfil</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<LogOut className="mr-2 h-8 w-8" />
					<span>Sair</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
