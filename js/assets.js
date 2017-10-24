

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