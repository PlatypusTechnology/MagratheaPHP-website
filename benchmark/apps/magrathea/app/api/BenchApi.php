<?php
namespace App;

use Magrathea\MagratheaApi;
use App\Api\BenchApiControl;

class BenchApi extends MagratheaApi {

	public function __construct() {
		$this->Initialize();
	}

	public function Initialize() {
		$this->AllowAll();
		$ctrl = new BenchApiControl();
		$this->Add("GET", "hello", $ctrl, "Hello");
		$this->Add("GET", "planets", $ctrl, "Planets");
	}
}
