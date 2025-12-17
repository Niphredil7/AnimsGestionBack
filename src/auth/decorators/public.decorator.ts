import { SetMetadata } from '@nestjs/common';

/**
 * Clé utilisée pour identifier les routes publiques dans les métadonnées NestJS
 * Cette constante est utilisée par le Guard pour vérifier si une route est publique
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Décorateur @Public() pour marquer une route comme publique (non protégée)
 *
 * Usage:
 * @Public()
 * @Post('login')
 * login() { ... }
 *
 * @returns Décorateur qui attache la métadonnée 'isPublic: true' à la route
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);