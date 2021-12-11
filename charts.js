function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    // console.log("metadata resultArray");
    // console.log(resultArray);
    var result = resultArray[0];
    // console.log("metadata first sample");
    // console.log(result);
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    console.log("sample");
    console.log(samples);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    console.log("samples resultArray");
    console.log(resultArray);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    console.log("samples first sample/result");
    console.log(result);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var result_otu_ids = result.otu_ids;
    console.log("result_otu_ids");
    console.log(result_otu_ids);

    var result_otu_labels = result.otu_labels;
    console.log("result_otu_labels");
    console.log(result_otu_labels);

    var result_sample_values = result.sample_values;
    console.log("result_sample_values");
    console.log(result_sample_values);



    // combining arrays
    var list = []
    for (var j = 0; j < result_otu_ids.length; j++) {
      list.push({"id": result_otu_ids[j], "label": result_otu_labels[j], "value": result_sample_values[j]})
    };
    console.log("list");
    console.log(list);

    // sort
    var sortedList = list.sort((a, b) => b.value - a.value);
    console.log("sortedList");
    console.log(sortedList);

    // separate arrays
    for (var k = 0; k < sortedList.length; k++) {
      result_otu_ids[k] = sortedList[k].id;
      result_otu_labels[k] = sortedList[k].label;
      result_sample_values[k] = sortedList[k].value;
    };
    console.log("separated lists");
    console.log(result_otu_ids);
    console.log(result_otu_labels);
    console.log(result_sample_values);

    // slice top tens
    var topTenIds = result_otu_ids.slice(0, 10).reverse();
    var topTenLabels = result_otu_labels.slice(0, 10).reverse();
    var topTenValues = result_sample_values.slice(0, 10).reverse();
    console.log("topTens");
    console.log(topTenIds);
    console.log(topTenLabels);
    console.log(topTenValues);


    var yticks = [];
    for (i=0; i<topTenIds.length; i++) {
      yticks.push(`OTU: ${topTenIds[i]}`)
    }
    console.log("yticks")
    console.log(yticks)
    // var yticks = JSON.stringify(topTenIds);
    // console.log(yticks)

    // 8. Create the trace for the bar chart. 
    var trace = {
      x: topTenValues,
      y: yticks,
      type: "bar",
      orientation: "h",
      text: topTenLabels
    };
    
    var barData = [trace];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"     
    }

  // 10. Use Plotly to plot the data with the layout. 
  Plotly.newPlot("bar", barData, barLayout);
  });

}
