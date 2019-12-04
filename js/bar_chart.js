var bar = (function(){
    function bar_graph(){
        var self = this;
    }
    bar_graph.init = function(){
        // d3.json("data/patient_dataset.json", function(patients) {


        // });


    }
    bar_graph.dropdown = function(id){
        //creating a dropdown patientList
        var div = document.querySelector("#dropDown"),
        fragment = document.createDocumentFragment(),
        create_select = document.createElement("select");
        create_select.setAttribute("id", "select");
        create_select.setAttribute("name", "Select Patients")
        //creating counter for all the loops
        var count;
        for (count = 0 ; count < id.length ; count ++){
            //var optionElementReference = new Option(text, value, defaultSelected, selected);
            if(count === 0){
                create_select.options.add( new Option("Patient ID : " + id[count], id[count]) );
            }else{
                create_select.options.add( new Option("Patient ID : " + id[count], id[count]) );
            }
        }
        fragment.appendChild(create_select);
        div.appendChild(fragment);
    }
    return bar_graph;

}());



    //creating the bar chart
function bar_chart(orgList, meanDose){
    d3.select('#bar_chart').select('svg').remove();
    var margin = {top: 5, right: 100, bottom: 90, left: 30, spacing: 4},
    width = 1000 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

    var svg = d3.select("#bar_chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var y = d3.scale.linear()
            .domain([d3.min(meanDose), d3.max(meanDose)])
            .range([height, 0]);

    var x = d3.scale.ordinal()
            .domain(orgList.map(function(d){ return d;}))
            .rangeBands([0, width]);

    var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

    var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

    //var barwidth = width / meanDose.length;

    var tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("position", "absolute")
                .style("opacity", 0)
                .style("font","15px sans-serif")
                .style("background", "#ffffff")
                .style("border","1px solid black")
                .style("border-radius","8px")
                .style("text-align","center")
                .style("padding","5px");

function mouseOver(d,i){

    var tooltipString =  '<strong>Organ Name : ' + orgList[i] ;
    tooltipString +=  '<br>Dose Volume : '+ d  + '</strong>';
    tooltip.style("opacity", .9);
    tooltip.html(tooltipString)
            .style("left", (d3.event.pageX + 30 ) + "px")
            .style("top", (d3.event.pageY - 30) + "px");
    //console.log(d);
  }

  function mouseOut(d) {
    tooltip.style("opacity", 0);
  }
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("font-size", "9px")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-45)" );

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);



    svg.selectAll("rectangle")
        .data(meanDose)
        .enter()
        .append("rect")
        .attr("class","rectangle")
        .attr("width", width/meanDose.length-margin.spacing)
        .attr("height", function(d){
            return height - y(d);
        })
        .attr("x", function(d, i){
            //console.log(width / meanDose.length)
            return (width / meanDose.length * i );
        })
        .attr("y", function(d){
            return y(d);
        })
        .on("mouseover", mouseOver)
        .on("mouseout", mouseOut)
        .style("cursor", "pointer");

}


function getOrganList(id, patients){
    var patient = patients[id].organData;
    var organs = Object.keys(patient);
    //removing GTVs
    var remove = function(name){
        var index = organs.indexOf(name);
        if(index > -1){
            organs.splice(index, 1);
        }
    }
    var gtvRegex = RegExp('GTV*');
    organs = organs.filter(o => !gtvRegex.test(o));
    return organs;
}

    //function for getting the mean doses of the organs into an array
function getOrganMeanDose(id, organsForMean, patients){
    var meanDose = []
    for (var count = 0; count < organsForMean.length ; count ++){
        var tempOrgan = organsForMean[count];
        meanDose[count] = patients[id].organData[tempOrgan].meanDose;
    }
    return meanDose;
}

function getPatientIDS(patients){
    var id = [];
    var count ;
    for (count = 0 ; count < patients.length ; count ++){
        id[count] = patients[count].ID;
    }
    return id;
}

function getPatientDoses(patients) {
    var dose = [];
    var count ;
    for (count = 0; count < patients.length ; count ++){
        dose[count] = patients[count].total_Dose;
    }
    return dose;
}