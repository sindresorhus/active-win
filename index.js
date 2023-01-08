'use strict';

module.exports = options => {
	if (process.platform === 'darwin') {
		return require('./lib/macos.js')(options);
	}

	if (process.platform === 'linux') {
		return require('./lib/linux.js')(options);
	}

	if (process.platform === 'win32') {
		return require('./lib/windows.js')(options);
	}

	return Promise.reject(new Error('macOS, Linux, and Windows only'));
};

module.exports.sync = options => {
	if (process.platform === 'darwin') {
		return require('./lib/macos.js').sync(options);
	}

	if (process.platform === 'linux') {
		return require('./lib/linux.js').sync(options);
	}

	if (process.platform === 'win32') {
		return require('./lib/windows.js').sync(options);
	}

	throw new Error('macOS, Linux, and Windows only');
};

module.exports.start = () => {
	if (process.platform === 'windows') {
		return require('./lib/windows.js').start();
	}

	throw new Error('Windows only');
}

module.exports.stop = () => {
	if (process.platform === 'windows') {
		return require('./lib/windows.js').stop();
	}

	throw new Error('Windows only');
}
