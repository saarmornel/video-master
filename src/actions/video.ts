import { config, videoType } from '../config';
import { Directory } from '../helpers/directory.class';
import { assertDirectory, tempDirectory } from '../configure';
import * as ffmpeg from 'fluent-ffmpeg';

export class Video {
    private static audioCodec: string = config.video.audioCodec;
    private static videoCodec: string = config.video.videoCodec;
    private static format: string = config.video.format;
    private static tempDir: Directory = tempDirectory;

    public static configure(configutraion : Partial<videoType>) {
        config.video = { ...config.video, ...configutraion }
    }

    public static async transcode(key: string) {
        assertDirectory();
        if(Directory.getFormat(key) === 'mp4') return;
        const sourcePath = this.tempDir.getFilePath(key);
        await Video.process(
            key,
            sourcePath,
            Video.tempDir.getFilePath( Directory.changeFormat(key, this.format) )
        );
    }

    private static process(key:string, sourcePath:string, destPath:string) {
        return new Promise<string>((resolv, reject) => {
            ffmpeg(sourcePath)
            .audioCodec(this.audioCodec)
            .videoCodec(this.videoCodec) 
            .format(this.format)
            .save(destPath)
            .on('end', function() {
                return resolv(key);
            })
            .on('error', function(err: Error) {
                // console.error(`ffmpeg error: ${err.message}`);
                return reject(err);
            })
        });  
    }
}