import { config } from './config';
import { Directory } from './helpers/directory.class';

export let tempDirectory: Directory;

export function configure(dir: string) {
    config.tempDirectory = dir;
}

export function assertDirectory() {
    if(!tempDirectory) 
    tempDirectory = Directory.createDirectory(config.tempDirectory);
}