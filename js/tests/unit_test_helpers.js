module("helperTests");

var numberOfDays = 1 * 365;
var day = 1000*60*60*24;
var dateSamples = [];

function generateDateSamples() {
	var startingDate = new Date("1/1/2013");
	for (var ii=0; ii < numberOfDays; ii++) {
		var nextDay = new Date(startingDate.getTime() + (day * ii)); 
		dateSamples.push(nextDay.getMonth()+ 1 + '/' + nextDay.getDate() + '/' + nextDay.getFullYear());
    }
}
generateDateSamples();

var fail = function(message) {
    return { 
        passed: false, 
        message: message
    };
}

var pass = function(message) {
    return { 
        passed: true, 
        message: message
    };
}

function runForEachDate(testFunction) {
    if (typeof testFunction !== "function")
        throw new Error("Invalid test function provided");
    
    for (var ii=0; ii < dateSamples.length; ii++) {
		var sample = dateSamples[ii];
		var result = testFunction(sample);
		ok(result.passed, result.message);
    }
}

test('validateTaskName : Valid Name', function() {
    var result = ToDo.validateTaskName('Task Name');
    equal(result, true, "validateTaskName was " + result + " expected true");
});

test('validateTaskName : Invalid Name', function() {
    var result = ToDo.validateTaskName('');
    equal(result, false, "validateTaskName was " + result + " expected false");
});

test('validateTaskName : Undefined Name', function() {
    var result = ToDo.validateTaskName();
    equal(result, false, "validateTaskName was " + result + " expected false");
});

test('validateStatus : Valid Status', function() {
    var result = ToDo.validateStatus('A');
    equal(result, true, "validateStatus was " + result + " expected true");
});

test('validateStatus : Invalid Status', function() {
    var result = ToDo.validateStatus('');
    equal(result, false, "validateStatus was " + result + " expected false");
});

test('validateStatus : Undefined Status', function() {
    var result = ToDo.validateStatus();
    equal(result, false, "validateStatus was " + result + " expected false");
});

test('isBlank : Valid Not Blank', function() {
    var result = ToDo.isBlank('Not Blank');
    equal(result, false, "isBlank was " + result + " expected false");
});

test('isBlank : inValid Blank', function() {
    var result = ToDo.isBlank('');
    equal(result, true, "isBlank was " + result + " expected true");
});

test('isBlank : inValid Not Defined', function() {
    var result = ToDo.isBlank();
    equal(result, true, "isBlank was " + result + " expected true");
});

test("Is A Valid Padded Number", function() {
    for (var ii=1; ii <= 4; ii++) {
		for (var jj=0; jj <= 9; jj++) {
			var result = pass(jj + " is properly padded");
			var paddedResult = ToDo.zeroPad(jj, ii);
			if (paddedResult.length != ii)
				result = fail(jj + " is not properly padded to " + ii + " characters (" + paddedResult + ")");
			ok(result.passed, result.message);
		}
	}
});
                    
test("Is A Valid Date", function() {
    runForEachDate(function(sample) {        
        result = pass(sample + " is a valid date object");
        if (!ToDo.isValidDate(sample))
            result = fail(sample + " is not a valid date (" + sample + ")");
        return result;
    });
});

test("Is A Valid Date Field", function() {
    runForEachDate(function(sample) {        
        result = pass(sample + " is a valid date field value");
        if (!ToDo.validateDate(sample))
            result = fail(sample + " is not a valid date field value (" + sample + ")");
        return result;
    });
});

test("Is A Formatted (MM/DD/YYYY) Date Field", function() {
    runForEachDate(function(sample) {        
		var formattedDate = ToDo.getFormattedDateOrEmptyString(sample);
		var originalDate = new Date(sample);
		var dateStringSegments = formattedDate.split("/");

        result = pass(sample + " is a valid formatted (MM/DD/YYYY) date field value");
	    if (formattedDate.length != 10) 
            result = fail(formattedDate + " does not have the correct length (" + formattedDate.length + ")");
	    else if (dateStringSegments[0] != originalDate.getMonth() + 1) 
            result = fail(formattedDate + " does not have the correct month (" + dateStringSegments[0] + " != " + (originalDate.getMonth() + 1) + ") (MM/DD/YYYY)");
	    else if (dateStringSegments[1] != originalDate.getDate()) 
            result = fail(formattedDate + " does not have the correct day (" + dateStringSegments[1] + " != " + originalDate.getDate() + ") (MM/DD/YYYY)");
	    else if (dateStringSegments[2] != originalDate.getFullYear()) 
            result = fail(formattedDate + " does not have the correct year (" + dateStringSegments[2] + " != " + originalDate.getFullYear() + ") (MM/DD/YYYY)");

        return result;
    });
});

