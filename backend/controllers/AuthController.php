<?php
/**
 * FocusForge Auth Controller
 */

require_once __DIR__ . '/../models/UserModel.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Jwt.php';

class AuthController {
    public static function register(): void {
        $body = Response::getJsonBody();
        $name = trim($body['name'] ?? '');
        $email = trim(strtolower($body['email'] ?? ''));
        $password = $body['password'] ?? '';
        $avatar = $body['avatar'] ?? 'warrior';

        if (empty($name)) {
            Response::error('Name is required', 400);
        }
        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Response::error('Valid email is required', 400);
        }
        if (strlen($password) < 6) {
            Response::error('Password must be at least 6 characters long', 400);
        }

        $existing = UserModel::findByEmail($email);
        if ($existing) {
            Response::error('User with this email already exists', 400);
        }

        $passwordHash = password_hash($password, PASSWORD_BCRYPT);
        $user = UserModel::create($name, $email, $passwordHash, $avatar);
        $token = Jwt::encode(['id' => $user['id'], 'email' => $user['email']]);

        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_email'] = $user['email'];

        Response::json([
            'success' => true,
            'message' => 'User registered successfully',
            'token'   => $token,
            'user'    => $user
        ], 201);
    }

    public static function login(): void {
        $body = Response::getJsonBody();
        $email = trim(strtolower($body['email'] ?? ''));
        $password = $body['password'] ?? '';

        if (empty($email) || empty($password)) {
            Response::error('Email and password are required', 400);
        }

        $user = UserModel::findByEmail($email);
        if (!$user) {
            Response::error('Invalid email or password', 401);
        }

        if (!password_verify($password, $user['password_hash'])) {
            Response::error('Invalid email or password', 401);
        }

        $token = Jwt::encode(['id' => $user['id'], 'email' => $user['email']]);
        unset($user['password_hash']);

        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_email'] = $user['email'];

        Response::json([
            'success' => true,
            'message' => 'Login successful',
            'token'   => $token,
            'user'    => $user
        ]);
    }

    public static function demoLogin(): void {
        $demoEmail = 'demo@focusforge.app';
        $user = UserModel::findByEmail($demoEmail);

        if (!$user) {
            $passwordHash = password_hash('password123', PASSWORD_BCRYPT);
            $user = UserModel::create('Alex Rivers (Demo)', $demoEmail, $passwordHash, 'warrior');
        }

        $token = Jwt::encode(['id' => $user['id'], 'email' => $user['email']]);
        unset($user['password_hash']);

        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_email'] = $user['email'];

        Response::json([
            'success' => true,
            'message' => 'Demo login successful',
            'token'   => $token,
            'user'    => $user
        ]);
    }

    public static function forgotPassword(): void {
        $body = Response::getJsonBody();
        $email = trim(strtolower($body['email'] ?? ''));

        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Response::error('Valid email is required', 400);
        }

        $otp = (string)random_int(100000, 999999);

        Response::json([
            'success' => true,
            'message' => "Password reset OTP generated for {$email}",
            'otp'     => $otp
        ]);
    }

    public static function getMe(int $userId): void {
        $user = UserModel::findById($userId);
        if (!$user) {
            Response::error('User not found', 404);
        }
        Response::json([
            'success' => true,
            'user'    => $user
        ]);
    }
}
