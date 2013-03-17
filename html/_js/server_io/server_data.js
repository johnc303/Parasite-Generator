var SERVER_DATA =
{
	strName : "The server data object",
	strDescription : "Exposes specific calls to the PHP via server_io.js",

	//_strBasePath : "http://localhost/cabal_combat_sim/_php/",
	_strBasePath : "_php/",

	_strTestData : "1234 Testing Testing 1234",

	handleEvent_receiveServerGetDirectoryListing : function (_strWhatData)
	{
		var _objDirectoryListing = JSON.parse(_strWhatData);
		EM.trigger("serverDirectoryListingUpdated", _objDirectoryListing);
	},

	getDirectoryListing : function ()
	{
		SERVER_IO.sendRequestData("receiveServerGetDirectoryListing", "POST", this._strBasePath + "io.php?action=get_list", "");
		return false;
	},

	handleEvent_receiveServerGetFileData : function (_strWhatData)
	{
		var _objReturnData = JSON.parse(_strWhatData);
		EM.trigger("getFileDataCompleted", _objReturnData);
	},

	getFileData : function (_strWhatFilename)
	{
		SERVER_IO.sendRequestData("receiveServerGetFileData", "POST", this._strBasePath + "io.php?action=get_file&filename=" + _strWhatFilename, "");
		return false;
	},

	handleEvent_receiveServerSetFileData : function (_strWhatData)
	{
		var _objSaveSuccess = JSON.parse(_strWhatData);
		EM.trigger("setFileDataCompleted", _objSaveSuccess);
	},

	setFileData : function (_intIteration, _strWhatData)
	{
		if (!_strWhatData)
		{
			_strWhatData = this._strTestData;
		}
		SERVER_IO.sendRequestData("receiveServerSetFileData", "POST", this._strBasePath + "io.php?action=save_to_file&iteration=" + _intIteration, _strWhatData);
		return false;
	},


	handleEvent_receiveServerFileDeletionResult : function (_strWhatData)
	{
		var _objDeletionSuccess = JSON.parse(_strWhatData);
		EM.trigger("fileDeletionCompleted", _objDeletionSuccess);
	},

	deleteFile : function (_strWhatFilename)
	{
		SERVER_IO.sendRequestData("receiveServerFileDeletionResult", "POST", this._strBasePath + "io.php?action=recycle_file&filename=" + _strWhatFilename, "");
		return false;
	},

	debug : function (strMessage, intPriority, objCallerObject, booCalleeChain)
	{
		if (window['DEBUG'])
		{
			DEBUG.lert(strMessage, intPriority, objCallerObject, booCalleeChain);
		}
	},

	booTerminal : true
}

EM.register(SERVER_DATA);