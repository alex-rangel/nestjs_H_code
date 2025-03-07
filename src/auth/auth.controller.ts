import { BadRequestException, Body, Controller, FileTypeValidator, Headers, MaxFileSizeValidator, ParseFilePipe, Post, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthLoginDto } from "./dto/auth-login.dto";
import { AuthRegisterDto } from "./dto/auth-register.dto";
import { AuthForgetDto } from "./dto/auth-forget.dto";
import { AuthResetDto } from "./dto/auth-reset.dto";
import { join } from "path";
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { FileService } from "../file/file.service";
import { AuthGuard } from "../guards/auth.guard";
import { User } from "../decorators/user.decorator";

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
        private readonly fileService: FileService
    ) { }

    @Post('login')
    async login(@Body() { email, password }: AuthLoginDto) {

        return this.authService.login(email, password);

    }

    @Post('register')
    async register(@Body() body: AuthRegisterDto) {

        return this.authService.register(body);

    }

    @Post('forget')
    async forget(@Body() { email }: AuthForgetDto) {

        return this.authService.forget(email);
    }

    @Post('reset')
    async reset(@Body() { password, token }: AuthResetDto) {

        return this.authService.reset(token, password);
    }

    @UseGuards(AuthGuard)
    @Post('me')
    async me(@User('email') user) {

        return { user };
    }

    // metodo para fazer uploade de apenas uma foto
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(AuthGuard)
    @Post('photo')
    async uploadPhoto(@User() user, @UploadedFile(

        // ParseFilePipe é um pipe que faz o parse do arquivo e valida o arquivo
        new ParseFilePipe({
            validators: [
                new FileTypeValidator({ fileType: 'image.png' }),
                new MaxFileSizeValidator({ maxSize: 1012 * 50 })
            ]
        })) photo: Express.Multer.File) {

        const path = join(__dirname, '..', '..', 'storage', 'photo', `photo-${user.id}.png`);

        try {
            await this.fileService.upload(photo, path);
        } catch (error) {
            throw new BadRequestException(error)
        }

        return { sucess: true };
    }


    // metodo para fazer upload de varias fotos
    @UseInterceptors(FilesInterceptor('files'))
    @UseGuards(AuthGuard)
    @Post('photos')
    async uploadPhotos(@User() user, @UploadedFiles() photo: Express.Multer.File[]) {
        return photo
    }


    // metodo para fazer upload de varios arquivos atraves de campos diferentes
    @UseInterceptors(FileFieldsInterceptor([{
        name: 'photo',
        maxCount: 1
    },
    {
        name: 'documents',
        maxCount: 10
    }
    ]))
    @UseGuards(AuthGuard)
    @Post('files-fields')
    async uploadFilesFields(@User() user, @UploadedFiles() files: { photo: Express.Multer.File, document: Express.Multer.File[] }) {
        return files
    }

}