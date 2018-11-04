import { config } from './config';
import { Directory } from './helpers/directory.class';

export let videosDirectory: Directory;

export function configure(dir: string) {
    config.videosDirectory = dir;
}

export function getDirectory() {
    assertDirectory();
    return videosDirectory;
}

export function assertDirectory() {
    if(!videosDirectory) 
    videosDirectory = Directory.createDirectory(config.videosDirectory);
}