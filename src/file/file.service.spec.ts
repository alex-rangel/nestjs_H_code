import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from './file.service';

describe('FileService', () => {
    let fileService: FileService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [FileService],
        }).compile();

        fileService = module.get<FileService>(FileService);
    });

    test('Validar a definição', () => {
        expect(fileService).toBeDefined();
    });

    describe('Teste do File Service', () => {
        test('upload method', () => {

            const photo = {
                fieldname: 'file',
                originalname: 'photo.png',
                encoding: '7bit',
                mimetype: 'image/png',
                size: 1024 * 50,
                destination: '',
                filename: 'file-name',
                path: 'file-path',
                buffer: Buffer.from('')
            } as Express.Multer.File


            const filename = 'photo-test.png';
            fileService.upload(photo, filename);    
        });


    });
});