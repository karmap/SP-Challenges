/*
Notes:

# 1
There is another test case that is not specified:
when we are subtracting and the specified time is
after the holiday end date and then overlaps with
the holiday.
I assumed that we should try to substract time between
the specified time and the holiday end (if possible)
and continue taking time before the holiday start.
I added more tests for specific cases like this.

# 2
About the code, I like to consider performance,
readability and maintenance, that's why I decided to
make cases more explicit.

# 3 
About the final format of the date, I assumed that in
this case we needed that specific format, so I decided
to make a function for this.

*/


/**
 * Returns a Date object calculated by adding duration to time, skipping over the holiday.
 * 
 * @param {Object} holiday The holiday to use as object: {start: <Date>, end: <Date>}
 * @param {Date} time The time to base the calculation as a Date object
 * @param {Integer} duration number of seconds, positive or negative
 * 
 * @returns {Date} Calculated date object
 */
function addBusinessTime(holiday, time, duration) {
    
    const {start, end} = holiday;
    const estimatedTime = addSecondsToDate(time, duration); 

    // Check if is addition or subtraction
    if (duration >= 0) {
        // If is out of the holiday range just return the estimatedTime
        if (estimatedTime < start || time >= end) {
            console.log('case <duration(+)> before start or after end');
            return formatDate(estimatedTime);
        }
        // If there is overlap, consider the difference
        else if (time < start && estimatedTime < end) {
            console.log('case <duration(+)> with overlap');
            const overlapTime = (estimatedTime.getTime() - start.getTime())/1000;
            return formatDate(addSecondsToDate(end, overlapTime));
        }
        else {
            console.log('case <duration(+)> NO overlap');
            return formatDate(addSecondsToDate(end, duration));
        }
    }
    else {
        // If is out of the holiday range just return the estimatedTime
        if (estimatedTime >= end || time < start ) {
            console.log('case <duration(-)> before start or after end');
            return formatDate(estimatedTime);
        }
        // If there is overlap, consider the difference
        else if (time > end && estimatedTime > start) {
            console.log('case <duration(-)> with overlap');
            const overlapTime = (estimatedTime.getTime() - end.getTime())/1000;
            return formatDate(addSecondsToDate(start, overlapTime));
        }
        else {
            console.log('case <duration(-)> NO overlap');
            return formatDate(addSecondsToDate(start, duration));
        }
    }
}

/**
 * Returns a Date object with the specified time in seconds added
 * 
 * @param {Date} date The Date object
 * @param {Integer} seconds number of seconds, positive or negative
 * 
 * @returns {Date} Added date object
 */
function addSecondsToDate(date, seconds) {
    let newDate = new Date(date)
    newDate.setSeconds(date.getSeconds() + seconds);
    return newDate;
}

/**
 * Returns a date in a String similar to ISO format but with local date
 * Example: '2019-12-01T01:00:00'
 * 
 * @param {Date} date The Date object to format
 * 
 * @returns {String} The formatted string
 */
function formatDate(date) {
    const offset = date.getTimezoneOffset() * 60 * 1000;
    const timeLocal =  date.getTime() - offset;
    const dateLocal = new Date(timeLocal);
    const iso = dateLocal.toISOString();
    return iso.slice(0, 19);
}

// Christmas 2019, 9pm Dec 24th to 9pm Dec 25th
const holiday = {
    start: new Date('2019-12-24T21:00:00'),
    end: new Date('2019-12-25T21:00:00')
};

console.log(addBusinessTime(holiday, new Date('2019-12-01T00:00:00'), 60 * 60)  === '2019-12-01T01:00:00');
console.log(addBusinessTime(holiday, new Date('2019-12-24T21:00:00'), 1)        === '2019-12-25T21:00:01');
console.log(addBusinessTime(holiday, new Date('2019-12-24T20:30:00'), 60 * 60)  === '2019-12-25T21:30:00');
console.log(addBusinessTime(holiday, new Date('2019-12-25T00:00:00'), 1)        === '2019-12-25T21:00:01');
console.log(addBusinessTime(holiday, new Date('2019-12-25T00:00:00'), -1)       === '2019-12-24T20:59:59');

console.log('---------------------- Extra tests ----------------------');

console.log(addBusinessTime(holiday, new Date('2019-12-25T00:00:00'), -10)      === '2019-12-24T20:59:50');
console.log(addBusinessTime(holiday, new Date('2019-12-25T21:00:00'), 60 * 60)  === '2019-12-25T22:00:00');
console.log(addBusinessTime(holiday, new Date('2019-12-24T20:59:00'), -60 * 60) === '2019-12-24T19:59:00');
console.log(addBusinessTime(holiday, new Date('2019-12-25T21:00:00'), 10)       === '2019-12-25T21:00:10');
console.log(addBusinessTime(holiday, new Date('2019-12-25T21:00:09'), -10)      === '2019-12-24T20:59:59');
console.log(addBusinessTime(holiday, new Date('2019-12-25T21:00:09'), -60 * 60) === '2019-12-24T20:00:09');
console.log(addBusinessTime(holiday, new Date('2019-12-24T21:30:00'), -60 * 60) === '2019-12-24T20:00:00');

