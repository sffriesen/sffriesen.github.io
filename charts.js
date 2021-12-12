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

// ARRAYS
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


// TOP TEN BAR CHART
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

// BUBBLE CHART
    // 1. Create the trace for the bubble chart.
    var bubbleTrace = {
      x: result_otu_ids,
      y: result_sample_values,
      mode: "markers",
      marker: {
        size: result_sample_values,
        color: result_otu_ids,
        colorscale: [
          ['0.0', 'rgb(165,0,38)'],
          ['0.111111111111', 'rgb(215,48,39)'],
          ['0.222222222222', 'rgb(244,109,67)'],
          ['0.333333333333', 'rgb(253,174,97)'],
          ['0.444444444444', 'rgb(254,224,144)'],
          ['0.555555555556', 'rgb(224,243,248)'],
          ['0.666666666667', 'rgb(171,217,233)'],
          ['0.777777777778', 'rgb(116,173,209)'],
          ['0.888888888889', 'rgb(69,117,180)'],
          ['1.0', 'rgb(49,54,149)']
        ]
        },
      text: result_otu_labels,
      type: "bubble"
    };

    var bubbleData = [bubbleTrace];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: {text: "OTU ID"}},
      hovermode: "closest"
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

// GAUGE
    // filter metadara array for the first object that matches the ID number selected
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    // console.log("metadata resultArray");
    // console.log(resultArray);
    var result = resultArray[0];
    // console.log("metadata first sample");
    // console.log(result);
    // Use d3 to select the panel with id of `#sample-metadata`
    console.log("metadata result")
    console.log(result)

    // create a variable that converts the washing frequency to a floating point number
    washFreq = parseFloat(result.wfreq);
    console.log("wash freq");
    console.log(washFreq)

    // 4. Create the trace for the gauge chart.
    gaugeTrace = {
      value: washFreq,
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [null, 10]},
        bar: {color: "black"},
        steps: [
          {range: [0, 2], color: "red"},
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "yellowgreen"},
          {range: [8, 10], color: "green"},
        ],
        }
      }
  

    var gaugeData = [gaugeTrace];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
     title: "Belly Button Washing Frequency:<br> Scrubs per Week"
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
