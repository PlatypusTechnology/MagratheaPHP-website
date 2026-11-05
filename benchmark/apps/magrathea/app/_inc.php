<?php
require __DIR__ . "/../vendor/autoload.php";

try {
	Magrathea\MagratheaPHP::Instance()
		->AppPath(realpath(dirname(__FILE__)))
		->AddRootCodeFolder("api")
		->Prod()
		->Load();
} catch (Exception $ex) {
	\Magrathea\p_r($ex);
}
