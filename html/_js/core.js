var CORE =
{
	strObjID : "The core object",

	_objCurrDOM : null,

	objCabalsData :
	{
		strID : "Cabal base data file",
		arrCabals: [],
		intActionSetIndex : 0
	},

	arrRawCabalData : [],

	_strIterationHolderID : "iterationCountHolderL",

	handleEvent_primeDOMReferences : function (_objWhatDOM)
	{
		this._objCurrDOM = _objWhatDOM;
	},

	handleEvent_htmlTemplatesLoadedAndCollected : function ()
	{
	},

	handleEvent_cabalDataUpdated : function (_arrWhatCabalDataWrappers)
	{
		this.objCabalsData.arrCabals = _arrWhatCabalDataWrappers;
		this.arrRawCabalData = [];
		var count = 0;
		while (count < _arrWhatCabalDataWrappers.length)
		{
			this.arrRawCabalData.push(_arrWhatCabalDataWrappers[count].objRaw);
			count++;
		}
	},

	setActionSetIndex : function (_intNewActionSetIndex)
	{
		this.objCabalsData.intActionSetIndex = _intNewActionSetIndex;
		this._updateIterationHolder();
	},

	init : function ()
	{
		//alert("Hello world!")
		var _arrCabalData = CABAL_DATA_IMPORTER.regenerateCabalsFromString(strCombinedCabalData);
		var _arrCabalDataWrappers = DATA_IO.addDataWrappers(_arrCabalData);
		EM.trigger("cabalDataUpdated", _arrCabalDataWrappers);
		EM.trigger("switchToTab", 1);

		if (this._objCurrDOM.location.protocol != "file:")
		{
			EM.trigger("ioAction", "loadLatestData");
		}
	},

	iterateActionSetIndex : function ()
	{
		this.objCabalsData.intActionSetIndex++;
		this._updateIterationHolder();
	},

	getActiveCabalIndexs : function (_arrWhatCabalsData, _intOptionalFilter, _booExcludeTurnedCabals)
	{
		var _arrActiveIndexs = [];
		var count = 0;
		while (count < _arrWhatCabalsData.length)
		{
			var _objCurrCabalDataWrapper = _arrWhatCabalsData[count];
			if ((_objCurrCabalDataWrapper.isValidTarget()) && (_objCurrCabalDataWrapper.intCabalIndex != _intOptionalFilter))
			{
				if (((_booExcludeTurnedCabals) && (_objCurrCabalDataWrapper.objRaw.strStatus != "Turned")) || (!_booExcludeTurnedCabals))
				{
					_arrActiveIndexs.push(count);
				}
			}
			count++;
		}
		return _arrActiveIndexs;
	},

	getDestroyedCabalsCount : function (_arrWhatCabalsData)
	{
		var _intDestroyedCabals = 0;
		var count = 0;
		while (count < _arrWhatCabalsData.length)
		{
			var _objCurrCabalDataWrapper = _arrWhatCabalsData[count];
			if (!_objCurrCabalDataWrapper.isValidTarget())
			{
				_intDestroyedCabals++;
			}
			count++;
		}
		return _intDestroyedCabals;
	},

	cloneObject : function (_objWhatTemplate)
	{
		var _objClone = {};
		for (var _strCurrIndex in _objWhatTemplate)
		{
			//this.debug("_strPropType: " + _strPropType, 1);
			var _strPropType = typeof _objWhatTemplate[_strCurrIndex];
			switch (_strPropType)
			{
				case "function":
					this.debug("ERROR: CORE.cloneObject(), object property with a typeof == 'function' found. Do not pass complex objects with functions to this method.", 3);
				break;
				case "object":
					if (_objWhatTemplate[_strCurrIndex] === null)
					{
						_objClone[_strCurrIndex] = null;
					}
					else if (_objWhatTemplate[_strCurrIndex] instanceof Array)
					{
						_objClone[_strCurrIndex] = this.cloneArray(_objWhatTemplate[_strCurrIndex]);
					}
					else
					{
						_objClone[_strCurrIndex] = this.cloneObject(_objWhatTemplate[_strCurrIndex]);
					}
				break;
				default:
					if (_strCurrIndex != "INT_CLONE_INDEX")
					{
						_objClone[_strCurrIndex] = _objWhatTemplate[_strCurrIndex];
					}
					else
					{
						_objClone[_strCurrIndex] = _objWhatTemplate[_strCurrIndex] + 1;
						_objWhatTemplate['INT_CLONED_INDEX']++;
					}
				break;
			}
		}
		return _objClone;
	},

	cloneArray : function (_arrWhatArray)
	{
		var _arrClone = [];
		var count = 0;
		while (count < _arrWhatArray.length)
		{
			var _strPropType = typeof _arrWhatArray[count];
			switch (_strPropType)
			{
				case "function":
					this.debug("ERROR: CORE.cloneArray(), array item with property typeof == 'function' found. Do not pass complex objects with functions to this method.", 3);
				break;
				case "object":
					if (_arrWhatArray[count] instanceof Array)
					{
						_arrClone[count] = this.cloneArray(_arrWhatArray[count]);
					}
					else
					{
						_arrClone[count] = this.cloneObject(_arrWhatArray[count]);
					}
				break;
				default:
					_arrClone[count] = _arrWhatArray[count];
				break;
			}
			count++;
		}
		return _arrClone;
	},

	cloneObjectToArray : function (_objWhatObject)
	{
		var _arrReturnArray = [];
		for (var strCurrKey in _objWhatObject)
		{
			_arrReturnArray.push(_objWhatObject[strCurrKey]);
		}
		return _arrReturnArray;
	},

	cancelBubbling : function (_objEvent)
	{
		var objEventHandler = _objEvent ? _objEvent:window.event;
		if (objEventHandler.stopPropagation)
		{
			objEventHandler.stopPropagation();
		}
		if (objEventHandler.cancelBubble!=null)
		{
			objEventHandler.cancelBubble = true;
		}
		return false;
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

	getElementsByClassName : function (_objWhatDOM, className, tag, elm)
	{
		if (_objWhatDOM.getElementsByClassName) {
			getElementsByClassName = function (_objWhatDOM, className, tag, elm) {
				elm = elm || _objWhatDOM;
				var elements = elm.getElementsByClassName(className),
					nodeName = (tag)? new RegExp("\\b" + tag + "\\b", "i") : null,
					returnElements = [],
					current;
				for(var i=0, il=elements.length; i<il; i+=1){
					current = elements[i];
					if(!nodeName || nodeName.test(current.nodeName)) {
						returnElements.push(current);
					}
				}
				return returnElements;
			};
		}
		else if (_objWhatDOM.evaluate) {
			getElementsByClassName = function (_objWhatDOM,className, tag, elm) {
				tag = tag || "*";
				elm = elm || _objWhatDOM;
				var classes = className.split(" "),
					classesToCheck = "",
					xhtmlNamespace = "http://www.w3.org/1999/xhtml",
					namespaceResolver = (_objWhatDOM.documentElement.namespaceURI === xhtmlNamespace)? xhtmlNamespace : null,
					returnElements = [],
					elements,
					node;
				for(var j=0, jl=classes.length; j<jl; j+=1){
					classesToCheck += "[contains(concat(' ', @class, ' '), ' " + classes[j] + " ')]";
				}
				try	{
					elements = _objWhatDOM.evaluate(".//" + tag + classesToCheck, elm, namespaceResolver, 0, null);
				}
				catch (e) {
					elements = _objWhatDOM.evaluate(".//" + tag + classesToCheck, elm, null, 0, null);
				}
				while ((node = elements.iterateNext())) {
					returnElements.push(node);
				}
				return returnElements;
			};
		}
		else {
			getElementsByClassName = function (_objWhatDOM,className, tag, elm) {
				tag = tag || "*";
				elm = elm || _objWhatDOM;
				var classes = className.split(" "),
					classesToCheck = [],
					elements = (tag === "*" && elm.all)? elm.all : elm.getElementsByTagName(tag),
					current,
					returnElements = [],
					match;
				for(var k=0, kl=classes.length; k<kl; k+=1){
					classesToCheck.push(new RegExp("(^|\\s)" + classes[k] + "(\\s|$)"));
				}
				for(var l=0, ll=elements.length; l<ll; l+=1){
					current = elements[l];
					match = false;
					for(var m=0, ml=classesToCheck.length; m<ml; m+=1){
						match = classesToCheck[m].test(current.className);
						if (!match) {
							break;
						}
					}
					if (match) {
						returnElements.push(current);
					}
				}
				return returnElements;
			};
		}
		return getElementsByClassName(_objWhatDOM, className, tag, elm);
	},

	cancelEventBubblingBubble : function (_objWhatEventData)
	{
		var objTheEvent = _objWhatEventData ? _objWhatEventData:window.event;
		if (objTheEvent.stopPropagation)
		{
			objTheEvent.stopPropagation();
		}

		if (objTheEvent.cancelBubble != null)
		{
			objTheEvent.cancelBubble = true;
		}
	},

	_updateIterationHolder : function ()
	{
		var _domIterationHolder = this._objCurrDOM.getElementById(this._strIterationHolderID);
		_domIterationHolder.innerHTML = this.objCabalsData.intActionSetIndex;
	},

/*
	randomSort : function (a, b)
	{
		var _floSeed = (Math.random() * 2) - 1;
		var _intResult = Math.round(_floSeed);
		return _intResult;
	},
*/

	debug : function (strMessage, intPriority, objCallerObject, booCalleeChain)
	{
		if (DEBUG)
		{
			DEBUG.lert(strMessage, intPriority, objCallerObject, booCalleeChain);
		}
	}
}


EM.register(CORE)

Array.prototype.shuffle = function()
{
  var i = this.length, j, tempi, tempj;
  if ( i == 0 )
  {
	  return this;
	}
  while ( --i )
  {
     j       = Math.floor( Math.random() * ( i + 1 ) );
     tempi   = this[i];
     tempj   = this[j];
     this[i] = tempj;
     this[j] = tempi;
  }
  return this;
}

Date.prototype.getHumanDate = function ()
{
	var _intHours = this.getHours();
	var _intMinutes = this.getMinutes();
	var _intSeconds = this.getSeconds();

	var _intDay = this.getDay();
	var _strDay = "";
	switch (_intDay)
	{
		case 0: _strDay = "Sunday"; break;
		case 1: _strDay = "Monday"; break;
		case 2: _strDay = "Tuesday"; break;
		case 3: _strDay = "Wednesday"; break;
		case 4: _strDay = "Thursday"; break;
		case 5: _strDay = "Friday"; break;
		case 6: _strDay = "Saturday"; break;
	}

	_strDay = _strDay.slice(0,3);

	var _intMonthDay = this.getDate();

	var _intModuloTen = _intMonthDay % 10;
	var _strDayOfMonthSuffix = "th";
	if ((_intMonthDay < 4) || (_intMonthDay > 20))
	{
		if (_intModuloTen < 4)
		{
			switch (_intModuloTen)
			{
				case 1:
					_strDayOfMonthSuffix = "st";
				break;
				case 2:
					_strDayOfMonthSuffix = "nd";
				break;
				case 3:
					_strDayOfMonthSuffix = "rd";
				break;
			}
		}
	}

	var _strMonthDay = _intMonthDay + _strDayOfMonthSuffix;
	var _intMonth = this.getMonth();

	var _strMonth = "";
	switch (_intMonth)
	{
		case 0: _strMonth = "January"; break;
		case 1: _strMonth = "Febuary"; break;
		case 2: _strMonth = "March"; break;
		case 3: _strMonth = "April"; break;
		case 4: _strMonth = "May"; break;
		case 5: _strMonth = "June"; break;
		case 6: _strMonth = "July"; break;
		case 7: _strMonth = "August"; break;
		case 8: _strMonth = "September"; break;
		case 9: _strMonth = "October"; break;
		case 10: _strMonth = "November"; break;
		case 11: _strMonth = "December"; break;
	}

	_strMonth = _strMonth.slice(0,3);

	var _intYear = this.getFullYear();

	return _intHours.padToString(2) + ":" + _intMinutes.padToString(2) + ":" + _intSeconds.padToString(2) + ", on " + _strDay + " the " + _strMonthDay + " of " + _strMonth + ", " + _intYear;
}

Number.prototype.padToString = function(_intLeadingZeros)
{
	if (typeof(_intLeadingZeros) !== "number")
	{
		_intLeadingZeros = 2;
	}
	var _strNumber = String(this);
	while (_strNumber.length < _intLeadingZeros)
	{
		_strNumber = "0" + _strNumber;
	}
	return _strNumber;
}