"use strict";
var iam = (function() {

	var zeroPad = function(number, width) {
		if(width === undefined)
			width = 1;

		var paddedResult = "" + number;

		while (width > paddedResult.length)
			paddedResult = "0" + paddedResult;

		return paddedResult;
	};
    var formatDateYYYYMMDD = function(date, separator) {
    		if(separator === undefined)
    			separator = '/';

    		var MM = zeroPad(date.getMonth() + 1, 2);
    		var DD = zeroPad(date.getDate(), 2);
    		var YYYY = date.getFullYear();

    		return YYYY + separator + MM + separator + DD;
    };

    var formatDateMMDDYYYY = function(date, separator) {
    		if(separator === undefined)
    			separator = '/';

    		var MM = zeroPad(date.getMonth() + 1, 2);
    		var DD = zeroPad(date.getDate(), 2);
    		var YYYY = date.getFullYear();

    		return MM + separator + DD + separator + YYYY;
    };

    var zeroPad = function(number, width) {
    		if(width === undefined)
    			width = 1;

    		var paddedResult = "" + number;

    		while (width > paddedResult.length)
    			paddedResult = "0" + paddedResult;

    		return paddedResult;
    };
    
    return { //exposed to public

    	isValidDate: function(date) {
    		var isValid = true;
            
    		if (this.isBlank(date))
    			isValid = false;
    		else if (isNaN((new Date(date)).getYear())) 
    			isValid = false;

    		return isValid;
    	},

    	isBlank: function(x) {
    		return (x === undefined) || (x === "") || (x === null);
    	},

    	getFormattedDateOrEmptyString: function(date, format, separator) {
    		if(format === undefined)
    			format = 'MMDDYYYY';

    		if(separator === undefined)
    			separator = '/';

    		if (!this.isValidDate(date))
    			return "";
    		else if (format == "YYYYMMDD")
    			return formatDateYYYYMMDD(new Date(date), separator);
    		else if (format == "MMDDYYYY")
    			return formatDateMMDDYYYY(new Date(date), separator);

    		return YYYY + separator + MM + separator + DD;
    	},

    }
}());