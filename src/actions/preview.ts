import * as ffmpeg from 'fluent-ffmpeg';
import { config, animationType } from '../config';
import { Directory } from '../helpers/directory.class';
import { Command, stdType } from '../helpers/command.class';
import { assertDirectory, videosDirectory } from '../videos.directory';


export class Preview {
    private static size: string = config.animation.size;
    private static time: number = config.animation.time;
    private static offsetPercent: number = config.animation.offsetPercent;
    private static tempDir: Directory = videosDirectory;

    public static configure(configutraion : Partial<animationType>) {
        config.animation = { ...config.animation, ...configutraion }
    }

    public static async transcode(key: string) {
        assertDirectory();
        const [sourcePath, destPath] = [
            Preview.tempDir.getFilePath(key), 
            Preview.tempDir.getFilePath( Directory.changeFormat(key, 'gif') )
        ];
        const length = await Preview.getLength(sourcePath);
        const offset = Preview.getOffset(length)
        await Preview.createPreview(sourcePath, destPath, offset);
    }
    
    private static async getLength(sourcePath: string): Promise<number> {
        const output: string = await Command
        .execute(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${sourcePath}`);
        return +output;
    }

    private static getOffset(length: number) {
        return Math.ceil(length)*Preview.offsetPercent;
    }

    private static createPreview(sourcePath: string, destPath: string, offset: number): Promise<string> {
        return Command
        .execute(`ffmpeg -i ${sourcePath} -ss ${offset} -t ${Preview.time} -vf scale=${Preview.size} -r 10 -f image2pipe -vcodec ppm - | convert -delay 5 -loop 0 - ${destPath}`);
    }
}