test("Is A Formatted (YYYY/MM/DD) Date Field", function() {
    runForEachDate(function(sample) {        
		var formattedDate = ToDo.getFormattedDateOrEmptyString(sample, "YYYYMMDD");
		var originalDate = new Date(sample);
		var dateStringSegments = formattedDate.split("/");

        result = pass(sample + " is a valid formatted (YYYY/MM/DD) date field value");
	    if (formattedDate.length != 10) 
            result = fail(formattedDate + " does not have the correct length (" + formattedDate.length + ")");
	    else if (dateStringSegments[1] != originalDate.getMonth() + 1) 
            result = fail(formattedDate + " does not have the correct month (" + dateStringSegments[1] + " != " + (originalDate.getMonth() + 1) + ") (YYYY/MM/DD)");
	    else if (dateStringSegments[2] != originalDate.getDate()) 
            result = fail(formattedDate + " does not have the correct day (" + dateStringSegments[2] + " != " + originalDate.getDate() + ") (YYYY/MM/DD)");
	    else if (dateStringSegments[0] != originalDate.getFullYear()) 
            result = fail(formattedDate + " does not have the correct year (" + dateStringSegments[0] + " != " + originalDate.getFullYear() + ") (YYYY/MM/DD)");

        return result;
    });
});

test("Is A Formatted (MMDDYYYY) Date Field with no separator", function() {
    runForEachDate(function(sample) {        
		var formattedDate = ToDo.getFormattedDateOrEmptyString(sample, "MMDDYYYY", "");
		var originalDate = new Date(sample);
		var dateStringSegments = [];
		dateStringSegments[0] = formattedDate.substring(0,2);
		dateStringSegments[1] = formattedDate.substring(2,4);
		dateStringSegments[2] = formattedDate.substring(4,8);

        result = pass(sample + " is a valid formatted (MMDDYYYY) date field value");
	    if (formattedDate.length != 8) 
            result = fail(formattedDate + " does not have the correct length (" + formattedDate.length + ")");
	    else if (dateStringSegments[0] != originalDate.getMonth() + 1) 
            result = fail(formattedDate + " does not have the correct month (" + dateStringSegments[0] + " != " + (originalDate.getMonth() + 1) + ") (MMDDYYYY)" + dateStringSegments);
	    else if (dateStringSegments[1] != originalDate.getDate()) 
            result = fail(formattedDate + " does not have the correct day (" + dateStringSegments[1] + " != " + originalDate.getDate() + ") (MMDDYYYY)");
	    else if (dateStringSegments[2] != originalDate.getFullYear()) 
            result = fail(formattedDate + " does not have the correct year (" + dateStringSegments[2] + " != " + originalDate.getFullYear() + ") (MMDDYYYY)");

        return result;
    });
});

test("Is A Formatted (YYYYMMDD) Date Field with no separator", function() {
    runForEachDate(function(sample) {        
		var formattedDate = ToDo.getFormattedDateOrEmptyString(sample, "YYYYMMDD", "");
		var originalDate = new Date(sample);
		var dateStringSegments = [];
		dateStringSegments[0] = formattedDate.substring(0,4);
		dateStringSegments[1] = formattedDate.substring(4,6);
		dateStringSegments[2] = formattedDate.substring(6,8);

        result = pass(sample + " is a valid formatted (YYYYMMDD) date field value");
	    if (formattedDate.length != 8) 
            result = fail(formattedDate + " does not have the correct length (" + formattedDate.length + ")");
	    else if (dateStringSegments[1] != originalDate.getMonth() + 1) 
            result = fail(formattedDate + " does not have the correct month (" + dateStringSegments[1] + " != " + (originalDate.getMonth() + 1) + ") (YYYYMMDD)");
	    else if (dateStringSegments[2] != originalDate.getDate()) 
            result = fail(formattedDate + " does not have the correct day (" + dateStringSegments[2] + " != " + originalDate.getDate() + ") (YYYYMMDD)");
	    else if (dateStringSegments[0] != originalDate.getFullYear()) 
            result = fail(formattedDate + " does not have the correct year (" + dateStringSegments[0] + " != " + originalDate.getFullYear() + ") (YYYYMMDD)");

        return result;
    });
});
