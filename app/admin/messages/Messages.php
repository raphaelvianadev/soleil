<?php


namespace app\admin\messages;


use config\Config;
use config\Json;
use config\Model;
use config\Security;

class Messages extends Model
{

    public function __construct()
    {
        parent::__construct();
    }

    public function add()
    {
        if (!Security::ajax()) {
            return Json::encode(['status' => 'error', 'message' => 'Conexão bloqueada']);
        }
        if (empty($_POST)) {
            return Json::encode(['status' => 'error', 'message' => 'Nenhuma requisição solicitada']);
        }
        if (empty($_POST['title']) || empty($_POST['subtitle']) || empty($_POST['topic'])) {
            return Json::encode(['status' => 'error', 'message' => 'Insira todos os campos']);
        }

        $title = $_POST['title'];
        $subtitle = $_POST['subtitle'];
        $topic = $_POST['topic'];

        $stmt = $this->getConnection()->prepare("INSERT INTO `website_messages`(`message_title`, `message_subtitle`, `message_topic`, `message_date`) VALUES (?, ?, ?, ?)");
        $stmt->execute([$title, $subtitle, $topic, date("Y-m-d H:i:s")]);

        /*if ($this->sendNotifications($_POST['title'], "Clique aqui para ver mais")) {
            return Json::encode(['status' => 'ok', 'message' => 'Mensagem enviada com sucesso!']);
        } else {
            return Json::encode(['status' => 'error', 'message' => 'Não foi possível notificar os usuários!']);
        }*/
        return Json::encode(['status' => 'ok', 'message' => 'Mensagem enviada com sucesso!']);

    }

    public function sendNotifications($title, $body)
    {
        $headers = [
            "Authorization: key=" . Config::TOKEN_FCM,
            "Content-Type: application/json"
        ];

        $form = [
            "to" => "/topics/all",
            "notification" => [
                "title" => $title,
                "body" => $body
            ],
        ];

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, "https://fcm.googleapis.com/fcm/send");
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($form));
        curl_exec($ch);

        $success = true;

        if (!curl_errno($ch)) {
            $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $success = $status === 200;
        }

        curl_close($ch);
        return $success;
    }

}