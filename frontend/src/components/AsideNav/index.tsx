import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Upload, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavItem {
	title: string;
	href: string;
	icon: React.ReactNode;
}

export function AsideNav() {
	const { pathname } = useLocation();

	const navItems: NavItem[] = [
		{
			title: "Upload",
			href: "/upload",
			icon: <Upload className="h-9 w-9" />,
		},
		{
			title: "Analytics",
			href: "/analytics",
			icon: <BarChart2 className="h-9 w-9" />,
		},
	];

	return (
		<nav className="flex flex-col md:w-64 border-r py-4 px-2 gap-4">
			{navItems.map((item) => (
				<Link key={item.href} to={item.href}>
					<Button
						variant={pathname === item.href ? "secondary" : "ghost"}
						className={cn(
							"w-full justify-start text-xl font-medium px-4 py-6 mb-1",
							pathname === item.href
								? "bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-900"
								: "text-black hover:bg-gray-100",
						)}
					>
						<span className="mr-3">{item.icon}</span>
						{item.title}
					</Button>
				</Link>
			))}
		</nav>
	);
}
