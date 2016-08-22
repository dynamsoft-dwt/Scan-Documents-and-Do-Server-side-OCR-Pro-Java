Dynamsoft.WebTwainEnv.RegisterEvent('OnWebTwainReady', Dynamsoft_OnReady); // Register OnWebTwainReady event. This event fires as soon as Dynamic Web TWAIN is initialized and ready to be used


var DWObject, CurrentPath;
var _iLeft, _iTop, _iRight, _iBottom, _iZone = "[]";
var CurrentPathName = unescape(location.pathname),PDFDLLDownloadURL;
CurrentPath = CurrentPathName.substring(0, CurrentPathName.lastIndexOf("/") + 1);
var objectDimention = {width:"",height:""};

var OCRFindTextFlags = [
		{ desc: "whole word", val: 1 },
		{ desc: "match case", val: 2 },
		{ desc: "fuzzy match", val: 4 }
];


var OCRFindTextAction = [
		{ desc: "highlight", val: 0 },
		{ desc: "strikeout", val: 1 },
		{ desc: "mark for redact", val: 2 }
];


var OCRLanguages = [
		{ desc: "English", val: "eng" },
		{ desc: "Arabic", val: "arabic" },
		{ desc: "Italian", val: "italian" }
];

var OCRRecognitionModule = [
		{ desc: "auto", val: "AUTO" },
		{ desc: "most accurate", val: "MOSTACCURATE" },
		{ desc: "balanced", val: "BALANCED" },
		{ desc: "fastest", val: "FASTEST" }
];

var OCROutputFormat = [
		{ desc: "TXT", val: "TXTS" },
		{ desc: "CSV", val: "TXTCSV" },
		{ desc: "Text Formatted", val: "TXTF" },
		{ desc: "XML", val: "XML" },
		{ desc: "PDF - SinglePage", val: "IOTPDF" },
		{ desc: "PDF", val: "IOTPDF" },
		{ desc: "PDF with MRC compression", val: "IOTPDF_MRC" }
];

var OCRPDFVersion = [
		{ desc: "", val: "" },
		{ desc: "1.0", val: "1.0" },
		{ desc: "1.1", val: "1.1" },
		{ desc: "1.2", val: "1.2" },
		{ desc: "1.3", val: "1.3" },
		{ desc: "1.4", val: "1.4" },
		{ desc: "1.5", val: "1.5" },
		{ desc: "1.6", val: "1.6" },
		{ desc: "1.7", val: "1.7" }

];

var OCRPDFAVersion = [
		{ desc: "", val: "" },
		{ desc: "pdf/a-1a", val: "pdf/a-1a" },
		{ desc: "pdf/a-1b", val: "pdf/a-1b" },
		{ desc: "pdf/a-2a", val: "pdf/a-2a" },
		{ desc: "pdf/a-2b", val: "pdf/a-2b" },
		{ desc: "pdf/a-2u", val: "pdf/a-2u" },
		{ desc: "pdf/a-3a", val: "pdf/a-3a" },
		{ desc: "pdf/a-3b", val: "pdf/a-3b" },
		{ desc: "pdf/a-3u", val: "pdf/a-3u" }

];

function downloadPDFR() {
	Dynamsoft__OnclickCloseInstallEx();
	DWObject.Width = objectDimention.width;
	DWObject.Height = objectDimention.height;
	var _pdfPath = CurrentPath + '/Resources/addon/Pdf.zip';
	if(!Dynamsoft.Lib.product.bChromeEdition && DWObject.getSWebTwain != undefined) {
		_pdfPath = location.protocol + "//" + location.hostname + ":" + location.port + CurrentPath + '/Resources/addon/Pdf.zip';
	}
	DWObject.Addon.PDF.Download(
		_pdfPath,
		function() {
			console.log('PDF dll is installed');
		},
		function(errorCode, errorString) {
			console.log(errorString);
		}
	);
}

