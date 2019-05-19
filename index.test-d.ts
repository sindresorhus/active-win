import {expectType, expectError} from 'tsd';
import activeWin = require('.');
import { Result, LinuxResult, MacOSResult, WindowsResult } from '.';

expectType<Promise<Result | undefined>>(activeWin());

const result = activeWin.sync();

expectType<Result | undefined>(result);

if (result) {
	expectType<string>(result.platform);
	expectType<string>(result.title);
	expectType<number>(result.id);
	expectType<number>(result.bounds.x);
	expectType<number>(result.bounds.y);
	expectType<number>(result.bounds.width);
	expectType<number>(result.bounds.height);
	expectType<string>(result.owner.name);
	expectType<number>(result.owner.processId);
	expectType<string>(result.owner.path);
	expectType<number>(result.memoryUsage);
	if (result.platform === 'macos') {
		expectType<MacOSResult>(result);
		expectType<number>(result.owner.bundleId);
	} else if (result.platform === 'linux') {
		expectType<LinuxResult>(result);
		expectError(result.owner.bundleId);
	} else {
		expectType<WindowsResult>(result);
		expectError(result.owner.bundleId);
	}
}
