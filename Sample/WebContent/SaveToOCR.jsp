<%@  page language="java" import="java.io.*,java.util.*,org.apache.commons.fileupload.*,org.apache.commons.fileupload.disk.*,org.apache.commons.fileupload.servlet.*,org.apache.http.*,org.apache.http.client.*,org.apache.http.entity.*"%><%!
%><%
	// Create a factory for disk-based file items
	DiskFileItemFactory factory = new DiskFileItemFactory();

	// Configure a repository (to ensure a secure temp location is used)
	ServletContext servletContext = this.getServletConfig().getServletContext();
	File repository = (File) servletContext.getAttribute("javax.servlet.context.tempdir");
	factory.setRepository(repository);


	// Set factory constraints
	factory.setSizeThreshold(1000000000);// Sets the size threshold beyond which files are written directly to disk.

	// Create a new file upload handler
	ServletFileUpload upload = new ServletFileUpload(factory);

	// Set overall request size constraint
	upload.setSizeMax(-1);


	// Parse the request
	List<FileItem> items = upload.parseRequest(request);

	// Process the uploaded items
	Iterator<FileItem> iter = items.iterator();
	
	String dir = application.getRealPath("/");
	String strOutputFormat = null;
	String strRequestBody = null;
	
	String strInputFile = null;
	long sizeInBytes = 0;
	FileItem fileItem = null;
		
	while (iter.hasNext()) {
		FileItem item = iter.next();
		// Process a regular form field
		String fieldName = item.getFieldName();
		if (item.isFormField()) {
			if(fieldName.equals("OutputFormat")){
				strOutputFormat = item.getString();
			}else if(fieldName.equals("RequestBody")){
				strRequestBody = item.getString();
			}
		} 
		// Process a file upload
		else {			
			sizeInBytes = item.getSize();
			if(fieldName.equals("RemoteFile") && sizeInBytes!=0){
				strInputFile = item.getName();
				fileItem = item;
			}
		}
	}

	if (fileItem != null && strOutputFormat != null && strRequestBody != null) {
		strInputFile = dir + "\\UploadedImages\\" + strInputFile;
		strRequestBody = strRequestBody.replace("******", strInputFile.replaceAll("\\\\","\\\\\\\\"));
		File uploadedFile = new File(strInputFile);
		if(uploadedFile.exists())
			uploadedFile.delete();
		boolean result = uploadedFile.createNewFile();
		try {
			if(result){
				fileItem.write(uploadedFile);
				String outPutFile = strInputFile;
				int pos = outPutFile.indexOf(".pdf");
				String _type = ".pdf";
				
				if(strOutputFormat.equals("TXTS")){
					_type = ".txt";

				} else if(strOutputFormat.equals("TXTF")){
					_type = ".rtf";

				} else if(strOutputFormat.equals("TXTCSV")){
					_type = ".csv";

				} else if(strOutputFormat.equals("XML")){
					_type = ".xml";

				} else if(strOutputFormat.equals("IOTPDF") || strOutputFormat.equals("IOTPDF_MRC")){
					_type = ".pdf";

				}
				if (pos > 0)
					outPutFile = strInputFile.substring(0, pos) + "_1" + _type;
				strRequestBody = strRequestBody.replace("$$$$$$", outPutFile.replaceAll("\\\\","\\\\\\\\"));

				String strResponse = "";

				// upload
				strResponse = org.apache.http.client.fluent.Request.Post("http://127.0.0.1:18622/dwt/dwt_16200112/OCRPro")
						.useExpectContinue()
						.version(HttpVersion.HTTP_1_1)
						.addHeader("User-Agent", "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.7 Safari/537.36")
						.bodyString(strRequestBody, ContentType.DEFAULT_TEXT)
						.execute()
						.returnContent()
						.asString();
						
				out.write(outPutFile);
				out.write("|#|");
				out.write(strResponse);
				out.flush();
			}
		} 
		catch (Exception e) {
			e.printStackTrace();
		}
	}
%>
