import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LogInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const now = Date.now();
        return next
            .handle()
            .pipe(
                tap(() => {
                    const request = context.switchToHttp().getRequest();

                    console.log(`url: ${request.url}`);
                    console.log(`method: ${request.method}`);
                    console.log(`duration: ${Date.now() - now}ms`);

                }),
            );
    }
}
