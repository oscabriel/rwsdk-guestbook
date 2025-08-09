import fs from "node:fs";
import path from "node:path";

/**
 * Used when connecting to local SQLite db during seeding and migrations,
 * or when making queries against the db.
 * @returns Path to most recent .sqlite file in the .alchemy or .wrangler directory
 */
export function getLocalSQLiteDBPath() {
	try {
		// Check for Alchemy database first (used during dev mode)
		const alchemyPath = path.resolve(".alchemy");
		const wranglerPath = path.resolve(".wrangler");

		// Try Alchemy directory first
		let basePath = alchemyPath;
		let files: string[] = [];

		if (fs.existsSync(alchemyPath)) {
			files = fs
				.readdirSync(alchemyPath, {
					encoding: "utf-8",
					recursive: true,
				})
				.filter((fileName) => fileName.endsWith(".sqlite"));
		}

		// Fall back to Wrangler directory if no Alchemy database found
		if (!files.length && fs.existsSync(wranglerPath)) {
			basePath = wranglerPath;
			files = fs
				.readdirSync(wranglerPath, {
					encoding: "utf-8",
					recursive: true,
				})
				.filter((fileName) => fileName.endsWith(".sqlite"));
		}

		if (!files.length) {
			throw new Error(
				`No .sqlite file found at ${alchemyPath} or ${wranglerPath}`,
			);
		}

		// Retrieve most recent .sqlite file
		files.sort((a, b) => {
			const statA = fs.statSync(path.join(basePath, a));
			const statB = fs.statSync(path.join(basePath, b));

			return statB.mtime.getTime() - statA.mtime.getTime();
		});

		return path.resolve(basePath, files[0]);
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`Error resolving local D1 DB: ${error.message}`);
		}

		throw new Error("Error resolving local D1 DB");
	}
}
