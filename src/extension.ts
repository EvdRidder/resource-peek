import * as vscode from 'vscode'
import { commands, Uri, Position } from "vscode"
import { ResourceDefinitionProvider } from './resource-definition-provider'
import { ResourceHoverProvider } from "./resource-hover-provider";
import { ResourceCompletionProvider } from "./resource-completion-provider";

export function activate(context: vscode.ExtensionContext) {

    // Peek
    const definitionProviderRegistration = vscode.languages.registerDefinitionProvider(
        { language: 'html', pattern: '**/*.component.html' },
        new ResourceDefinitionProvider()
    );

    // Hover
    const hoverProviderRegistration = vscode.languages.registerHoverProvider(
        { language: 'html', pattern: '**/*.component.html' },
        new ResourceHoverProvider()
    );

    // Autocomplete
    const completionProviderRegistration = vscode.languages.registerCompletionItemProvider(
        { language: 'html', pattern: '**/*.component.html' },
        new ResourceCompletionProvider(),
        '.'
    );

    context.subscriptions.push(definitionProviderRegistration, hoverProviderRegistration, completionProviderRegistration);
}

export function deactivate() {
}
