/*!
 * Name          : mystery_counter.js
 * Author        : Me :-)
 * Last modified : 20.02.2018
 * Revision      : 2.3.2
 */

var odometer = function (ctx, parameters) {
    parameters = parameters || {};
    var height = (undefined === parameters.height ? 40 : parameters.height);
    var digits = (undefined === parameters.digits ? 6 : parameters.digits);
    var decimals = (undefined === parameters.decimals ? 1 : parameters.decimals);
    var points = 0;
    var pointPlace = 0;
    var pointWidth = 0;
    if(decimals){
        points = 1;
        pointPlace = decimals;
        pointWidth = Math.floor(height * 0.2); // point width
    }
    var decimalBackColor = (undefined === parameters.decimalBackColor ? '#000' : parameters.decimalBackColor);
    var decimalForeColor = (undefined === parameters.decimalForeColor ? '#FFF' : parameters.decimalForeColor);
    var font = (undefined === parameters.font ? 'sans-serif' : parameters.font);
    var value = (undefined === parameters.value ? 0 : parameters.value);
    var valueBackColor = (undefined === parameters.valueBackColor ? '#000' : parameters.valueBackColor);
    var valueForeColor = (undefined === parameters.valueForeColor ? '#FFF' : parameters.valueForeColor);

    var doc = document;
    var initialized = false;
    
    // Cannot display negative values yet
    if (value < 0) {
        value = 0;
    }
    

    var digitHeight = Math.floor(height+50);
    var stdFont = '800 ' + digitHeight + 'px ' + font;
    
    var digitWidth = Math.floor(height * 0.6);
    var width = digitWidth * (digits + decimals) + pointWidth * points;
    var columnHeight = digitHeight * 11;
    var verticalSpace = columnHeight / 12;
    var zeroOffset = verticalSpace;
    
    // Resize and clear the main context
    ctx.canvas.width = width;
    ctx.canvas.height = height;

    // Create buffers
    var backgroundBuffer = createBuffer(width, height);
    var backgroundContext = backgroundBuffer.getContext('2d');
    
    var digitBuffer = createBuffer(digitWidth, columnHeight);
    var digitContext = digitBuffer.getContext('2d');

    var decimalBuffer = createBuffer(digitWidth, columnHeight);
    var decimalContext = decimalBuffer.getContext('2d');

    var pointBuffer = createBuffer(digitWidth, columnHeight);
    var pointContext = pointBuffer.getContext('2d');

    var spaceBuffer = createBuffer(digitWidth, columnHeight);
    var spaceContext = spaceBuffer.getContext('2d');
    
    function init() {
        
        initialized = true;

        // Create a digit column
        // background
        digitContext.rect(0, 0, digitWidth, columnHeight);
        digitContext.fillStyle = valueBackColor;
        digitContext.fill();

        // numerals
        digitContext.textAlign = 'center';
        digitContext.textBaseline = 'middle';
        digitContext.font = stdFont;
        digitContext.fillStyle = valueForeColor;
        // put the digits 901234567890 vertically into the buffer
        for (var i=9; i<21; i++) {
            digitContext.fillText(i % 10, digitWidth * 0.5, verticalSpace * (i-9) + verticalSpace / 2);
        }
        
        // Create a decimal column
        if (decimals > 0) {
            // background
            decimalContext.rect(0, 0, digitWidth, columnHeight);
            decimalContext.fillStyle = decimalBackColor;
            decimalContext.fill();
            // edges

            // numerals
            decimalContext.textAlign = 'center';
            decimalContext.textBaseline = 'middle';
            decimalContext.font = stdFont;
            decimalContext.fillStyle = decimalForeColor;       
            // put the digits 901234567890 vertically into the buffer
            for (i=9; i<21; i++) {
                decimalContext.fillText(i % 10, digitWidth * 0.5, verticalSpace * (i-9) + verticalSpace / 2);
            }
            
            // Create a point column
            // background
            pointContext.rect(0, 0, pointWidth, columnHeight);
            pointContext.fillStyle = valueBackColor;
            pointContext.fill();
            // edges

            // numerals
            pointContext.textAlign = 'center';
            pointContext.textBaseline = 'middle';
            pointContext.font = stdFont;
            pointContext.fillStyle = valueForeColor;       
            // put the digits 901234567890 vertically into the buffer
            for (i=9; i<21; i++) {
                pointContext.fillText('.', pointWidth * 0.5, verticalSpace * (i-9) + verticalSpace / 2);
            }

            // Create empty column
            // background
            spaceContext.rect(0, 0, digitWidth, columnHeight * 1.1);
            spaceContext.fillStyle = valueBackColor;
            spaceContext.fill();
            // edges

            // numerals
            spaceContext.textAlign = 'center';
            spaceContext.textBaseline = 'middle';
            spaceContext.font = stdFont;
            spaceContext.fillStyle = valueForeColor;       
            // put the digits 901234567890 vertically into the buffer
            for (i=9; i<21; i++) {
                if(i==10){
                    spaceContext.fillText('', digitWidth * 0.5, verticalSpace * (i-9) + verticalSpace / 2);
                }else{
                    spaceContext.fillText(i % 10, digitWidth * 0.5, verticalSpace * (i-9) + verticalSpace / 2);
                }
            }
        }
    }

    function drawDigits(){
        var pos = 1;
        var val;
        
        val = value;
        // do not use Math.pow() - rounding errors!
        for (var i=0; i<decimals; i++) {
            val *= 10;
        }

        var numb = Math.floor(val);
        var frac = val - numb;
        numb = String(numb);
        var prevNum = 9;
        
        if(points){
            var digitLen = numb.length - decimals;
            numb = numb.slice(0, digitLen) + "." + numb.slice(digitLen);
            //console.log(numb,digitLen,numb2);
        }
        
        //console.log(pointWidth * frac);
        
        var sumDecimalWidth = digitWidth * decimals;

        for (i = 0; i < decimals + digits + points; i++) {
            var num = +numb.substring(numb.length - i - 1, numb.length - i) || 0;
            if (!(pointPlace && i === pointPlace) && prevNum !== 9) {
                frac = 0;
            }
            if (i < decimals) {
                backgroundContext.drawImage(decimalBuffer, width - digitWidth * pos, -(verticalSpace * (num + frac) + zeroOffset));        
            } else if (pointPlace && i === pointPlace) {
                backgroundContext.drawImage(pointBuffer, width - pointWidth - sumDecimalWidth, -verticalSpace);        
            } else {
                if(i>=numb.length && num==0){
                    backgroundContext.drawImage(spaceBuffer, width - digitWidth * pos + digitWidth - pointWidth, -(verticalSpace * (num + frac) + zeroOffset));
                }else{
                    backgroundContext.drawImage(digitBuffer, width - digitWidth * pos + digitWidth - pointWidth, -(verticalSpace * (num + frac) + zeroOffset));
                }
            }
            pos++;
            if(!(pointPlace && i === pointPlace)){
                prevNum = num;
            }
        }
    }

    this.setValue = function(newVal) {
        value = newVal;
        if (value < 0) {
            value = 0;
        }
        this.repaint();
    };
    
    this.getValue = function() {
        return value;
    };

    this.repaint = function() {
        if (!initialized) {
            init();
        }
        
        // draw digits
        drawDigits();
        //ctx.globalCompositeOperation = "lighter";
        // paint back to the main context
        ctx.drawImage(backgroundBuffer, 0, 0);
    };
  
    this.repaint();

    function createBuffer(width, height) {
        var buffer = doc.createElement('canvas');
        buffer.width = width;
        buffer.height = height;
        return buffer;
    }
};