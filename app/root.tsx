import {
	Links,
	LinksFunction,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "remix";
import type { MetaFunction } from "remix";
import styles from "./tailwind.css";

export const links: LinksFunction = () => {
	return [{ rel: "stylesheet", href: styles }];
};

export const meta: MetaFunction = () => {
	return { title: "TournaMate" };
};

export default function App() {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<Meta />
				<Links />
				<Scripts/>
			</head>
			<body>
				<Outlet />
				{process.env.NODE_ENV === "development" && <LiveReload />}
			</body>
		</html>
	);
}
