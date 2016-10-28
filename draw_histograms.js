function drawAll() {
    var heightScale = d3.scale.linear()
        .domain([0,d3.max(dataArray.map(function(d) {return d.length}))])
        .range([0,height-pady*2]);

    var yScale = d3.scale.linear()
        .domain([0,d3.max(dataArray.map(function(d) {return d.length}))])
        .range([height-pady*2,0]);

    var colorScale = d3.scale.linear()
        .domain([0,d3.max(dataArray.map(function(d) {return d.x}))])
        .range(["skyblue", "limegreen"]);

    var xPos = d3.scale.linear()
        .domain([0,d3.max(dataArray.map(function(d) {return d.x}))])
        .range([padx/2,width-padx]);

    var xScale = d3.scale.linear()
        .domain([0,d3.max(dataArray.map(function(d) {return d.x}))])
        .range([padx/2,width-(padx/2)]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(bins);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    var bars = canvas.selectAll("rect")
        .data(dataArray);

    var tip = d3.tip()
        .attr("class","tooltip")
        .offset([-10, 0])
        .html(function(d) {
            return "Frequency: <span style='color:pink'>" + d.length + "</span>";
        })

    canvas.call(tip);
    bars.enter()
        .append("rect")
        .attr("class","bar")
        // .attr("fill", "limegreen")
        .attr("fill", function(d,i) { return colorScale(d.x) })
        .attr("x", function(d) { return xPos(d.x)+5 })
        .attr("height", 0)
        .attr("y", function(d,i) { return height-pady })
        .attr("width", barWidth)
        .attr("transform", "translate(5,0)")
        .transition()
        .duration(800)
        .delay(function (d,i) { return i*50 })
            .attr("y", function(d) { return yScale(d.y) +pady})
            .attr("height", function(d) { return heightScale(d.y) });

    bars.on("mouseover", function(d) {
            d3.select(this)
                .attr("fill", "pink")
                .attr("height", function(d) { return heightScale(d.y)+10 })
                .attr("width", barWidth+10)
                .attr("transform", "translate(0,-10)");
            tip.show(d);
            
        })
        .on("mouseout", function(d,i) {
            d3.select(this)
                // .attr("fill", "limegreen")
                .attr("fill", function(d, i) { return colorScale(d.x) })
                .attr("height", function(d) { return heightScale(d.y) })
                .attr("width", barWidth)
                .attr("transform", "translate(5, 0)");
            tip.hide(d);
        });

    canvas.append("g")
        .attr("transform", "translate(0, "+ (height - pady + 10) +")")
        .attr("class","axis")
        .call(xAxis);

    canvas.append("g")
        .attr("transform", "translate("+padx/2+", "+pady+")")
        .attr("class","axis")
        .call(yAxis);

    canvas.append("text")
        .attr("text-anchor","middle")
        .attr("transform","translate("+0+","+height/2+")rotate(-90)")
        .attr("font-family", "Tahoma,Arial,sans-serif")
        .text("Frequency");

    canvas.append("text")
        .attr("text-anchor","middle")
        .attr("transform","translate("+width/2+","+(height-pady/10)+")")
        .attr("font-family", "Tahoma,Arial,sans-serif")
        .text("Value");

    d3.select("div").on("click", function() {
        var sel = d3.select("select").property("value");
        var i = cols.indexOf(sel);
        i = (i+1) % cols.length;
        d3.select("select").property("value", cols[i]);
        createHist(cols[i]);
    })
}

function createHist(col) {
    var i = cols.indexOf(col);
    var map = allData.map(function(d) {return parseFloat(d[col]);});

    var hist = d3.layout.histogram()
        .bins(bins)
        (map);
    dataArray = hist;
    canvas.selectAll("*").remove();
    drawAll();
    d3.select("h2")
        .text(colnames[i]);
}