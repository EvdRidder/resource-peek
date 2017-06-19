import * as vscode from 'vscode'
import { TextDocument, Uri, Position, CancellationToken, Location, ProviderResult, DefinitionProvider } from 'vscode'
import * as utils from './utils'

export class ResourceDefinitionProvider implements DefinitionProvider {

    provideDefinition(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<Location[]> {
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

                // Return a location per match.
                let locations = new Array<Location>();
                foundObjects.forEach(object => {
                    locations.push(new Location(Uri.file(object.path), new Position(object.lineNumber, 0)));
                });

                return locations;
            });
    }
}
