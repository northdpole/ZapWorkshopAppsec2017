<?php
declare(strict_types=1);

require __DIR__ . '/vendor/autoload.php';

//use PHPUnit\Framework\TestCase;
//use Facebook\WebDriver\Remote\WebDriverCapabilityType;
//use Facebook\WebDriver\Remote\RemoteWebDriver;
//use Facebook\WebDriver\WebDriverBy;

class FooTest extends PHPUnit_Framework_TestCase
{
	protected static $webDriver;
	protected $url = 'http://localhost:8000/Access_To_Unit_Tests/sqli_xss.php';
	// Instead of defining the proxy here, you could also use the properties file.
	protected $httpProxy = "localhost:9090";

	public function setUp()
	{
		$capabilities = [
			\WebDriverCapabilityType::BROWSER_NAME => 'firefox'//,
			/*		WebDriverCapabilityType::PROXY => [
					'proxyType' => 'manual',
					'httpProxy' => '127.0.0.1:8090
					'sslProxy' => '127.0.0.1:8090',
					],
			 */	];
		self::$webDriver = RemoteWebDriver::create('http://localhost:4444/wd/hub', $capabilities);
	}


	public function testEchoesName()//ZAP should flag this as XSS
	{	
		self::$webDriver->get($this->url."?query=foo");
		$element = self::$webDriver->findElement(WebDriverBy::id("id_echo"));
		$this->assertContains('foo',$element->getText());//assert that the page contains foo
	}
	public function testEchoesSurname(){//ZAP shouldn't flag this
		self::$webDriver->get($this->url."?nx=bar");
		$element = self::$webDriver->findElement(WebDriverBy::id("id_echo2"));
		$this->assertContains('bar',$element->getText());//assert that the page contains foo
	
	}
	public function testHidden(){
		self::$webDriver->get($this->url."?hidden=foo");
		$element = self::$webDriver->findElement(WebDriverBy::id("id_echo"));
		$this->assertContains('foo',$element->getText());//assert that the page contains foo
	}
	public function testCanInsertInDB()

	{return;
		self::$webDriver->get($this->url."?s=john");
		$this->assertContains('success', self::$webDriverBy->id("id_insert"));//insert succeeds

	}
	public  function tearDown(){
		self::$webDriver->quit();
	}

}
