<?php
/**
 * Created by PhpStorm.
 * User: northpole
 * Date: 29.04.17
 * Time: 14:41
 */

use PHPUnit\Framework\TestCase;

class fooTest extends TestCase
{
    private $proxy = '127.0.0.1:8090';
    static private $webDriver;
    private $wdUrl =  'http://localhost:4444/wd/hub';
    private $url = 'http://google.com';

//    public function testEchoesName()
//    {
//        require 'index.php';
//        $this->assertEquals(processName('a'), 'Hi a');
//    }

    public function setup()
    {
        $capabilities = [\Facebook\WebDriver\Remote\WebDriverCapabilityType::BROWSER_NAME => 'firefox',
            \Facebook\WebDriver\Remote\WebDriverCapabilityType::PROXY => [
                'proxyType' => 'manual',
                'httpProxy' => $this->proxy,
                'sslProxy' => $this->proxy
            ],\Facebook\WebDriver\Remote\DesiredCapabilities::firefox()];
        if(self::$webDriver === null)
            self::$webDriver = \Facebook\WebDriver\Remote\RemoteWebDriver::create($this->wdUrl,$capabilities);
    }
    public function testEchoesName()//ZAP should flag this as XSS
    {
        self::$webDriver->get($this->url."?query=foo");
        $element = self::$webDriver->findElement(\Facebook\WebDriver\WebDriverBy::id("id_echo"));
        $this->assertContains('foo',$element->getText());//assert that the page contains foo
    }
    public function testEchoesSurname(){//ZAP shouldn't flag this
        self::$webDriver->get($this->url."?nx=bar");
        $element = self::$webDriver->findElement(\Facebook\WebDriver\WebDriverBy::id("id_echo2"));
        $this->assertContains('bar',$element->getText());//assert that the page contains foo

    }
    public function testHidden(){
        self::$webDriver->get($this->url."?hidden=foo");
        $element = self::$webDriver->findElement(\Facebook\WebDriver\WebDriverBy::id("id_echo"));
        $this->assertContains('foo',$element->getText());//assert that the page contains foo
    }

}
