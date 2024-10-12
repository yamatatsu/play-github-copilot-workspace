import AppLayout from "@cloudscape-design/components/app-layout";
import SideNavigation from "@cloudscape-design/components/side-navigation";
import TopNavigation from "@cloudscape-design/components/top-navigation";
import {
	Outlet,
	createRootRoute,
	useLocation,
	useNavigate,
} from "@tanstack/react-router";

export const Route = createRootRoute({
	component: () => {
		const navigate = useNavigate();
		const { pathname } = useLocation();

		return (
			<>
				<TopNavigation
					identity={{
						href: "#",
						title: "Service Name",
						logo: {
							src: "https://via.placeholder.com/30",
							alt: "Service Logo",
						},
					}}
					utilities={[
						{
							type: "button",
							text: "Button",
							href: "#",
						},
					]}
				/>
				<AppLayout
					content={<Outlet />}
					navigation={
						<SideNavigation
							activeHref={pathname}
							onFollow={(event) => {
								event.preventDefault();
								navigate({ to: event.detail.href });
							}}
							items={[
								{ type: "link", text: "Home", href: "/home" },
								{ type: "link", text: "About", href: "/about" },
							]}
						/>
					}
				/>
			</>
		);
	},
});
