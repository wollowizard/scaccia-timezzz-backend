import * as shell from "shelljs";

shell.rm('-rf', 'dist/resources');
shell.cp('-R', 'resources/', 'dist/resources');

shell.rm('-rf', 'dist/node_modules');
shell.cp('-R', 'node_modules/', 'dist/node_modules');
