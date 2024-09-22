// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field

    let metadata = data.metadata;
    
    // Filter the metadata for the object with the desired sample number

    let resultArray = metadata.filter(sampleDictionary => sampleDictionary.id == sample);
    let result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    // Use `.html("") to clear any existing metadata

    let PANEL = d3.select("#sample-metadata");
    
    PANEL.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.

    for(key in result) {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${result[key]}`)
    }
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field

    let samples = data.samples;

    // Filter the samples for the object with the desired sample number

    let resultArray = samples.filter((sampleDictionary) => sampleDictionary.id == sample);
    let result = resultArray[0];

    // Get the otu_ids, otu_labels, and sample_values

    let otuIDs = result.otu_ids;
    let otuLabels = result.otu_labels;
    let sampleValues = result.sample_values;

    // Build a Bubble Chart

    let bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 0},
      hovermode: 'closest',
      xaxis: { title: "OTU ID"},
      margin: { t: 30}
    };

    // Render the Bubble Chart

    let bubbleData = [
      {
        x: otuIDs,
        y: sampleValues,
        text: otuLabels,
        mode: "markers",
        marker: {
          size: sampleValues,
          color: otuIDs,
          colorscale: "Earth"
        }
      }
    ]

    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    // Render the Bar Chart

    let yticks = otuIDs.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();
    let barData = [
      {
        y: yticks,
        x: sampleValues.slice(0,10).reverse(),
        text: otuLabels.slice(0,10).reverse(),
        type: "bar",
        orientation: "h"
      }
    ]


    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150}
    }

    Plotly.newPlot("bar", barData, barLayout);
  });
}

// Function to run on page load
function init() {

  // Use d3 to select the dropdown with id of `#selDataset`
  let selector = d3.select("#selDataset");

  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field

    console.log(data.names);


    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.

    let sampleNames = data.names;

    for(let i = 0; i < sampleNames.length; i++){
      selector.append("option").text(sampleNames[i]).property("value", sampleNames[i]);
    }

    // Get the first sample from the list
    // Build charts and metadata panel with the first sample
    
    let firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  })
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected

  buildCharts(newSample);
  buildMetadata(newSample);

}

// Initialize the dashboard
init();
