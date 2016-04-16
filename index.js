'use strict';
const path = require('path');
const childProcess = require('child_process');
const pify = require('pify');
const bin = path.join(__dirname, 'main');
const xprop = "xprop -id $(xprop -root 32x '\t$0' _NET_ACTIVE_WINDOW | cut -f 2)";

function parse(stdout) {
	if (process.platform === 'darwin') {
		const parts = stdout.trim().split('\n');

		return {
			title: parts[0] || null,
			id: Number(parts[1]),
			app: parts[2],
			pid: Number(parts[3])
		};
	} else if (process.platform === 'linux') {
		const result = {};
		stdout.trim().split('\n').forEach(row => {
			if (row.indexOf('=') > -1) {
				row = row.split('=');
				result[row[0].trim()] = row[1].trim();
			} else if (row.indexOf(':') > -1) {
				row = row.split(':');
				result[row[0].trim()] = row[1].trim();
			}
		});

		return {
			title: JSON.parse(result['_NET_WM_NAME(UTF8_STRING)']) || null,
			id: parseInt(result['WM_CLIENT_LEADER(WINDOW)'].split('#').pop(), 16),
			app: JSON.parse(result['WM_CLASS(STRING)'].split(',').pop()),
			pid: parseInt(result['_NET_WM_PID(CARDINAL)'], 10)
		};
	}
	throw new Error('OS X and Linux only');
}

module.exports = () => {
	if (process.platform === 'darwin') {
		return pify(childProcess.execFile)(bin).then(parse);
	} else if (process.platform === 'linux') {
		return pify(childProcess.exec)(xprop).then(parse);
	}
	return Promise.reject(new Error('OS X and Linux only'));
};

module.exports.sync = () => {
	if (process.platform === 'darwin') {
		return parse(childProcess.execFileSync(bin, {encoding: 'utf8'}));
	} else if (process.platform === 'linux') {
		return parse(childProcess.execSync(xprop, {encoding: 'utf8'}));
	}
	throw new Error('OS X and Linux only');
};
