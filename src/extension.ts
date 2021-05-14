import * as vscode from 'vscode';
const fs = require("fs"),
	https = require('https'),
	os = require('os'),
	pathLib = require('path');

const resolvePath = (path) => {
	if (path[0] === '~') {
		const v = process.platform === 'win32' ? 'USERPROFILE' : 'HOME';
		return pathLib.join(process.env[v], path.slice(1));
	}
	else {
		return pathLib.resolve(path);
	}
};

const htmlUrlToRawUrl = (h) => {
	var r = '';
	if (h.indexOf('github.com/') == -1) {
		return r;
	}
	var tokens = h.split('github.com/');
	var rel = tokens[tokens.length - 1];
	if (rel == '') {
		return r;
	}
	tokens = rel.split('/');
	var owner = tokens[0];
	var repo = tokens[1];
	var branch = tokens[3];
	var path = rel.substring(owner.length + repo.length + branch.length + 8);
	r = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
	return r;
}

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('ghcqp.v', () => {
		var folderPath;
		var fileName;
		var cfgFolderPath = vscode.workspace.getConfiguration('githubcode').get('tmpDir');
		if (cfgFolderPath == null) {
			folderPath = os.tmpdir() + '/githubcode-preview/';
		} else {
			folderPath = cfgFolderPath;
		}
		folderPath = resolvePath(folderPath);

		if (!fs.existsSync(folderPath)) {
			fs.mkdirSync(folderPath);
		}

		vscode.window.showInputBox({ placeHolder: 'Url' }).then((htmlUrl) => {
			var rawUrl = htmlUrlToRawUrl(htmlUrl)

			var tokens = rawUrl.split('/');
			fileName = tokens[tokens.length - 1];
			if (fileName == '') {
				vscode.window.showErrorMessage('Invalid url!');
			}

			https.get(rawUrl, res => {
				let data = [];
				const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';

				res.on('data', chunk => {
					data.push(chunk);
				});

				res.on('end', () => {
					var content = Buffer.concat(data).toString();
					var filePath = folderPath + '/' + fileName;
					fs.writeFileSync(filePath, content, 'utf8');
					var openPath = vscode.Uri.file(filePath);
					vscode.workspace.openTextDocument(openPath).then(doc => {
						vscode.window.showTextDocument(doc);
					});
				});
			}).on('error', err => {
				console.log('Error: ', err.message);
			});
		});
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }