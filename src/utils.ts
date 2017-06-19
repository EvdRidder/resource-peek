import * as vscode from 'vscode';

/**
 * Returns the text value of a resource key at a given position in a given document. Returns null if none found.
 * @param position vscode Position
 * @param document vscode Document
 */
export function GetKeyAtPositionInDocument(position: vscode.Position, document: vscode.TextDocument) {
    const resourceRegex = new RegExp(/(\'[^\`\~\!\@\#\%\^\&\*\(\)\=\+\[\{\]\}\\\|\;\:\'\"\,\<\>\/\?\s]+\' \| translate)/g);
    const wordRange = document.getWordRangeAtPosition(position, resourceRegex);
    if (!wordRange) {
        // Return null because the item is not a resource key.
        return null;
    }
    return document.getText(wordRange).replace(/\'/g, '').replace(' | translate', '');
}

/**
 * Returns a promise for an array of objects found for a given key. Searches through .json files in src/assets.
 * @param key String value for the key to find. Ex: "resource.login.title".
 */
export function FindObjectsForKeyInResourceFiles(key: string) {
    return vscode.workspace.findFiles('**/src/assets/**/*.json')
        .then((resourceFiles) => {
            return resourceFiles.map(file => {
                return vscode.workspace.openTextDocument(vscode.Uri.file(file.fsPath))
                    .then(document => {
                        return {
                            path: file.fsPath,
                            match: checkIfKeyExistsInDocument(key, document),
                            lineNumber: getLineNumberForKeyInDocument(key, document),
                            value: getValueForKeyInDocument(key, document)
                        }
                    })
            });
        })
        .then(mappedResourceFiles => {
            return Promise.all(mappedResourceFiles)
                .then(fileObjects => {
                    return fileObjects.filter(object => object.match);
                })
        });
}

/**
 * Checks if a key exists in a given document (.json file).
 * Returns boolean.
 * 
 * @param key String value for the key to check. Ex: "resource.login.title".
 * @param document The document as vscode.TextDocument.
 */
function checkIfKeyExistsInDocument(key: string, document: vscode.TextDocument): boolean {
    return getValueForKeyInDocument(key, document) ? true : false;
}

/**
 * Get the line number of a key in a given document (.json file).
 * Returns number, or null if no match.
 * 
 * @param key String value for the key to check. Ex: "resource.login.title".
 * @param document The document as vscode.TextDocument.
 */
function getLineNumberForKeyInDocument(key: string, document: vscode.TextDocument): number {
    let value = getValueForKeyInDocument(key, document);
    if (value) {
        for (let i = 0; i < document.lineCount; i++) {
            let line = document.lineAt(i);
            if (line.text.indexOf(`"` + value + `"`) !== -1) {
                return line.lineNumber;
            }
        }
    }

    return null;
}

/**
 * Gets the value of a key in a given document (.json file).
 * 
 * @param key String value for the key to get a value for. Ex: "resource.login.title".
 * @param document The document as vscode.TextDocument.
 */
function getValueForKeyInDocument(key: string, document: vscode.TextDocument): string {
    let parsedDocument = JSON.parse(document.getText());
    return key.split(".").reduce(function (o, x) {
        return (typeof o == "undefined" || o === null) ? o : o[x];
    }, parsedDocument);
}
