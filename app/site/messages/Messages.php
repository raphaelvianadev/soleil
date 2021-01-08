<?php


namespace app\site\messages;


use config\Model;

class Messages extends Model
{

    public function __construct()
    {
        parent::__construct();
    }

    public function sendAll()
    {
        $dates = $this->getDates();

        if (count($dates) == 0) {
            return "<h3 class='text-muted text-center'>Não há mensagens.</h3>";
        }

        $qnt = 5;
        $current = (isset($_GET['page'])) ? intval($_GET['page']) : 1;
        rsort($dates);
        $page = array_chunk($dates, $qnt);
        $count = count($page);
        $result = $page[$current - 1];

        $return = "<div class='row'>";
        foreach ($result as $data) {
            $date = date('d/m/Y', strtotime($data));

            if ($date == date("d/m/Y")) {
                $date = "Hoje";
            }

            $return .= "<div class='col-md-3'>
                            <h3 class='text-muted float-right' style='font-size: 28px'>{$date}</h3>
                        </div> 
                        <div class='col-md-9'>";
            $titles = $this->getTitles($data);
            foreach ($titles as $rst => $title) {
                $indexes = $this->getId($title->message_title, $data);
                $id = 0;

                foreach ($indexes as $ids) {
                    $id = "{$ids['id']}";
                }

                $return .= "<a href=\"/mensagens?id={$id}\"><ul><h5 style='font-size: 26px'>{$title->message_title}</h5><ul style=' margin: 10px; font-size: 16px'></a>";

                $subt = $this->getSubtitle($title->message_title, $data);
                $subtitles = "";

                foreach ($subt as $subtitle) {
                    $subtitles .= "{$subtitle['subtitle']}";
                }

                $return .= "{$subtitles}</ul></ul>";
            }
            $return .= "</div>";
        }

        $pages = "";
        for ($i = 1; $i <= $count; $i++) {
            if ($i == $current) {
                $pages .= "<li class=\"page-item active\">
                              <a class=\"page-link\" href=\"#\">{$i} <span class=\"sr-only\">(atual)</span></a>
                          </li>";
            } else {
                $pages .= "<li class=\"page-item\">
                              <a class=\"page-link\" href=\"/mensagens?p={$i}\">{$i}</a>
                            </li>";
            }
        }
        $pagination = "<br><br>
                        <nav>
                          <ul class=\"pagination justify-content-end\">
                            <li class=\"page-item\"><a class=\"page-link\" href=\"/mensagens?page=1\">Primeira</a></li>
                            {$pages}
                            <li class=\"page-item\"><a class=\"page-link\" href=\"/mensagens?page={$count}\">Última</a></li>
                          </ul>
                        </nav>";
        return $return . "</div>" . $pagination;
    }

    private function getDates()
    {
        $stmt = $this->getConnection()->prepare("SELECT `message_date` FROM `website_messages` ORDER BY `message_id` DESC");
        $stmt->execute();
        $fetch = $stmt->fetchAll(\PDO::FETCH_OBJ);
        $stmt = null;
        $array = [];
        foreach ($fetch as $rs) {
            $date = explode(' ', $rs->message_date);
            $array[] = $date[0];

        }
        return array_unique($array);
    }

    private function getTitles($date)
    {
        $stmt = $this->getConnection()->prepare("SELECT DISTINCT `message_title` FROM `website_messages` WHERE `message_date` LIKE '%{$date}%' ORDER BY `message_date` DESC");
        $stmt->execute();
        $titles = $stmt->fetchAll(\PDO::FETCH_OBJ);
        $stmt = null;
        return $titles;
    }

    public function getCommunicated($id)
    {
        $stmt = $this->getConnection()->prepare("SELECT * FROM `website_messages` WHERE `message_id`=$id");
        $stmt->execute();

        $communicated = $stmt->fetch(\PDO::FETCH_OBJ);
        $stmt = null;
        return $communicated;
    }

    private function getTopics($title, $date)
    {
        $stmt = $this->getConnection()->prepare("SELECT `message_topic`, `message_id` FROM `website_messages` WHERE `message_date` LIKE '%$date%' AND `message_title` LIKE '%$title%'");
        $stmt->execute();
        $fetch = $stmt->fetchAll(\PDO::FETCH_OBJ);
        $stmt = null;
        $topics = [];
        foreach ($fetch as $rs) {
            array_push($topics,
                [
                    'id' => $rs->message_id,
                    'topic' => $rs->message_topic
                ]
            );
        }
        return $topics;
    }

    private function getId($title, $date)
    {
        $stmt = $this->getConnection()->prepare("SELECT `message_id` FROM `website_messages` WHERE `message_date` LIKE '%$date%' AND `message_title` LIKE '%$title%'");
        $stmt->execute();
        $fetch = $stmt->fetchAll(\PDO::FETCH_OBJ);
        $stmt = null;
        $ids = [];
        foreach ($fetch as $rs) {
            array_push($ids,
                [
                    'id' => $rs->message_id,
                ]
            );
        }
        return $ids;
    }

    private function getSubtitle($title, $date)
    {
        $stmt = $this->getConnection()->prepare("SELECT `message_subtitle` FROM `website_messages` WHERE `message_date` LIKE '%$date%' AND `message_title` LIKE '%$title%'");
        $stmt->execute();
        $fetch = $stmt->fetchAll(\PDO::FETCH_OBJ);
        $stmt = null;
        $subtitles = [];
        foreach ($fetch as $rs) {
            array_push($subtitles,
                [
                    'subtitle' => $rs->message_subtitle,
                ]
            );
        }
        return $subtitles;
    }

}