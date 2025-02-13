import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class UseIdCheckMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {

        console.log('UseIdCheckMiddleware', 'antes');

        if (isNaN(Number(req.params.id)) || Number(req.params.id) <= 0) {
            throw new BadRequestException('ID inválido!!')
        }

        console.log('UseIdCheckMiddleware', 'depois');

        next();

    }
}