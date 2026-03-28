<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    private const SUPPORTED = ['ar', 'en'];
    private const DEFAULT   = 'ar';
    private const COOKIE    = 'locale';
    private const LIFETIME  = 60 * 24 * 365; // سنة كاملة

    public function handle(Request $request, Closure $next): Response
    {
        $locale = $this->resolveLocale($request);
        app()->setLocale($locale);

        $response = $next($request);

        // ✅ نحفظ في Cookie فقط للـ Web (ليس API)
        if (! $request->is('api/*') && $request->cookie(self::COOKIE) !== $locale) {
            $response->cookie(self::COOKIE, $locale, self::LIFETIME, '/', null, false, false);
        }

        return $response;
    }

    private function resolveLocale(Request $request): string
    {
        // ترتيب الأولوية:
        // API:  1. Accept-Language Header  2. Default
        // Web:  1. Cookie  2. Default

        $locale = $request->is('api/*')
            ? $request->header('Accept-Language')
            : $request->cookie(self::COOKIE);

        return in_array($locale, self::SUPPORTED) ? $locale : self::DEFAULT;
    }
}
