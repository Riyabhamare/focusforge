<?php
/**
 * FocusForge Lightweight JWT Helper
 * Generates and verifies HMAC-SHA256 JWT tokens
 */

class Jwt {
    private static string $secret = 'focusforge-super-secret-jwt-key-2026';

    public static function getSecret(): string {
    $secret = getenv('JWT_SECRET');
    if ($secret) {
        return $secret;
    }
    if (getenv('APP_ENV') === 'production') {
        throw new RuntimeException('JWT_SECRET must be set in production.');
    }
    return self::$secret; // local development fallback only
}

    private static function base64UrlEncode(string $data): string {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64UrlDecode(string $data): string {
        return base64_decode(strtr($data, '-_', '+/'));
    }

    public static function encode(array $payload, int $ttlSeconds = 604800): string {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $payload['exp'] = time() + $ttlSeconds;
        $payload['iat'] = time();

        $encodedHeader = self::base64UrlEncode($header);
        $encodedPayload = self::base64UrlEncode(json_encode($payload));

        $signature = hash_hmac('sha256', "{$encodedHeader}.{$encodedPayload}", self::getSecret(), true);
        $encodedSignature = self::base64UrlEncode($signature);

        return "{$encodedHeader}.{$encodedPayload}.{$encodedSignature}";
    }

    public static function decode(string $token): ?array {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }

        [$encodedHeader, $encodedPayload, $encodedSignature] = $parts;

        $expectedSig = self::base64UrlEncode(hash_hmac('sha256', "{$encodedHeader}.{$encodedPayload}", self::getSecret(), true));

        if (!hash_equals($expectedSig, $encodedSignature)) {
            return null;
        }

        $payload = json_decode(self::base64UrlDecode($encodedPayload), true);
        if (!is_array($payload)) {
            return null;
        }

        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return null; // Expired
        }

        return $payload;
    }
}
