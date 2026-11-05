<?php
namespace App\Api;

use Magrathea\MagratheaApiControl;

class BenchApiControl extends MagratheaApiControl {

	public function Hello(): array {
		header("X-Peak-Mem: " . memory_get_peak_usage(false));
		return ["hello" => "world"];
	}

	public function Planets(): array {
		header("X-Peak-Mem: " . memory_get_peak_usage(false));
		return [
			["id" => 1, "name" => "Mercury", "diameter_km" => 4879],
			["id" => 2, "name" => "Venus", "diameter_km" => 12104],
			["id" => 3, "name" => "Earth", "diameter_km" => 12742],
			["id" => 4, "name" => "Mars", "diameter_km" => 6779],
			["id" => 5, "name" => "Jupiter", "diameter_km" => 139820],
		];
	}
}
