import Filer from "filer";

const filesystem = new Filer.FileSystem();
const fs = filesystem.promises, sh = new filesystem.Shell();

sh.exists = async (path: string) => {
    try {
        await fs.stat(path);
        return true;
    } catch {
        return false;
    }
};

export { fs, sh };