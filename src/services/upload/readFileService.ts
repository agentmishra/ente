import { FILE_TYPE } from 'services/fileService';
import { logError } from 'utils/sentry';
import { FILE_READER_CHUNK_SIZE, MULTIPART_PART_SIZE } from './uploadService';

const TYPE_VIDEO = 'video';
const TYPE_HEIC = 'HEIC';
export const TYPE_IMAGE = 'image';
const EDITED_FILE_SUFFIX = '-edited';

export async function getFileData(reader: FileReader, file: globalThis.File) {
    if (file.size > MULTIPART_PART_SIZE) {
        return getFileStream(reader, file, FILE_READER_CHUNK_SIZE);
    } else {
        await getUint8ArrayView(reader, file);
    }
}

export function getFileType(receivedFile: globalThis.File) {
    let fileType: FILE_TYPE;
    const mimeType = receivedFile.type;
    const majorType = mimeType.split('/')[0];
    switch (majorType) {
        case TYPE_IMAGE:
            fileType = FILE_TYPE.IMAGE;
            break;
        case TYPE_VIDEO:
            fileType = FILE_TYPE.VIDEO;
            break;
        default:
            fileType = FILE_TYPE.OTHERS;
    }
    if (
        fileType === FILE_TYPE.OTHERS &&
        receivedFile.type.length === 0 &&
        receivedFile.name.endsWith(TYPE_HEIC)
    ) {
        fileType = FILE_TYPE.IMAGE;
    }
    return fileType;
}

/*
    Get the original file name for edited file to associate it to original file's metadataJSON file 
    as edited file doesn't have their own metadata file
*/
export function getFileOriginalName(file: globalThis.File) {
    let originalName: string = null;

    const isEditedFile = file.name.endsWith(EDITED_FILE_SUFFIX);
    if (isEditedFile) {
        originalName = file.name.slice(0, -1 * EDITED_FILE_SUFFIX.length);
    } else {
        originalName = file.name;
    }
    return originalName;
}

function getFileStream(
    reader: FileReader,
    file: globalThis.File,
    chunkSize: number
) {
    const fileChunkReader = fileChunkReaderMaker(reader, file, chunkSize);

    const stream = new ReadableStream<Uint8Array>({
        async pull(controller: ReadableStreamDefaultController) {
            const chunk = await fileChunkReader.next();
            if (chunk.done) {
                controller.close();
            } else {
                controller.enqueue(chunk.value);
            }
        },
    });
    const chunkCount = Math.ceil(file.size / chunkSize);
    return {
        stream,
        chunkCount,
    };
}

async function* fileChunkReaderMaker(
    reader: FileReader,
    file: globalThis.File,
    chunkSize: number
) {
    let offset = 0;
    while (offset < file.size) {
        const blob = file.slice(offset, chunkSize + offset);
        const fileChunk = await getUint8ArrayView(reader, blob);
        yield fileChunk;
        offset += chunkSize;
    }
    return null;
}

export async function getUint8ArrayView(
    reader: FileReader,
    file: Blob
): Promise<Uint8Array> {
    try {
        return await new Promise((resolve, reject) => {
            reader.onabort = () => reject(Error('file reading was aborted'));
            reader.onerror = () => reject(Error('file reading has failed'));
            reader.onload = () => {
                // Do whatever you want with the file contents
                const result =
                    typeof reader.result === 'string'
                        ? new TextEncoder().encode(reader.result)
                        : new Uint8Array(reader.result);
                resolve(result);
            };
            reader.readAsArrayBuffer(file);
        });
    } catch (e) {
        logError(e, 'error reading file to byte-array');
        throw e;
    }
}
