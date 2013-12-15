<?php
  $report = $_GET['report']; $host= $_GET['host'];
  $json = file_get_contents($host . $report);
  echo sprintf('%s(%s);', $_GET['callback'], $json);
?>
