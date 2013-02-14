var PARASITE_GENERATOR =
{
	strObjID : "The parasite generator",

	_objCurrDOM : null,

	_intCurrMaxResultLength : null,

	_arrD20Results : ["-5", "-4", "-3", "-2", "-2", "-1", "-1", "-1", "0", "0", "0", "0", "1", "1", "1", "2", "2", "3", "4", "5"],

	handleEvent_primeDOMReferences : function (_objWhatDOM)
	{
		this._objCurrDOM = _objWhatDOM;
	},

	handleEvent_generateNewParasite : function()
	{
		var _htmParasiteReport = this._generateParasite();
		var _domReportWrapper = this._objCurrDOM.getElementById("outputHolderL");
		_domReportWrapper.innerHTML = _htmParasiteReport;
	},

	_generateParasite : function ()
	{
		var _objResults = this._rollTables();
		var _htmReport = this._generateReport(_objResults);
		return _htmReport;
	},

	_rollTables : function ()
	{
		var _objResultsTables = [];
		var count = 0;
		while (count < ARR_GENERATION_SEQUENCE.length)
		{
			var _strCurrTableKey = ARR_GENERATION_SEQUENCE[count];
			var _objCurrTable = OBJ_PARASITE_DATA[_strCurrTableKey];

			this._intCurrMaxResultLength = ARR_UNIQUE_ENTRIES[count];

			var _arrResults = this._rollTable(_objCurrTable, []);

			_objResultsTables[_strCurrTableKey] = _arrResults;
			count++;
		}
		return _objResultsTables;
	},

	_rollTable : function (_objWhatTable, _arrCurrentResults)
	{
		var _strD20RollAsKey = this.rollD20AsLookup();
		var _strResult = _objWhatTable[_strD20RollAsKey];

		// If its not in the list
		if (_arrCurrentResults.indexOf(_strResult) == -1)
		{
			_arrCurrentResults.push(_strResult);

			var _intAdditionalRolls = 0;

			if (_strResult.indexOf("Roll thrice") > -1)
			{
				_intAdditionalRolls = 3;
				_arrCurrentResults.pop();
			}
			if (_strResult.indexOf("Roll twice") > -1)
			{
				_intAdditionalRolls = 2;
				_arrCurrentResults.pop();
			}

			if (_intAdditionalRolls > 0)
			{
				var count = 0;
				while (count < _intAdditionalRolls)
				{
					this._rollTable(_objWhatTable, _arrCurrentResults);
					count++;
				}
			}
		}
		else if (_arrCurrentResults.length < this._intCurrMaxResultLength)
		{
			this._rollTable(_objWhatTable, _arrCurrentResults);
		}

		return _arrCurrentResults;
	},

	_generateReport : function (_objResults)
	{
		var _htmReport = "";
		for (var _strCurrReport in _objResults)
		{
			_htmReport += "<h2>" + _strCurrReport + ": ";

			var _arrCurrResults = _objResults[_strCurrReport];
			if (_arrCurrResults.length > 1)
			{
				var _strFinalResult = _arrCurrResults.pop();
				_htmReport += "<span>" + _arrCurrResults.join(", ") + " & " + _strFinalResult + "</span>";
			}
			else
			{
				_htmReport += "<span>" + _arrCurrResults[0] + "</span>";
			}

			_htmReport += "</h2>";
		}
		return _htmReport;
	},

	rollD20AsLookup : function()
	{
		var _intRoll = this.getRandomFromRange(0, this._arrD20Results.length - 1);
		var _strModifierIndex = this._arrD20Results[_intRoll];

		return _strModifierIndex;
	},

	getRandomFromRange : function (_intFrom, _intTo, _intDecimalPlaces)
	{
		var _floRandom = Math.random() * (_intTo - _intFrom + 1) + _intFrom;
		if (!_intDecimalPlaces)
		{
			return Math.floor(_floRandom);
		}
		else
		{
			return parserFloat(_floRandom.toFixed(_intDecimalPlaces));
		}
	},

	booTerminal : true
}
EM.register(PARASITE_GENERATOR)