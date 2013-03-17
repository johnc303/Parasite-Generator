var STAT_BAR_RENDERER =
{
	strObjID : "The cabal overview renderer",

	_strStandardStatBarTemplateID : "cabalStatBarC",

	getPercentageRangeClass : function (_floWhatPercentage)
	{
		if (_floWhatPercentage <= 10)
		{
			return "percentRange0_10C";
		}
		if (_floWhatPercentage <= 20)
		{
			return "percentRange11_20C";
		}
		if (_floWhatPercentage <= 30)
		{
			return "percentRange21_30C";
		}
		if (_floWhatPercentage <= 40)
		{
			return "percentRange31_40C";
		}
		if (_floWhatPercentage <= 50)
		{
			return "percentRange41_50C";
		}
		if (_floWhatPercentage <= 60)
		{
			return "percentRange51_60C";
		}
		if (_floWhatPercentage <= 70)
		{
			return "percentRange61_70C";
		}
		if (_floWhatPercentage <= 80)
		{
			return "percentRange71_80C";
		}
		if (_floWhatPercentage <= 90)
		{
			return "percentRange81_90C";
		}
		return "percentRange91_100C";
	},

	getStatBar : function (_floPercentageFilled, _strColourClass, _strHeightClass, _booShowRangeMarkers, _floOptionalInitialValuePercentage, _floInitialValue)
	{
		var _htmStatBar = TEMPLATE_MANANGER.getTemplate(this._strStandardStatBarTemplateID).htmData;

		_htmStatBar = _htmStatBar.replace(/XX_BAR_COLOUR_XX/g, _strColourClass);
		_htmStatBar = _htmStatBar.replace(/XX_BAR_HEIGHT_XX/g, _strHeightClass);

		if (_booShowRangeMarkers)
		{
			_htmStatBar = _htmStatBar.replace(/XX_USING_RANGE_MARKERS_XX/g, "rangeMarkersPresentC");
			_htmStatBar = _htmStatBar.replace(/XX_RANGE_MARKERS_XX/g, this._getRangedMarkers());
		}
		else
		{
			_htmStatBar = _htmStatBar.replace(/XX_USING_RANGE_MARKERS_XX/g, "");
			_htmStatBar = _htmStatBar.replace(/XX_RANGE_MARKERS_XX/g, "");
		}

		if (_floPercentageFilled < 0)
		{
			_floPercentageFilled = Math.abs(_floPercentageFilled);
			_htmStatBar = _htmStatBar.replace(/XX_IS_NEGATIVE_XX/g, "negativeBarC");
		}
		else
		{
			_htmStatBar = _htmStatBar.replace(/XX_IS_NEGATIVE_XX/g, "");
		}

		_htmStatBar = _htmStatBar.replace(/XX_BAR_PERCENTAGE_RANGE_XX/g, this.getPercentageRangeClass(_floPercentageFilled));

		_htmStatBar = _htmStatBar.replace(/class="statBarInnerC"/g, 'class="statBarInnerC" style="width:' + _floPercentageFilled + '%;"');

		if (_floOptionalInitialValuePercentage)
		{
			_htmStatBar = _htmStatBar.replace(/XX_INITIAL_VALUE_MARKER_XX/g, "<span class='initialStatValueMarkerC' title='Base value: " + _floInitialValue + "' style='left: " + _floOptionalInitialValuePercentage + "%'></span>");
		}
		else
		{
			_htmStatBar = _htmStatBar.replace(/XX_INITIAL_VALUE_MARKER_XX/g, "");
		}

		return _htmStatBar;
	},

	_getRangedMarkers : function()
	{
		var _htmRangeMarkers = "";
		_htmRangeMarkers += "<span class='twentyFivePercentMarkerC'></span>";
		_htmRangeMarkers += "<span class='fiftyPercentMarkerC'></span>";
		_htmRangeMarkers += "<span class='seventyFivePercentMarkerC'></span>";
		return _htmRangeMarkers;
	}
}

EM.register(STAT_BAR_RENDERER);