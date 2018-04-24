<?php
    namespace antonov\auth;

    use Firebase\JWT\JWT;

    class TokenController
    {
        private $secretKey = "secret";

        public function createToken($params)
        {
            $token = [
                "iat"=>time(),
                "exp"=>time() + 60 * 60 * 24,
                "iss"=>$_SERVER['SERVER_NAME'],
                "aud"=>$_SERVER['HTTP_ORIGIN'],
                "data"=>$params
            ];

            $jwt = JWT::encode($token, $this->secretKey);

            return $jwt;
        }

        public function checkToken($jwt)
        {
            $decoded = JWT::decode($jwt, $this->secretKey, array('HS256'));
            if ($decoded) {
                return $decoded;
            }

            return false;
        }
    }


