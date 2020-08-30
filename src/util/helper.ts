import fs from "fs";
import path from "path";
import prettier from "prettier";
import vscode from "vscode";

import Dependency from "../model/Dependency";

export async function packageJsonExists(): Promise<boolean> {
	if (vscode.workspace.rootPath) {
		const files = await vscode.workspace.findFiles("package.json");
		if (files && files.length > 0) {
			return true;
		}
	}

	return false;
}

// TODO: write to package.json
export async function writeJsonFile(fileName: string, contents: string): Promise<void> {
	const filePath = path.join(vscode.workspace.rootPath || "", fileName);
	fs.writeFileSync(filePath, prettier.format(contents, { tabWidth: 4, parser: "json" }), "utf8");
}

export async function getPackageJson(): Promise<string> {
	const document = await vscode.workspace.openTextDocument(
		`${vscode.workspace.rootPath}/package.json`
	);
	return document.getText();
}

export function getArrayFromObject(object: Dependencies): Dependency[] {
	return Object.keys(object).map((key) => new Dependency(key, object[key] || ""));
}

export function getObjectFromArray(array: Dependency[]): Dependencies {
	const object: Dependencies = {};
	array.forEach((element: Dependency) => {
		object[element.getObject().name] = element.getObject().latestVersion;
	});
	return object;
}
