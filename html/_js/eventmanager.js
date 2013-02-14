/*
NOTE: Events are progated in sequence of registry, the first object to be register will be the first tested. This generally
			means the frameset level objects take precedence.
*/
var EM =
{
	strObjID : "The event manager",
	_arrRegisteredObjects: [],

	register: function (_objWhatObject)
	{
		this._arrRegisteredObjects[this._arrRegisteredObjects.length] = _objWhatObject;
		this.debug("EM.register(_objWhatObject:)", 1, _objWhatObject);
	},

	unregister: function (_objWhatObject)
	{
		//this._arrRegisteredObjects[this._arrRegisteredObjects.length] = _objWhatObject;
		var count = 0;
		while (count < this._arrRegisteredObjects.length)
		{
			var _objCurrRegisteredObject = this._arrRegisteredObjects[count]
			if (_objCurrRegisteredObject === _objWhatObject)
			{
				delete this._arrRegisteredObjects[count];
			}
			count++;
		}
		this.debug("EM.register(_objWhatObject:)", 1, _objWhatObject);
	},

	trigger: function(_strEventName, _mixParam)
	{
		var _booTriggered = false;
		var _booBubbleUp = true;
		// Attempt to fire event on registered objects
		for (var i=0; i<this._arrRegisteredObjects.length; i++)
		{
			if (this._arrRegisteredObjects[i])
			{
				var _booResult = this.fireIfHandled(this._arrRegisteredObjects[i], _strEventName, _mixParam);
				if (_booResult)
				{
					_booTriggered = true;
				}
			}
		}
		if ((!_booTriggered) && (BOO_ALERT_UNHANDLED_EVENTS))
		{
			alert("WARNING: Unhandled event with the name of '" + _strEventName + "' found in EM.trigger(), eventmanager.js");
		}

		// Return false to prevent page reloads if the event was triggered from a link's onclick event.
		return false;
	},

	fireIfHandled: function(_obj, _strEventName, _mixParam)
	{
		if ((_obj) && (_obj['handleEvent_'+_strEventName]))
		{
			_obj['handleEvent_'+_strEventName](_mixParam);
			return true;
		}
		return false;
	},

	debug : function (strMessage, intPriority, objCallerObject, booCalleeChain)
	{
		if (DEBUG)
		{
			DEBUG.lert(strMessage, intPriority, objCallerObject, booCalleeChain);
		}
	}
}