function Dynamsoft_OnReady() {
    Dynamsoft.Lib.addEventListener(document.getElementById('AsynchronouslyTip'), 'mouseover',
		function () { document.getElementById(this.id + '-div').style.display = ''; }
	);
    Dynamsoft.Lib.addEventListener(document.getElementById('AsynchronouslyTip'), 'mouseout',
		function () { document.getElementById(this.id + '-div').style.display = 'none'; }
	);
	DWObject = Dynamsoft.WebTwainEnv.GetWebTwain('dwtcontrolContainer'); // Get the Dynamic Web TWAIN object that is embeded in the div with id 'dwtcontrolContainer'
	if (DWObject) {
		DWObject.RegisterEvent("OnImageAreaSelected", Dynamsoft_OnImageAreaSelected);
		DWObject.RegisterEvent("OnImageAreaDeSelected", Dynamsoft_OnImageAreaDeselected);
		for (var i = 0; i < OCRFindTextFlags.length; i++)
			document.getElementById("ddlFindTextFlags").options.add(new Option(OCRFindTextFlags[i].desc, i));
		for (var i = 0; i < OCRFindTextAction.length; i++)
			document.getElementById("ddlFindTextAction").options.add(new Option(OCRFindTextAction[i].desc, i));
		for (var i = 0; i < OCRLanguages.length; i++)
			document.getElementById("ddlLanguages").options.add(new Option(OCRLanguages[i].desc, i));
		for (var i = 0; i < OCROutputFormat.length; i++)
			document.getElementById("ddlOCROutputFormat").options.add(new Option(OCROutputFormat[i].desc, i));
		for (var i = 0; i < OCRRecognitionModule.length; i++)
			document.getElementById("ddlOCRRecognitionModule").options.add(new Option(OCRRecognitionModule[i].desc, i));
		for (var i = 0; i < OCRPDFVersion.length; i++)
			document.getElementById("ddlPDFVersion").options.add(new Option(OCRPDFVersion[i].desc, i));
		for (var i = 0; i < OCRPDFAVersion.length; i++)
			document.getElementById("ddlPDFAVersion").options.add(new Option(OCRPDFAVersion[i].desc, i));

		document.getElementById("ddlPDFVersion").selectedIndex = 6;
		/*
		* Make sure the PDF Rasterizer add-on is already installed, please note that the file Pdf.zip is already part of the sample
		*/
		if(!Dynamsoft.Lib.env.bMac) {
			var localPDFRVersion = DWObject._innerFun('GetAddOnVersion', '["pdf"]');
			if(!Dynamsoft.Lib.product.bChromeEdition && DWObject.getSWebTwain != undefined) {
				localPDFRVersion = DWObject.getSWebTwain().GetAddonVersion("pdf")
			}			
			if (localPDFRVersion != Dynamsoft.PdfVersion) {
				objectDimention.width = DWObject.Width;
				objectDimention.height = DWObject.Height;
				DWObject.Width = "1px";
				DWObject.Height = "1px";
				var ObjString = [];
				ObjString.push('<div class="p15" id="pdfr-install-dlg">');
				ObjString.push('The <strong>PDF Rasterizer</strong> is not installed on this PC<br />Please click the button below to get it installed');
				ObjString.push('<p class="tc mt15 mb15"><input type="button" value="Install PDF Rasterizer" onclick="downloadPDFR();" class="btn lgBtn bgBlue" /><hr></p>');
				ObjString.push('<i><strong>The installation is a one-time process</strong> <br />It might take some time depending on your network.</i>');
				ObjString.push('</div>');
				Dynamsoft.WebTwainEnv.ShowDialog(400,310, ObjString.join(''));
				document.getElementsByClassName("ClosetblCanNotScan")[0].style.display = "none";
			}
		}
	}
}

function Dynamsoft_OnImageAreaSelected(index, _left, _top, _right, _bottom) {
	_iLeft = parseInt(_left);
	_iTop = parseInt(_top);
	_iRight = parseInt(_right);
	_iBottom = parseInt(_bottom);
	_iZone = "[[" + _iLeft + ', ' + _iTop + ', ' + _iRight+', '+_iBottom + "]]";
	document.getElementById("ddlOCROutputFormat").options[5].disabled = true;
	document.getElementById("ddlOCROutputFormat").options[6].disabled = true;
	if(document.getElementById("ddlOCROutputFormat").selectedIndex > 4)
		document.getElementById("ddlOCROutputFormat").selectedIndex = 4;
	SetIfUseRedaction();
}

function Dynamsoft_OnImageAreaDeselected(index) {
	_iLeft = 0;
	_iTop = 0;
	_iRight = 0;
	_iBottom = 0;
	document.getElementById("ddlOCROutputFormat").options[5].disabled = false;
	document.getElementById("ddlOCROutputFormat").options[6].disabled = false;
	_iZone = "[]";
}

function AcquireImage() {
	if (DWObject) {
		var bSelected = DWObject.SelectSource();
		if (bSelected) {

			var OnAcquireImageSuccess, OnAcquireImageFailure;
			OnAcquireImageSuccess = OnAcquireImageFailure = function () {
				DWObject.CloseSource();
			};

			DWObject.OpenSource();
			DWObject.IfDisableSourceAfterAcquire = true;  //Scanner source will be disabled/closed automatically after the scan.
			DWObject.AcquireImage(OnAcquireImageSuccess, OnAcquireImageFailure);
		}
	}
}

