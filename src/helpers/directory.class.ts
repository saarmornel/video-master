import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';
import { Command, stdType } from './command.class';

// Directory Object is Presentation of Unix Directory
export class Directory {

    private constructor(private _dir: string) {
    }

    public static createDirectory(dir: string): Directory {
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        return new Directory(dir);
    }

    get dir(): string {
        return this._dir;
    }

    public getFilePath(fileName: string): string {
        return path.join(this._dir,fileName);
    }

    public static changeFormat(fileName: string,format: string): string {
        return fileName.replace(path.extname(fileName),'.'+format);
    }

    public getFormat(fileName: string): string {
        return path.extname(fileName).slice(1);
    }

    public getNameWithoutFormat(fileName: string): string {
        return fileName.split('.')[0];
    }

    public drop(): Promise<string> {
        return Command.execute(`rm -rf ${path.join(this._dir,'/*')}`);
    }

    public rm(fileName: string): Promise<string> {
        return Command.execute(`rm -rf ${path.join(this._dir, fileName)}`);
    }

    public rmAnyFormat(fileName: string): Promise<string> {
        return Command.execute(`rm -rf ${path.join(this._dir, fileName.split('.')[0]+'.*')}`);
    }

    public add(filePath: string): Promise<string> {
        return Command.execute(`cp ${filePath} ${this._dir}`);
    }

    public checkPathExist(path: string) {
        return util.promisify(fs.access)(path);
    }

    public async checkFileExist(fileName: string) {
        return this.checkPathExist(this.getFilePath(fileName));
    }




}
