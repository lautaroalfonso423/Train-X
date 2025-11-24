import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private config: ConfigService) {

        const clientID = config.get<string>('GOOGLE_CLIENT_ID');
        const clientSecret = config.get<string>('GOOGLE_CLIENT_SECRET');
        const callbackURL = config.get<string>('GOOGLE_CALLBACK_URL');
    
        if (!clientID || !clientSecret || !callbackURL) {
            throw new Error('❌ Faltan variables de entorno de Google OAuth');
        }

        super({
        clientID: config.get<string>('GOOGLE_CLIENT_ID')!,
        clientSecret: config.get<string>('GOOGLE_CLIENT_SECRET')!,
        callbackURL: config.get<string>('GOOGLE_CALLBACK_URL'),
        scope: ['email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        ): Promise<any> {
            if (!profile || !profile.emails?.length) {
            throw new Error('No se recibió perfil válido de Google');
            }
        
            return {
            email: profile.emails[0].value,
            name: profile.displayName || profile.emails[0].value,
    
            };
        }
}