function LoadImages() {
	if (DWObject) {
		var nCount = 0, nCountLoaded = 0;;
		DWObject.IfShowFileDialog = false;
		DWObject.RegisterEvent('OnGetFilePath', function(bSave, filesCount, index, path, filename){
			nCount = filesCount;
			if(nCount == -1) {
				console.log('user cancelled');
				Dynamsoft.Lib.detect.hideMask();
			}
			var filePath = path + "\\" +  filename;
			if((filename.substr(filename.lastIndexOf('.') + 1)).toLowerCase() == 'pdf'){
				DWObject.Addon.PDF.SetResolution(200);   
				DWObject.Addon.PDF.SetConvertMode(EnumDWT_ConverMode.CM_RENDERALL);
			}
			DWObject.LoadImage(filePath, 
				function() {
					console.log('successful');},
				function (errorCode, errorString) {
					alert(errorString);
				});
		});
		DWObject.RegisterEvent('OnPostLoad', function(path, name, type){
			nCountLoaded ++;
			if(nCountLoaded == nCount)
				Dynamsoft.Lib.detect.hideMask();
		});
		DWObject.ShowFileDialog(false,  "BMP, JPG, PNG, PDF and TIF | *.bmp;*.jpg;*.png;*.pdf;*.tif;*.tiff", 0, "", "", true, true, 0)		
		Dynamsoft.Lib.detect.showMask();
	}
}

function SetIfUseRedaction() {
	var selectValue = OCROutputFormat[document.getElementById("ddlOCROutputFormat").selectedIndex].val;
	if (selectValue == "IOTPDF" ||
		selectValue == "IOTPDF_MRC") {
		document.getElementById("divVersion").style.display = "";
		document.getElementById("divIfUseRedaction").style.display = "";
	}
	else if (selectValue == "TXTF") {
		document.getElementById("divVersion").style.display = "none";
		document.getElementById("divIfUseRedaction").style.display = "";
	}
	else {
		document.getElementById("divVersion").style.display = "none";
		document.getElementById("divIfUseRedaction").style.display = "none";
		document.getElementById("divRedaction").style.display = "none";
		document.getElementById("chkUseRedaction").checked = false;
	}
}

function SetRedaction() {
	if (document.getElementById("chkUseRedaction").checked) {
		document.getElementById("divRedaction").style.display = "";
	}
	else {
		document.getElementById("divRedaction").style.display = "none";
		document.getElementById("chkUseRedaction").checked = false;
	}
}

function DoOCR() {
	document.getElementById("spOCRResult").style.display = "none";
	if (DWObject) {
		if (DWObject.HowManyImagesInBuffer == 0) {
			alert("Please scan or load an image first.");
			return;
		}

		var OnSuccess = function (httpResponse) {
		};


		var OnFailure = function (errorCode, errorString, httpResponse) {
			if (errorCode != -2003) {
				alert(errorString);
				return;
			}

			var outPutFile, response = "";
			var pos = httpResponse.indexOf("|#|");
			if (pos < 0)
				response = httpResponse;
			else {
				if (pos > 0)
					outPutFile = httpResponse.substring(0, pos);

				if (httpResponse && httpResponse.length > 3)
					response = httpResponse.substring(pos + 3, httpResponse.length);
			}

			if (outPutFile && outPutFile.length > 0) {
				var downloadURL = GetDownloadURL(outPutFile);
				if (downloadURL) {
					var dOCRResult = document.getElementById("spOCRResult");
					if (dOCRResult) {
						dOCRResult.style.display = "";
						var aOCRResult = document.getElementById("aOCRResult");
						if (aOCRResult) {
							aOCRResult.href = downloadURL;
						}
						document.getElementById('div_OCRing').style.display = 'none';
						document.getElementById('id_OCRBtn').disabled = false;
						document.getElementById('id_OCRBtn').value = 'OCR';
					}
				}
			}
			else {
				var result;
				if (response && response.length > 0) {
					try {
						result = KISSY.JSON.parse(response);
					}
					catch (exp) {
						alert(response);
						return;
					}

				}
				if (result && result.message) {
					var strErrorDetail = result.message;
					var aryErrorDetailList = result.errorList;
					if (aryErrorDetailList.length > 0)
						strErrorDetail = strErrorDetail + "\r\nError lists:\r\n";
					for (var i = 0; i < aryErrorDetailList.length; i++) {
						if (i > 0)
							strErrorDetail += ";";
						strErrorDetail += "[" + (i + 1) + "]." + aryErrorDetailList[i].input + ": " + aryErrorDetailList[i].message;
					}
					alert(strErrorDetail);
				}
				else
					alert("OCR failed.");
			}
		};

		var date = new Date();
		var strFilePath = date.getFullYear() + "_" + (date.getMonth() + 1) + "_" + date.getDate() + "_" + date.getHours() + "_" + date.getMinutes() + "_" + date.getSeconds() + "_" + date.getMilliseconds() + ".pdf";

		var strHTTPServer = location.hostname;
		DWObject.IfSSL = DynamLib.detect.ssl;
		var _strPort = location.port == "" ? 80 : location.port;
		if (DynamLib.detect.ssl == true)
			_strPort = location.port == "" ? 443 : location.port;
		DWObject.HTTPPort = _strPort;


		var strActionPage = CurrentPath + "SaveToOCR.jsp";
		strHTTPServer = location.hostname;

		DWObject.ClearAllHTTPFormField();
		var outputFormat = OCROutputFormat[document.getElementById("ddlOCROutputFormat").selectedIndex].val;
		DWObject.SetHTTPFormField("OutputFormat", outputFormat);
		DWObject.SetHTTPFormField("RequestBody", GetRequestBody());
		if(document.getElementById("ddlOCROutputFormat").selectedIndex == 4){
			DWObject.HTTPUploadThroughPost(
				strHTTPServer,
				DWObject.CurrentImageIndexInBuffer,
				strActionPage,
				strFilePath,
				OnSuccess, OnFailure);
		} else {
			DWObject.HTTPUploadAllThroughPostAsPDF(
				strHTTPServer,
				strActionPage,
				strFilePath,
				OnSuccess, OnFailure);
		}

	}

}

