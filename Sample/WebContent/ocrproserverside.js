window.onload = function () {
	Dynamsoft.DWT.AutoLoad = false;
	Dynamsoft.DWT.Containers = [{ ContainerId: 'dwtcontrolContainer', Width: '100%', Height: '600px' }];
	Dynamsoft.DWT.RegisterEvent('OnWebTwainReady', Dynamsoft_OnReady);
    /**
     * In order to use the full version, do the following
	 * 1. Replace Dynamsoft.DWT.ProductKey with a full version key
	 * 2. Change Dynamsoft.DWT.ResourcesPath to point to the full version 
     *    resource files that you obtain after purchasing a key
     */
	Dynamsoft.DWT.ProductKey = "t00891wAAAEFI4LxiTj1i25NNRIf2JmEOrbXv3jMNfvvxAuMh9vm8+OxP/GoAFy1qDRebTFKcW0OsELrReNW7oVZUcKOYNorvws58twDvIE9Q0wAmJ2XcbmcVK6Q=";
	Dynamsoft.DWT.ResourcesPath = 'https://unpkg.com/dwt/dist/';

	Dynamsoft.DWT.Load();
};

var DWObject, arySelectedAreas = [], _iZone = "[]",
	objectDimention = { width: "", height: "" },
	CurrentPathName = unescape(location.pathname),
	CurrentPath = CurrentPathName.substring(0, CurrentPathName.lastIndexOf("/") + 1),
	OCRFindTextFlags = [
		{ desc: "whole word", val: 1 },
		{ desc: "match case", val: 2 },
		{ desc: "fuzzy match", val: 4 }
	], OCRFindTextAction = [
		{ desc: "highlight", val: 0 },
		{ desc: "strikeout", val: 1 },
		{ desc: "mark for redact", val: 2 }
	], OCRLanguages = [
		{ desc: "English", val: "eng" },
		{ desc: "Arabic", val: "arabic" },
		{ desc: "Italian", val: "italian" }
	], OCRRecognitionModule = [
		{ desc: "auto", val: "AUTO" },
		{ desc: "most accurate", val: "MOSTACCURATE" },
		{ desc: "balanced", val: "BALANCED" },
		{ desc: "fastest", val: "FASTEST" }
	], OCROutputFormat = [
		{ desc: "TXT", val: "TXTS" },
		{ desc: "CSV", val: "TXTCSV" },
		{ desc: "Text Formatted", val: "TXTF" },
		{ desc: "XML", val: "XML" },
		{ desc: "PDF - SinglePage", val: "IOTPDF" },
		{ desc: "PDF", val: "IOTPDF" },
		{ desc: "PDF with MRC compression", val: "IOTPDF_MRC" }
	], OCRPDFVersion = [
		{ desc: "", val: "" },
		{ desc: "1.0", val: "1.0" },
		{ desc: "1.1", val: "1.1" },
		{ desc: "1.2", val: "1.2" },
		{ desc: "1.3", val: "1.3" },
		{ desc: "1.4", val: "1.4" },
		{ desc: "1.5", val: "1.5" },
		{ desc: "1.6", val: "1.6" },
		{ desc: "1.7", val: "1.7" }

	], OCRPDFAVersion = [
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


function Dynamsoft_OnReady() {
	var i;
	DWObject = Dynamsoft.DWT.GetWebTwain('dwtcontrolContainer'); // Get the Dynamic Web TWAIN object that is embeded in the div with id 'dwtcontrolContainer'
	if (DWObject) {
		DWObject.Viewer.width = 504;
		DWObject.Viewer.height = 599;
		DWObject.Viewer.on("pageAreaSelected", Dynamsoft_OnImageAreaSelected);
		DWObject.Viewer.on("pageAreaUnselected", Dynamsoft_OnImageAreaDeselected);
		DWObject.Viewer.on("topPageChanged", function (index) {
			DWObject.CurrentImageIndexInBuffer = index;
		});
		for (i = 0; i < OCRFindTextFlags.length; i++)
			document.getElementById("ddlFindTextFlags").options.add(new Option(OCRFindTextFlags[i].desc, i));
		for (i = 0; i < OCRFindTextAction.length; i++)
			document.getElementById("ddlFindTextAction").options.add(new Option(OCRFindTextAction[i].desc, i));
		for (i = 0; i < OCRLanguages.length; i++)
			document.getElementById("ddlLanguages").options.add(new Option(OCRLanguages[i].desc, i));
		for (i = 0; i < OCROutputFormat.length; i++)
			document.getElementById("ddlOCROutputFormat").options.add(new Option(OCROutputFormat[i].desc, i));
		for (i = 0; i < OCRRecognitionModule.length; i++)
			document.getElementById("ddlOCRRecognitionModule").options.add(new Option(OCRRecognitionModule[i].desc, i));
		for (i = 0; i < OCRPDFVersion.length; i++)
			document.getElementById("ddlPDFVersion").options.add(new Option(OCRPDFVersion[i].desc, i));
		for (i = 0; i < OCRPDFAVersion.length; i++)
			document.getElementById("ddlPDFAVersion").options.add(new Option(OCRPDFAVersion[i].desc, i));

		document.getElementById("ddlPDFVersion").selectedIndex = 6;
	}
}

function Dynamsoft_OnImageAreaSelected(index, rect) {
	if (rect.length > 0) {
        var currentRect = rect[rect.length - 1];
		if (arySelectedAreas.length + 2 > rect.length)
			arySelectedAreas[rect.length - 1] = [index, currentRect.x, currentRect.y, currentRect.x + currentRect.width, currentRect.y + currentRect.height, rect.length];
		else
			arySelectedAreas.push(index, currentRect.x, currentRect.y, currentRect.x + currentRect.width, currentRect.y + currentRect.height, rect.length);
		_iZone = "[";
		for (var i = 0; i < arySelectedAreas.length; i++) {
			_iZone += "[" + arySelectedAreas[i][1] + ', ' + arySelectedAreas[i][2] + ', ' + arySelectedAreas[i][3] + ', ' + arySelectedAreas[i][4] + "]";
			if (i < arySelectedAreas.length - 1)
				_iZone += ",";
		}
		_iZone += "]";
		document.getElementById("ddlOCROutputFormat").options[5].disabled = true;
		document.getElementById("ddlOCROutputFormat").options[6].disabled = true;
		if (document.getElementById("ddlOCROutputFormat").selectedIndex > 4)
			document.getElementById("ddlOCROutputFormat").selectedIndex = 4;
		SetIfUseRedaction();
	}
}

function Dynamsoft_OnImageAreaDeselected(index) {
	arySelectedAreas = [];
	document.getElementById("ddlOCROutputFormat").options[5].disabled = false;
	document.getElementById("ddlOCROutputFormat").options[6].disabled = false;
	_iZone = "[]";
}

function AcquireImage() {
	if (DWObject) {
		DWObject.SelectSource(function () {
			var OnAcquireImageSuccess, OnAcquireImageFailure;
			OnAcquireImageSuccess = OnAcquireImageFailure = function () {
				DWObject.CloseSource();
			};
			DWObject.OpenSource();
			DWObject.IfDisableSourceAfterAcquire = true;
			DWObject.AcquireImage(OnAcquireImageSuccess, OnAcquireImageFailure);
		}, function () {
			console.log('SelectSource failed!');
		});
	}
}

function LoadImages() {
	if (DWObject) {
		if (DWObject.Addon && DWObject.Addon.PDF) {
			DWObject.Addon.PDF.SetResolution(300);
			DWObject.Addon.PDF.SetConvertMode(Dynamsoft.DWT.EnumDWT_ConvertMode.CM_RENDERALL);
		}
		DWObject.LoadImageEx('', 5,
			function () {
			},
			function (errorCode, errorString) {
				alert('Load Image:' + errorString);
			}
		);
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
	if (DWObject) {
		if (DWObject.HowManyImagesInBuffer == 0) {
			alert("Please scan or load an image first.");
			return;
		}
		document.getElementById("spOCRResult").style.display = "none";
		document.getElementById("OCRing").style.display = "";
		document.getElementById('id_OCRBtn').style.display = "none";
		var OnSuccess = function (httpResponse) {
			document.getElementById("OCRing").style.display = "none";
			document.getElementById('id_OCRBtn').style.display = "";
		};


		var OnFailure = function (errorCode, errorString, httpResponse) {
			document.getElementById("OCRing").style.display = "none";
			document.getElementById('id_OCRBtn').style.display = "";
			if (errorCode != -2003) {
				alert(errorString);
				return;
			}
			var outPutFile, response = "", result, bRet = '', strErrorDetail, aryErrorDetailList, i;
			var pos = httpResponse.indexOf("|#|");
			if (pos < 0)
				response = httpResponse;
			else {
				if (pos > 0)
					outPutFile = httpResponse.substring(0, pos);

				if (httpResponse && httpResponse.length > 3)
					response = httpResponse.substring(pos + 3, httpResponse.length);
			}
			var bShowDownloadLink = true;
			if (outPutFile && outPutFile.length > 0) {
				try {
					result = JSON.parse(response);
					if (result && result.message) {
						bShowDownloadLink = false;
						strErrorDetail = "<p><strong>" + result.message + "</strong>";
						aryErrorDetailList = result.errorList;
						if (aryErrorDetailList && aryErrorDetailList.length > 0) {
							strErrorDetail = strErrorDetail + "<br />Error lists:<br />";
							for (i = 0; i < aryErrorDetailList.length; i++) {
								if (i > 0)
									strErrorDetail += ";";
								strErrorDetail += "[" + (i + 1) + "]." + aryErrorDetailList[i].input + ": " + aryErrorDetailList[i].message + '<br />';
							}
							bRet = strErrorDetail + "</p>";
						} else {
							bRet = strErrorDetail + "</p><p>The result is:<br />";
							var resultDetails = JSON.parse(_Function_DecodeXmlString(result.resultDetail))[0];
							Dynamsoft.Lib.each(resultDetails, function (value, key) {
								bRet += value.letter;
							});
							bRet += "</p>";
						}
					}
				}
				catch (exp) {
					var index = 0;
					while (index != -1) {
						index = response.indexOf('"letter":"', index) + 10;
						if (index == 9)
							break;
						bRet += response[index];
					}
				}
				document.getElementById('divNoteMessage').innerHTML = bRet;
				if (bShowDownloadLink) {
					var downloadURL = GetDownloadURL(outPutFile);
					if (downloadURL) {
						var dOCRResult = document.getElementById("spOCRResult");
						if (dOCRResult) {
							dOCRResult.style.display = "";
							var aOCRResult = document.getElementById("aOCRResult");
							if (aOCRResult) {
								aOCRResult.href = downloadURL;
							}
						}
					}
				}
			}
			else {
				result = JSON.parse(response);
				if (result && result.message) {
					strErrorDetail = result.message;
					aryErrorDetailList = result.errorList;
					if (aryErrorDetailList && aryErrorDetailList.length > 0) {
						strErrorDetail = strErrorDetail + "<br />Error lists:<br />";
						for (i = 0; i < aryErrorDetailList.length; i++) {
							if (i > 0)
								strErrorDetail += ";";
							strErrorDetail += "[" + (i + 1) + "]." + aryErrorDetailList[i].input + ": " + aryErrorDetailList[i].message + '<br />';
						}
					}
					document.getElementById('divNoteMessage').innerHTML = '<p>' + strErrorDetail + '</p>';
				}
				else
					document.getElementById('divNoteMessage').innerHTML = "OCR failed!";
			}
		};

		var date = new Date();
		var strFilePath = date.getFullYear() + "_" + (date.getMonth() + 1) + "_" + date.getDate() + "_" + date.getHours() + "_" + date.getMinutes() + "_" + date.getSeconds() + "_" + date.getMilliseconds() + ".pdf";

		var strHTTPServer = location.hostname;
		DWObject.IfSSL = Dynamsoft.Lib.detect.ssl;
		var _strPort = location.port == "" ? 80 : location.port;
		if (Dynamsoft.Lib.detect.ssl == true)
			_strPort = location.port == "" ? 443 : location.port;
		DWObject.HTTPPort = _strPort;

		var strActionPage = CurrentPath + "SaveToOCR.jsp";

		strHTTPServer = location.hostname;

		DWObject.ClearAllHTTPFormField();
		var outputFormat = OCROutputFormat[document.getElementById("ddlOCROutputFormat").selectedIndex].val;
		DWObject.SetHTTPFormField("OutputFormat", outputFormat);
		DWObject.SetHTTPFormField("RequestBody", GetRequestBody());
		if (document.getElementById("ddlOCROutputFormat").selectedIndex == 4) {
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
	strRequestBody += "\"productKey\": \"" + Dynamsoft.DWT.ProductKey + "\",";
	strRequestBody += "\"inputFile\":[\"******\"],";
	strRequestBody += "\"useBase64\":true,";
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
	strRequestBody += "\"zones\": " + _iZone + ",";  //"\"zones\": [[100,100,200,300],[100,600,100,200]],";

	strRequestBody += "\"outputFile\": \"$$$$$$\"";
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
	if (Dynamsoft.Lib.detect.ssl == true) {
		_strPort = location.port == "" ? 443 : location.port;
		downloadURLTemp = "https://";
	}
	else
		downloadURLTemp = "http://";

	var strDownloadPage = CurrentPath + "UploadedImages/" + filename;

	downloadURLTemp = downloadURLTemp + location.hostname + ":" + _strPort + strDownloadPage;

	return downloadURLTemp;
}

function RemoveSelected() {
	if (DWObject) {
		DWObject.RemoveAllSelectedImages();
	}
}


/* Base 64 */
var _ConstValue_Base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var _ConstValue_Base64DecodeChars = new Array(
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
	52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
	-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
	15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
	-1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
	41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

function _Function_Base64Encode(str) {
	var out, i, len;
	var c1, c2, c3;

	len = str.length;
	i = 0;
	out = "";
	while (i < len) {
		c1 = str.charCodeAt(i++) & 0xff;
		if (i == len) {
			out += _ConstValue_Base64EncodeChars.charAt(c1 >> 2);
			out += _ConstValue_Base64EncodeChars.charAt((c1 & 0x3) << 4);
			out += "==";
			break;
		}
		c2 = str.charCodeAt(i++);
		if (i == len) {
			out += _ConstValue_Base64EncodeChars.charAt(c1 >> 2);
			out += _ConstValue_Base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
			out += _ConstValue_Base64EncodeChars.charAt((c2 & 0xF) << 2);
			out += "=";
			break;
		}
		c3 = str.charCodeAt(i++);
		out += _ConstValue_Base64EncodeChars.charAt(c1 >> 2);
		out += _ConstValue_Base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
		out += _ConstValue_Base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
		out += _ConstValue_Base64EncodeChars.charAt(c3 & 0x3F);
	}
	return out;
}

function _Function_Base64Decode(str) {
	var c1, c2, c3, c4;
	var i, len, out;

	len = str.length;
	i = 0;
	out = "";
	while (i < len) {
		/* c1 */
		do {
			c1 = _ConstValue_Base64DecodeChars[str.charCodeAt(i++) & 0xff];
		} while (i < len && c1 == -1);
		if (c1 == -1)
			break;

		/* c2 */
		do {
			c2 = _ConstValue_Base64DecodeChars[str.charCodeAt(i++) & 0xff];
		} while (i < len && c2 == -1);
		if (c2 == -1)
			break;

		out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

		/* c3 */
		do {
			c3 = str.charCodeAt(i++) & 0xff;
			if (c3 == 61)
				return out;
			c3 = _ConstValue_Base64DecodeChars[c3];
		} while (i < len && c3 == -1);
		if (c3 == -1)
			break;

		out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

		/* c4 */
		do {
			c4 = str.charCodeAt(i++) & 0xff;
			if (c4 == 61)
				return out;
			c4 = _ConstValue_Base64DecodeChars[c4];
		} while (i < len && c4 == -1);
		if (c4 == -1)
			break;
		out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
	}
	return out;
}

function _Function_UTF16To8(str) {
	var out, i, len, c;

	out = "";
	len = str.length;
	for (i = 0; i < len; i++) {
		c = str.charCodeAt(i);
		if ((c >= 0x0001) && (c <= 0x007F)) {
			out += str.charAt(i);
		} else if (c > 0x07FF) {
			out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
			out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
		} else {
			out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
		}
	}
	return out;
}

function _Function_UTF8To16(str) {
	var out, i, len, c;
	var char2, char3;

	out = "";
	len = str.length;
	i = 0;
	while (i < len) {
		c = str.charCodeAt(i++);
		switch (c >> 4) {
			case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
				// 0xxxxxxx
				out += str.charAt(i - 1);
				break;
			case 12: case 13:
				// 110x xxxx   10xx xxxx
				char2 = str.charCodeAt(i++);
				out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
				break;
			case 14:
				// 1110 xxxx  10xx xxxx  10xx xxxx
				char2 = str.charCodeAt(i++);
				char3 = str.charCodeAt(i++);
				out += String.fromCharCode(((c & 0x0F) << 12) |
					((char2 & 0x3F) << 6) |
					((char3 & 0x3F) << 0));
				break;
		}
	}

	return out;
}


function _Function_EncodeXmlString(strSrcString) {
	return _Function_Base64Encode(_Function_UTF16To8(strSrcString));
}

function _Function_DecodeXmlString(strSrcString) {
	return _Function_UTF8To16(_Function_Base64Decode(strSrcString));
}