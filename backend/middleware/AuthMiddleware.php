<?php
/**
 * FocusForge Authentication Middleware
 * Checks Bearer JWT token or active PHP session
 */

require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Jwt.php';

class AuthMiddleware {
    public static function authenticate(): array {
        // Start session if not started
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        $token = null;

        // Try to get token from Authorization header
        $headers = [];
        if (function_exists('getallheaders')) {
            $headers = getallheaders();
        }
        
        $authHeader = $headers['Authorization'] 
            ?? $headers['authorization'] 
            ?? $_SERVER['HTTP_AUTHORIZATION'] 
            ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] 
            ?? '';

        if (!empty($authHeader) && preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            $token = trim($matches[1]);
        }

        if ($token) {
            $payload = Jwt::decode($token);
            if ($payload && !empty($payload['id'])) {
                $_SESSION['user_id'] = (int)$payload['id'];
                $_SESSION['user_email'] = $payload['email'] ?? '';
                return [
                    'id'    => (int)$payload['id'],
                    'email' => $payload['email'] ?? ''
                ];
            }
        }

        // Fallback: check active PHP session
        if (!empty($_SESSION['user_id'])) {
            return [
                'id'    => (int)$_SESSION['user_id'],
                'email' => $_SESSION['user_email'] ?? ''
            ];
        }

        // If demo user query parameter or fallback allowed for testing if configured
        Response::error('Unauthorized: No valid session or token provided', 401);
        exit;
    }

    public static function getOptionalUser(): ?array {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        $headers = [];
        if (function_exists('getallheaders')) {
            $headers = getallheaders();
        }
        
        $authHeader = $headers['Authorization'] 
            ?? $headers['authorization'] 
            ?? $_SERVER['HTTP_AUTHORIZATION'] 
            ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] 
            ?? '';

        if (!empty($authHeader) && preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            $payload = Jwt::decode(trim($matches[1]));
            if ($payload && !empty($payload['id'])) {
                return [
                    'id'    => (int)$payload['id'],
                    'email' => $payload['email'] ?? ''
                ];
            }
        }

        if (!empty($_SESSION['user_id'])) {
            return [
                'id'    => (int)$_SESSION['user_id'],
                'email' => $_SESSION['user_email'] ?? ''
            ];
        }

        return null;
    }
}
