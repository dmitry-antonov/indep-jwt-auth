<?php
    namespace antonov\auth;

    class UserController
    {
        private $dbUser = 'root';
        private $dbPassword = 'root';
        private $dbName = 'auth_users';
        private $dbConnection;

        private function getDbConnection()
        {
            if (!$this->dbConnection) {
                $this->dbConnection = new \PDO('mysql:host=localhost;dbname=' . $this->dbName, $this->dbUser, $this->dbPassword);
            }
            return $this->dbConnection;
        }

        public function register($name, $login, $password)
        {
            $passwordHash = password_hash($password, PASSWORD_DEFAULT);

            $stmt = $this->getDbConnection()->prepare('INSERT INTO tbl_users (name, login, password) VALUES (:name, :login, :password)');
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':login', $login);
            $stmt->bindParam(':password', $passwordHash);

            return $stmt->execute();
        }

        public function getUser($login, $password)
        {
            $stmt = $this->getDbConnection()->prepare("SELECT * FROM tbl_users WHERE login = :login");
            $stmt->execute([':login' => $login]);
            $resUser = $stmt->fetch();

            if ($resUser && password_verify($password, $resUser['password'])) {
                return $resUser;
            } else {
                return false;
            }
        }

    }
