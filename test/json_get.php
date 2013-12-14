<?php

$r= file_get_contents('http://thyratron.from.io' . '/' . $argv[1]);
$json= json_decode($r, true);
printf("%s\n", json_encode($json, JSON_PRETTY_PRINT));

?>
