import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { File } from './entities/file.entity';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  // @Post('upload')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: './uploads',
  //       filename: (req, file, cb) => {
  //         const filename: string = uuidv4() + '-' + file.originalname;
  //         cb(null, filename);
  //       },
  //     }),
  //   }),
  // )
  // async uploadFile(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Body() body,
  // ): Promise<File> {
  //   const fileData = {
  //     filename: file.filename,
  //     path: file.path,
  //     mimetype: file.mimetype,
  //     size: file.size,
  //     user: body.userId ? { id: body.userId } : null,
  //     post: body.postId ? { id: body.postId } : null,
  //   };
  //   return this.fileService.saveFile(fileData);
  // }
}
