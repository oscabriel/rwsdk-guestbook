import styles from "./index.css?url";

export const Document: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => (
	<html lang="en">
		<head>
			<meta charSet="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<title>rwsdk-guestbook</title>
			<link rel="preconnect" href="https://fonts.googleapis.com" />
			<link
				rel="preconnect"
				href="https://fonts.gstatic.com"
				crossOrigin="anonymous"
			/>
			<link
				href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&display=swap"
				rel="stylesheet"
			/>
			<link rel="icon" href="/favicon.svg" />
			<script>
				{`(() => {
					try {
						const theme = localStorage.getItem("app-theme") || "system";
						const root = document.documentElement;

						root.classList.remove("light", "dark");

						if (theme === "system") {
							const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
								.matches
								? "dark"
								: "light";
							root.classList.add(systemTheme);
						} else {
							root.classList.add(theme);
						}
					} catch {
						const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
							.matches
							? "dark"
							: "light";
						document.documentElement.classList.add(systemTheme);
					}
				})();`}
			</script>
			<link rel="modulepreload" href="/src/client.tsx" />
			<link rel="stylesheet" href={styles} />
		</head>
		<body>
			<div id="root">{children}</div>
			<script>import("/src/client.tsx")</script>
		</body>
	</html>
);
