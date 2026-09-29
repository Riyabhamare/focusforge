<?php
/**
 * FocusForge API Response & CORS Utility
 */

class Response {
    public static function initCors(): void {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
        
        // Allowed origins: allow local Vite dev server, localhost, or any local origin
        if (preg_match('/^https?:\/\/(localhost|127\.0\.0\.1)(:[0-9]+)?$/', $origin)) {
            header("Access-Control-Allow-Origin: {$origin}");
        } else {
            header("Access-Control-Allow-Origin: *");
        }

        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept");
        header("Content-Type: application/json; charset=UTF-8");

        // Handle preflight OPTIONS request immediately
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit;
        }
    }

    public static function json(array $data, int $statusCode = 200): void {
        self::initCors();
        http_response_code($statusCode);
        echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        exit;
    }

    public static function success(mixed $data = null, ?string $message = null, int $statusCode = 200): void {
        $payload = ['success' => true];
        if ($message !== null) {
            $payload['message'] = $message;
        }
        if (is_array($data)) {
            // Merge top-level data fields so frontend can access res.data.tasks, res.data.user, etc. directly
            $payload = array_merge($payload, $data);
            $payload['data'] = $data;
        } elseif ($data !== null) {
            $payload['data'] = $data;
        }
        self::json($payload, $statusCode);
    }

    public static function error(string $message, int $statusCode = 400, mixed $details = null): void {
        $payload = [
            'success' => false,
            'error'   => $message,
            'message' => $message
        ];
        if ($details !== null) {
            $payload['details'] = $details;
        }
        self::json($payload, $statusCode);
    }

    public static function getJsonBody(): array {
        $raw = file_get_contents('php://input');
        if (empty($raw)) {
            return $_POST ?? [];
        }
        $data = json_decode($raw, true);
        return is_array($data) ? $data : ($_POST ?? []);
    }
}
