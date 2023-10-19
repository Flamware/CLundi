<?php
$host_name = 'db5014632053.hosting-data.io';
$database = 'dbs12158585';
$user_name = 'dbu5430430';
$password = 'k8jU-_AV9j4c.F9';

$link = new mysqli($host_name, $user_name, $password, $database);

if ($link->connect_error) {
    die('<p>La connexion au serveur MySQL a échoué: '. $link->connect_error .'</p>');
} else {
    echo '<p>Connexion au serveur MySQL établie avec succès.</p>';
}
tesing
?>