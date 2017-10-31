

/**
 * Generates random number
 * 
 * @param {number} min  - start number
 * @param {number} max  - end number
 * @return {number}     - random number
 * @throws {error}      - if 'min' parameter is larger than 'max' parameter, 
 *                        this function throws error
 */
var random = function(min, max) {
    if(max < min) {
        throw new Error(`The maximum number must be smaller than minimum number. Current min number: ${min}, max number: ${max}`);
    }
    return min + (Math.random() * (max - min));
}






/**
 * Add multiple events to one object
 * 
 * @param {string} eventNames   - events to evaluate, for example "click keyup"
 * @param {function} callback   - the callback function
 */
Object.prototype.addMultiEventListener = function(eventNames, callback) {
    eventNames = eventNames.split(" ");

    for(var i = 0; i < eventNames.length; i++) {
        this.addEventListener(eventNames[i], callback, false);
    }

}




/**
 * Function for filtering data in array
 * @param {function} callback - the callback function
 * @returns {array} - filtered array
 */
Array.prototype.filter = function(callback) {
    var result = [];
    var defined = false;
    for(var i = 0; i < this.length; i++) {
        var c = callback(this[i]);
        defined = (typeof c == "undefined");
        if(c) {
            result.push(this[i]);
        }
    }
    return result;
}





/**
 * Check clicked element exists with specified selector.
 * @param {object} e        - the Event object returning, when event happened
 * @param {string} selector - the look for selector
 * @returns {boolean}       - true or false when the element exists 
 */
var isTarget = function(e, selector) {
    var r = new RegExp(selector, "g");
    return e.path.filter(t => r.test(t.className)).length > 0;
}