function GetRequestBody() {
	var strRequestBody = "{";
	strRequestBody += "\"productKey\": \"" + Dynamsoft.WebTwainEnv.ProductKey + "\",";
	strRequestBody += "\"inputFile\":[\"#inputFile#\"],";
	strRequestBody += "\"settings\": {";
	strRequestBody += "\"recognitionModule\": \"" + OCRRecognitionModule[document.getElementById("ddlOCRRecognitionModule").selectedIndex].val + "\",";
	strRequestBody += "\"languages\": \"" + OCRLanguages[document.getElementById("ddlLanguages").selectedIndex].val + "\",";
	var strSavePath = document.getElementById("txtOutputpath");
	strRequestBody += "\"recognitionMethod\": \"Page\",";
	strRequestBody += "\"threadCount\": \"2\",";
	strRequestBody += "\"outputFormat\": \"" + OCROutputFormat[document.getElementById("ddlOCROutputFormat").selectedIndex].val + "\"";
	var selectValue = OCROutputFormat[document.getElementById("ddlOCROutputFormat").selectedIndex].val;
	if (selectValue == "IOTPDF" ||
		selectValue == "IOTPDF_MRC") {
		strRequestBody += "," + "\"pdfVersion\": \"" + OCRPDFVersion[document.getElementById("ddlPDFVersion").selectedIndex].val + "\",";
		strRequestBody += "\"pdfAVersion\": \"" + OCRPDFAVersion[document.getElementById("ddlPDFAVersion").selectedIndex].val + "\"";
	}
	if (document.getElementById("chkUseRedaction").checked) {
		strRequestBody += ",\"redaction\":{";
		strRequestBody += "\"findText\":\"" + document.getElementById("txtFindText").value + "\",";
		strRequestBody += "\"findTextFlags\":" + OCRFindTextFlags[document.getElementById("ddlFindTextFlags").selectedIndex].val + ",";
		strRequestBody += "\"findTextAction\":" + OCRFindTextAction[document.getElementById("ddlFindTextAction").selectedIndex].val;
		strRequestBody += "}";
	}
	strRequestBody += "},";
	strRequestBody += "\"zones\": "+ _iZone + ",";  //"\"zones\": [[100,100,200,300],[100,600,100,200]],";

	strRequestBody += "\"outputFile\": \"#outputFile#\"";
	strRequestBody += "}";
	return strRequestBody;
}

function GetDownloadURL(outPutFile) {
	var downloadURLTemp = "";
	var findText = "UploadedImages\\";
	var filename = outPutFile;
	var pos = outPutFile.indexOf(findText);
	if (pos > 0)
		filename = outPutFile.substring(pos + findText.length, outPutFile.length);

	var _strPort = location.port == "" ? 80 : location.port;
	if (DynamLib.detect.ssl == true) {
		_strPort = location.port == "" ? 443 : location.port;
		downloadURLTemp = "https://";
	}
	else
		downloadURLTemp = "http://";

	var strDownloadPage = CurrentPath + "UploadedImages/" + filename;

	downloadURLTemp = downloadURLTemp + location.hostname + ":" + _strPort + strDownloadPage;

	return downloadURLTemp;
}