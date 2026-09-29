<?php
/**
 * FocusForge Centralized Database Connection
 * Uses PDO with MySQL / MariaDB via XAMPP
 */

class Database {
    private static ?PDO $instance = null;

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            $host = getenv('DB_HOST') ?: '127.0.0.1';
            $port = getenv('DB_PORT') ?: '3306';
            $dbName = getenv('DB_NAME') ?: 'focusforge';
            $user = getenv('DB_USER') ?: 'root';
            $password = getenv('DB_PASSWORD') !== false ? getenv('DB_PASSWORD') : '';

            $dsn = "mysql:host={$host};port={$port};dbname={$dbName};charset=utf8mb4";
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];

            try {
                self::$instance = new PDO($dsn, $user, $password, $options);
            } catch (PDOException $e) {
                // If focusforge database does not exist, try connecting without dbname and create it
                if ($e->getCode() == 1049) {
                    try {
                        $tempDsn = "mysql:host={$host};port={$port};charset=utf8mb4";
                        $tempPdo = new PDO($tempDsn, $user, $password, $options);
                        $tempPdo->exec("CREATE DATABASE IF NOT EXISTS `{$dbName}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
                        self::$instance = new PDO($dsn, $user, $password, $options);
                    } catch (PDOException $ex) {
                        http_response_code(500);
                        echo json_encode([
                            'success' => false,
                            'message' => 'Database connection failed: ' . $ex->getMessage()
                        ]);
                        exit;
                    }
                } else {
                    http_response_code(500);
                    echo json_encode([
                        'success' => false,
                        'message' => 'Database connection failed: ' . $e->getMessage()
                    ]);
                    exit;
                }
            }
        }
        return self::$instance;
    }
}
