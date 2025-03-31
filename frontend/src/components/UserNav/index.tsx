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
import useAuthContext from "@/hooks/useAuth";
import ProfileModal from "../ModalPerfil";
import { useState } from "react";

export function UserNav() {
	const { user, logout } = useAuthContext();
	const [isPerfilModalOpen, setIsPerfilModalOpen] = useState(false);

	const userInitials = user?.name
		.split(" ")
		.map((name) => name[0])
		.join("")
		.toUpperCase();

	return (
		
		<DropdownMenu>
			{isPerfilModalOpen && (
				<ProfileModal open={isPerfilModalOpen} setOpen={setIsPerfilModalOpen} />
			)}
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
						{user?.name}
					</span>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-lg font-medium leading-none">{user?.name}</p>
						<p className="text-md leading-none text-muted-foreground">
							{user?.email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem onClick={() => setIsPerfilModalOpen(true)}>
						<User className="mr-2 h-8 w-8" />
						<span>Perfil</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => logout()}>
					<LogOut className="mr-2 h-8 w-8" />
					<span>Sair</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
