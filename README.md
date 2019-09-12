# Scan-Documents-and-Do-Server-side-OCR-Pro-Java

## Introduction

This sample demonstrates how to use Dynamic Web TWAIN's OCR Professional add-on to do OCR on the server side running Java. 

## Environment

The server must be Windows (x64), client can run Windows/macOS/Linux

## Example environment

OS: Windows 10
Server: Tomcat 9.0.24
Eclipse: Oxygen.3a Release (4.7.3a)
JRE: 1.8.0_221

## How to install the OCR engine on the server

On the server or your development machine

1. If you have NEVER installed Dynamsoft Service, download and install it from [here](https://tst.dynamsoft.com/libs/dwt/15.1/dist/DynamsoftServiceSetupTrial.msi).

2. Download the OCR pro resources from [here](https://tst.dynamsoft.com/libs/dwt/15.1/OCRPResources/OCRProx64.zip).

3. Unzip `OCRProx64.zip` and copy all the files to `C:\Windows\SysWOW64\Dynamsoft\DynamsoftServicex64`.

## How to test it

Option 1: 

Open /Sample/.project in Eclipse, add a runtime server (Tomcat) and start it. Then naviate to http://localhost:8080/Scan-Documents-and-Do-Server-side-OCR-Pro-Java/OCRProServerSide.html

Option 2:

Deploy the sample in `\Sample\WebContent\` to Tomcat (typically under `C:\Program Files (x86)\Apache Software Foundation\Tomcat 9.0\webapps`) and navigate to `http://localhost:8080\WebContent\OCRProServerSide.html`.

## References:

* [Dynamic Web TWAIN][1]
* [Dynamsoft OCR Engine][2]

[1]:https://www.dynamsoft.com/Products/WebTWAIN_Overview.aspx
[2]:http://www.dynamsoft.com/Products/image-to-text-web-application.aspx

Should you need any technical help, please write to support@dynamsoft.com.