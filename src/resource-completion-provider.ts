import * as vscode from 'vscode'
import { TextDocument, Position, CancellationToken, ProviderResult, CompletionItemProvider, CompletionItem, CompletionList } from 'vscode'
import * as utils from './utils'

export class ResourceCompletionProvider implements CompletionItemProvider {

    provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<CompletionList> {
        const key = utils.GetKeyAtPositionInDocument(position, document);
        let keyWords = key.split('.');
        keyWords.pop();
        
        let completionItems = new Array<CompletionItem>();

        return vscode.workspace.findFiles('**/src/assets/**/*.json')
        .then((resourceFiles) => {
            return resourceFiles.map(file => {
                return vscode.workspace.openTextDocument(vscode.Uri.file(file.fsPath))
                    .then(document => {
                        Object.keys(getValuesForKeyWordsInDocument(keyWords, document)).forEach(function (key) {
                            completionItems.push(new CompletionItem(key, 0));
                        });
                    })
            });
        })
        .then(resourceFiles => {
            return Promise.all(resourceFiles)
                .then(_ => {
                    completionItems = removeDuplicates(completionItems);
                    const result = new CompletionList(completionItems);
                    return result;
                })
        });
    }
}

function removeDuplicates(array) {
    let seen = {};
    return array.filter(function(item) {
        let k = JSON.stringify(item);
        return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
}

function getValuesForKeyWordsInDocument(key: Array<string>, document: vscode.TextDocument): string {
    let parsedDocument = JSON.parse(document.getText());
    return key.reduce(function (o, x) {
        return (typeof o == "undefined" || o === null) ? o : o[x];
    }, parsedDocument);
}