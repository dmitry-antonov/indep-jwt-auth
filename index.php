<?php
    include 'vendor/antonov/auth/TokenController.php';
    include 'vendor/antonov/auth/UserController.php';
    include 'vendor/autoload.php';

    use antonov\auth\TokenController;
    use antonov\auth\UserController;


    function sendCorsHeaders($statusCode)
    {
        $contentType = 'application/json';
        $statusHeader = 'HTTP/1.1 ' . $statusCode;

        header($statusHeader);
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST");
        header("Access-Control-Allow-Headers: Authorization");
        header('Content-type: ' . $contentType);
    }

    if (isset($_GET['r'])) {
        $action = $_GET['r'];

        $userController = new UserController();
        $tokenController = new TokenController();


        switch ($action) {
            case 'user/register':
                $name = $_POST['name'];
                $login = $_POST['login'];
                $password = $_POST['password'];
                $result = $userController->register($name, $login, $password);

                if ($result) {
                    sendCorsHeaders('200 OK');
                    return;
                } else {
                    sendCorsHeaders('400 Bad Request');
                    return;
                }
                break;
            case 'user/auth':
                $login = $_POST['login'];
                $password = $_POST['password'];

                $result = $userController->getUser($login, $password);

                if($result) {
                    $token = $tokenController->createToken($result);
                    sendCorsHeaders('200 OK');
                    echo json_encode(['token' => $token, 'name' => $result['name']]);
                    return;
                } else {
                    sendCorsHeaders('403 Forbidden');
                    return;
                }
                break;
            case 'token/check':
                if(isset($_POST['token'])) {
                    $token = $_POST['token'];
                    $result = $tokenController->checkToken($token);

                    if ($result) {
                        sendCorsHeaders('200 OK');
                        echo json_encode(['name' => $result->data->name]);
                        return;
                    }
                }

                sendCorsHeaders('403 Forbidden');
                return;

                break;
        }
    }