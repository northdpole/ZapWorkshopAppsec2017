<?php

use PHPUnit\Framework\TestCase;
use \Facebook\WebDriver\Remote;

class fooTest extends TestCase
{
    private $proxy = 'http://127.0.0.1';
    private $proxy_port = '8090';
    static private $webDriver = null;
    private $wdUrl = 'http://localhost:4444/wd/hub';
    private $url = 'http://127.0.0.1:7070/app/index.php';


//    public function testEchoesName()
//    {
//        require 'index.php';
//        $this->assertEquals(processName('a'), 'Hi a');
//    }

    public function setup()
    {
        //IT DOESN'T RECOGNISE THE PROXY, NEED TO SETUP CUSTOM PROFILE!
        $json_proxy = [Remote\WebDriverCapabilityType::PROXY => [
        'proxyType' => 'MANUAL',
        'httpProxy' => $this->proxy,
        'httpProxyPort' => '8090',
    ]];
        $cap = Remote\DesiredCapabilities::firefox();
        $cap->setCapability(Remote\WebDriverCapabilityType::PROXY,$json_proxy);

        if (self::$webDriver === null)
            self::$webDriver = \Facebook\WebDriver\Remote\RemoteWebDriver::create($this->wdUrl, $cap);
    }
//    public function testEchoesName()//ZAP should flag this as XSS
//    {
//        self::$webDriver->get($this->url."?query=foo&submit=submit");
//        $element = self::$webDriver->findElement(\Facebook\WebDriver\WebDriverBy::id("id_echo"));
//        $this->assertContains('foo',$element->getText());//assert that the page contains foo
//    }
    public function testEchoesSurname()
    {//ZAP shouldn't flag this
        self::$webDriver->get($this->url . "?nx=bar&submit=submit");
        $element = self::$webDriver->findElement(\Facebook\WebDriver\WebDriverBy::id("id_echo2"));
        $this->assertContains('bar', $element->getText());//assert that the page contains foo

    }

    public function testHidden()
    {
        self::$webDriver->get($this->url . "?hidden=foo&submit=submit");
        $element = self::$webDriver->findElement(\Facebook\WebDriver\WebDriverBy::id("id_hidden"));
        $this->assertContains('foo', $element->getText());//assert that the page contains foo
    }

}
