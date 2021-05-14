# GitHub Code Quick Preview

A simple extension to preview a GitHub hosted code file easily in VS Code.

## Quick Start

Open the Command Palette(Ctrl+Shift+P or F1 by default), choose "Preview GitHub Code" and enter GitHub file url in the input field, VS Code will download the file and open it in current window.

File url example:
https://github.com/microsoft/vscode-extension-samples/blob/main/helloworld-sample/src/extension.ts

## Settings
System temporary directory is used to save temporary file by default, and the following setting is used:

`{ "githubcode.tmpDir": "path\to\temp\directory" }`
