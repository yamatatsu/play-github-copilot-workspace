import { Authenticator } from "@aws-amplify/ui-react";
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
			<Authenticator hideSignUp>
				{({ user, signOut }) => (
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
									type: "menu-dropdown",
									text: user?.signInDetails?.loginId,
									iconName: "user-profile",
									onItemClick: (event) => {
										if (event.detail.id === "signOut") {
											signOut?.();
										}
									},
									items: [{ id: "signOut", text: "Sign out" }],
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
				)}
			</Authenticator>
		);
	},
});
