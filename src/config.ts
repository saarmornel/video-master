import * as path from 'path';
export type ConfigType = {
    tempDirectory: string;
    animation: animationType;
    image: imageType;
    video: videoType;
}

export type animationType = {
    size: string;
    offsetPercent: number;
    time: number;
}

export type imageType = {
    size: string;
}

export type videoType = {
    videoCodec: string;
    audioCodec: string;
    format: string;
}

export const config: ConfigType = {
    tempDirectory: path.join(process.cwd(),'videos'),
    animation: {
        size: '320x180',
        offsetPercent: 0.3,
        time: 3,
    },
    image: {
        size: '320x180'
    },
    video: {
        videoCodec: 'aac',
        audioCodec: 'libx264',
        format: 'mp4',
    },
}
