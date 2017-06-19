import * as vscode from 'vscode'
import { TextDocument, Position, CancellationToken, ProviderResult, HoverProvider, Hover } from 'vscode'
import * as utils from './utils'

export class ResourceHoverProvider implements HoverProvider {

    provideHover(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<Hover> {
        const clickedKey = utils.GetKeyAtPositionInDocument(position, document);
        if (!clickedKey) {
            return null; // Returns null when no key exists.
        }

        return utils.FindObjectsForKeyInResourceFiles(clickedKey)
            .then(foundObjects => {
                if (!foundObjects) {
                    // Return null because the clicked key was not found in any resource files.
                    return null
                }

                // Return a Hover with the key's value.
                return new Hover(foundObjects[0].value);
            });
    }
}
