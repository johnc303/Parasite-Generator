

var TEMPLATE_MANANGER =
{
	strObjID : "The HTML template fragement manager",
	strObjDescription : "This object is in charge of collecting and returning the HTML fragments required to build the course. If multiple fragments are found, the 3rd classname specified will be used to sub catergorize the elements",

	_strFragmentClassname : "templateFragmentC",
	_strContentFrameRef : "mainAreaF",
	_strTemplateFrameRef : "templateF",

	_strCurrOutputModeClass : "graphicalC",

	_objCurrDOM : null,

	_objTemplateFragments : {},

	_strTemplateCollectionID : "templateHolderL",

	_strCollectionLog : "",

	handleEvent_primeDOMReferences : function (_objWhatDOM)
	{
		this._objCurrDOM = _objWhatDOM;

		this._strCollectionLog = "";

		if (this._collectTemplates())
		{
			if (this._strCollectionLog != "")
			{
				alert("ERROR: Duplicate template fragments found in TEMPLATE_MANANGER.handleEvent_templatePageLoaded(), templates.js\n\nDuplicate fragments:" + this._strCollectionLog)
				//alert("TEMPLATE_MANANGER_DUPLICATE_FRAGMENTS_DETECTED_ERROR", [this._strCollectionLog]);

			}
			this._objCurrDOM.getElementById(this._strTemplateCollectionID).innerHTML = "";
			EM.trigger("htmlTemplatesLoadedAndCollected");
		}
		else
		{
			alert("ERROR: TEMPLATE_MANANGER._collectTemplates() has failed to find any template fragements. Load chain will fail, templates.js");
			//alert("TEMPLATE_MANANGER_MISSING_FRAGMENTS_ERROR");
		}
	},

	handleEvent_outputModeChanged : function (_objOutputChangeData)
	{
		this._strCurrOutputModeClass = _objOutputChangeData['strNewOutputMode'];
		//alert(this._strCurrOutputModeClass);
	},

	getTemplate : function (_strWhatTemplateName)
	{
		if (this._objTemplateFragments[_strWhatTemplateName])
		{
			// If there is a specific data fragment for the current outmode
			if (this._objTemplateFragments[_strWhatTemplateName][this._strCurrOutputModeClass])
			{
				return this._objTemplateFragments[_strWhatTemplateName][this._strCurrOutputModeClass];
			}
			else	// Otherwise return the generic one.
			{
				return this._objTemplateFragments[_strWhatTemplateName]['generic'];
			}
		}
		alert("ERROR: Unknown template requested, template ref: " + _strWhatTemplateName + ". TEMPLATE_MANANGER.getTemplate(), templates.js");
		return false;
	},

	_collectTemplates : function ()
	{
		if (this._objCurrDOM)
		{
			var _arrTemplateFragments = CORE.getElementsByClassName(this._objCurrDOM, this._strFragmentClassname);
			if (_arrTemplateFragments.length > 0)
			{
				var count =  0;
				while (count < _arrTemplateFragments.length)
				{
					this._addTemplateFragement(_arrTemplateFragments[count]);
					count++;
				}
				return true;
			}
			else
			{
				return false;
			}
		}
		else
		{
			return false;
		}
	},

	_addTemplateFragement : function (_domWhatTemplateFragment)
	{
		var _arrFragmentClasses = _domWhatTemplateFragment.className.split(" ");
		var _strFragmentID = _arrFragmentClasses[1];

		if (_arrFragmentClasses[2])
		{
			var _strSubType = _arrFragmentClasses[2];
		}
		else
		{
			var _strSubType = false;
		}

		var _htmFragmentData = _domWhatTemplateFragment.innerHTML;

		_htmFragmentData = this._replaceTemplateIDPrefixes(_htmFragmentData);

		if (!this._objTemplateFragments[_strFragmentID])
		{
			this._objTemplateFragments[_strFragmentID] = {};
		}

		if (!_strSubType)
		{
			if (this._objTemplateFragments[_strFragmentID]['generic'])
			{
				this._strCollectionLog += "\n\n* _strFragmentID: " + _strFragmentID + "\n  _strSubType:" + _strSubType;
			}
			this._objTemplateFragments[_strFragmentID]['generic'] = new TemplateFragment(_strFragmentID, _strSubType, _htmFragmentData);
			//this._objTemplateFragments[_strFragmentID]['generic'].htmData = LOCALISER.parseForLocalisableMarkup(this._objTemplateFragments[_strFragmentID]['generic'].htmData);
		}
		else
		{
			if (this._objTemplateFragments[_strFragmentID][_strSubType])
			{
				this._strCollectionLog += "\n\n* _strFragmentID: " + _strFragmentID + "\n  _strSubType:" + _strSubType;
			}
			this._objTemplateFragments[_strFragmentID][_strSubType] = new TemplateFragment(_strFragmentID, _strSubType, _htmFragmentData);
			//this._objTemplateFragments[_strFragmentID][_strSubType].htmData = LOCALISER.parseForLocalisableMarkup(this._objTemplateFragments[_strFragmentID][_strSubType].htmData);
		}
	},

	_replaceTemplateIDPrefixes : function(_htmFragmentData)
	{
		//YY_PREFIX_000_00_YY
		return _htmFragmentData.replace(/YY_PREFIX_\d{3}_\d{2}_YY/g, "");
	}
}

function TemplateFragment(_strFragmentID, _strSubType, _htmFragmentData)
{
	this.strObjID = _strFragmentID;
	this.strSubType = _strSubType;
	this.htmData = _htmFragmentData;
	this._preprocessFragment();
}

TemplateFragment.prototype =
{
	_preprocessFragment: function()
	{
		// Replaces the faked tag markup with proper tags.
		this.htmData = this.htmData.replace(/\[TAG\s([^\]]+)\]/g, "<$1>");

		// Replaces alt=XX_TEXT_XX with alt="XX_TEXT_XX"
		this.htmData = this.htmData.replace(/<[^>]+\s[^>]+>/g, function(_strMatch){ return _strMatch.replace(/(\w+=)(\w+)/g, "$1\"$2\""); });

		// Adds the onerror handler to images
		this.htmData = this.htmData.replace(/<img/g, "<img onerror=\"EM.trigger('imageLoadFailure', this)\"");
	}
}

EM.register(TEMPLATE_MANANGER)