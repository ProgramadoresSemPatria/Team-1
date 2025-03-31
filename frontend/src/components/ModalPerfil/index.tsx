import { Mail, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import useAuthContext from "@/hooks/useAuth";

export default function ProfileModal({
	open,
	setOpen,
}: { open: boolean; setOpen: (open: boolean) => void }) {
	const { user, logout } = useAuthContext();

	const userInitials = user?.name
		.split(" ")
		.map((name) => name[0])
		.join("")
		.toUpperCase();

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>User Perfil</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col items-center gap-4 py-4">
					<Avatar className="h-24 w-24">
						<AvatarImage
							src="/placeholder.svg?height=96&width=96"
							alt="Avatar"
						/>
						<AvatarFallback>{userInitials}</AvatarFallback>
					</Avatar>
					<div className="flex flex-col items-center">
						<h3 className="text-xl font-semibold">{user?.name}</h3>
					</div>
				</div>
				<Separator />
				<div className="space-y-4 py-4">
					<div className="flex items-center gap-3">
						<Mail className="h-4 w-4 text-muted-foreground" />
						<span>{user?.email}</span>
					</div>
				</div>
				<Separator />
				<div className="flex justify-between pt-4">
					<Button variant="destructive" size="sm" className="gap-1" onClick={logout}>
						<LogOut className="h-4 w-4" />
						<span>Sair</span>
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
