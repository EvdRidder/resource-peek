import * as vscode from 'vscode'
import { commands, Uri, Position } from "vscode"
import { ResourceDefinitionProvider } from './resource-definition-provider'
import { ResourceHoverProvider } from "./resource-hover-provider";

export function activate(context: vscode.ExtensionContext) {

    const definitionProviderRegistration = vscode.languages.registerDefinitionProvider(
        { language: 'html', pattern: '**/*.component.html' },
        new ResourceDefinitionProvider()
    );
    context.subscriptions.push(definitionProviderRegistration);

    const hoverProviderRegistration = vscode.languages.registerHoverProvider(
        { language: 'html', pattern: '**/*.component.html' },
        new ResourceHoverProvider()
    );
    context.subscriptions.push(hoverProviderRegistration);
}

export function deactivate() {
}
