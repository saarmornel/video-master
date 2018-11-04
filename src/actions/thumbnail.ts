import { config, imageType } from '../config';
import { Directory } from '../helpers/directory.class';
import { assertDirectory, videosDirectory } from '../videos.directory';
import * as ffmpeg from 'fluent-ffmpeg';

export class Thumbnail {
    private static size: string = config.image.size;
    private static tempDir: Directory = videosDirectory;

    public static configure(configutraion : Partial<imageType>) {
        config.animation = { ...config.animation, ...configutraion }
    }

    public static async create(key: string) {
        assertDirectory();
        const sourcePath = Thumbnail.tempDir.getFilePath(key);
        await Thumbnail.process(
            sourcePath,
            Directory.changeFormat(key,'png'),
            Thumbnail.tempDir.dir 
        );
    }

    private static process(sourcePath:string, imageName: string, destDir: string) {
        return new Promise<string>((resolv, reject) => {
            ffmpeg(sourcePath)
            .screenshots({
                timestamps: ['50%'],
                filename: imageName,
                folder: destDir,
                size: Thumbnail.size
            })
            .on('end', function() {
                return resolv(imageName);
            })
            .on('error', function(err: Error) {
                return reject(err);
            })
        });
    }
    
}