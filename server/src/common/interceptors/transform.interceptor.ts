import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
    constructor(private reflector: Reflector) {}
    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        const response = context.switchToHttp().getResponse();
        const handler = context.getHandler();
        if (this.reflector.get('isFreeResponse', handler)) return next.handle();
        return next.handle().pipe(
            map((data) => {
                return {
                    status: response.statusCode,
                    ...(typeof data !== 'object' || Array.isArray(data)
                        ? { data }
                        : data),
                    success: true,
                };
            }),
        );
    }
}
