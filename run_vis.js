var allData;
var colnames = ["US State", 
                "Percentage of Households with Retirement Income",
                "Per Capita Income for People with 'Other' Heritage",
                "Percentage of Population Who Immigrated Within the Last 3 Years",
                "Percentage of Population Who Immigrated Within the Last 5 Years",
                "Percentage of Population Who Immigrated Within the Last 8 Years",
                "Percentage of Population Who Immigrated Within the Last 10 Years",
                "Owner Occupied Housing - Lower Quartile",
                "Owner Occupied Housing - Median",
                "Owner Occupied Housing - Upper Quartile",
                "Rental Housing - Upper Quartile Rent",
                "Median Owners Cost as Percentage of Household Income (With Mortgage)",
                "Percentage of Foreign Born People",
                "Percentage of People Born in Same State as Currently Living"];
var dataArray = [10,20,40,60,80,100];
var width = 800;
var height = 800;
var barWidth = 50;
var bins = 10;
var pady = 50;
var padx = 100;
var cols;

var canvas = d3.select("div")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate("+20+", 0)");


d3.csv("communities_crime_pca.csv", function(data) {
    allData = data;
    cols = Object.keys(d3.values(data)[0]);

    d3.select("select").selectAll("option")
        .data(cols)
        .enter()
        .append("option")
        .attr("value", function(d) {return d})
        .text(function(d) {return d});
    createHist(cols[0]);
});