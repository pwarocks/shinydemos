var helpers = {};
helpers.hasRange = function(){
	return (document.querySelector('input[type=range]').type == 'range');
}

helpers.getNum = function( numAndUnitString ){
	/*
	 pull out the digits. join into one string.
	 multiply by 1 to make a number
	*/
	return numAndUnitString.match(/\d/g).join('') * 1;
}

// should return true if it is IE8 or older
helpers.mightBeIE8 = function(){
	return ( 'attachEvent' in window ) && !('addEventListener' in window);
}