import * as ffmpeg from 'fluent-ffmpeg';
import { config, imageType } from '../config';
import { Directory } from '../helpers/directory.class';
import { assertDirectory, tempDirectory } from '../configure';

export class ImageService {
    private static size: string = config.image.size;
    private static tempDir: Directory = Directory.createDirectory(config.tempDirectory);

    public static configure(configutraion : Partial<imageType>) {
        config.animation = { ...config.animation, ...configutraion }
    }

    public static async transcode(key: string) {
        assertDirectory();
        const sourcePath = ImageService.tempDir.getFilePath(key);
        await ImageService.process(
            sourcePath,
            Directory.changeFormat(key,'png'),
            ImageService.tempDir.dir 
        );
    }

    private static process(sourcePath:string, imageName: string, destDir: string) {
        return new Promise<string>((resolv, reject) => {
            ffmpeg(sourcePath)
            .screenshots({
                timestamps: ['50%'],
                filename: imageName,
                folder: destDir,
                size: ImageService.size
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