# stat-distributions-js
Javascript library for the visualization of statistical distributions

## What the library does

Allows for interactive visualizations of probability distributions. The goal of this library is to offer a simple way to define any distribution one likes, and then to immediately be able to interact with the parameters of the distribution and see how the distribution changes. 

[Live demo](https://richarddmorey.github.io/stat-distributions-js/)

[![Screen1](http://learnbayes.org/demo/stat-distributions-js/screenshots/screen-distribution_thumb.jpg)](http://learnbayes.org/demo/stat-distributions-js/screenshots/screen-distribution.png)

[![Screen2](http://learnbayes.org/demo/stat-distributions-js/screenshots/screen-lightbox_thumb.jpg)](http://learnbayes.org/demo/stat-distributions-js/screenshots/screen-lightbox.png)

[![Screen3](http://learnbayes.org/demo/stat-distributions-js/screenshots/screen-table_thumb.jpg)](http://learnbayes.org/demo/stat-distributions-js/screenshots/screen-table.png)

There are two HTML files:
* `distributionTable.html`: Lists all known distributions in a table, giving links for interaction with each
* `distributionDisplay.html`: Gives an interface to interface with a specific distribution

`distributionDisplay.html` can be used directly using URL parameters, e.g.:

[https://richarddmorey.github.io/stat-distributions-js/distributionDisplay.html?dist=normal&ptzn=2&plotxrng=50,150&rangesLo=50,3&rangesHi=150,45&starts=100,15](https://richarddmorey.github.io/stat-distributions-js/?dist=normal&ptzn=2&plotxrng=50,150&rangesLo=50,3&rangesHi=150,45&starts=100,15)

The setup parameters used here are:
* `dist`: the distribution name
* `ptzn`: the parametrization number (array index; here 2 means mean/standard deviation)
* `plotxrng`: the lower and upper limit of the x axis
* `rangesLo`: the lower bound for the slider for each parameter
* `rangesHi`: the upper bound for the slider for each parameter
* `starts`: starting values for the parameter sliders


## How it works

The javascript file `distributionList.js` defines an array of `distribution` objects, each of which represents a probability distribution. 

### Distibutions

A distribution is defined by a distribution object, e.g.

    distributions["normal"] = new distribution(
		"normal",            // label
		"Normal/Gaussian",   // display name
		"continuous",        // type
		[ normalMeanVariance, normalMeanPrecision ], // array of parametrizations
		null,                // note 
		{   // information source about the distribution
			name:"Wikipedia",
			link:"http://en.wikipedia.org/wiki/Normal_distribution"
		}
    );

New distributions can be defined analgously.

### Parametrizations

Every distribution must have at least one parametrization. Most of the important information about the distribution is in the parametrization object. See the `distributionObjects.js` file for more details, and the `distributionList.js` file for examples.

## Libraries used

Uses the following libraries:
* For plotting: [jquery](https://jquery.com/), [jquery-ui](https://jqueryui.com/), and [flot.js](http://www.flotcharts.org/)
* For the formula display: [MathJax](https://www.mathjax.org/)
* For the statistical functions: [jstat](https://github.com/jstat/jstat)
* For the lightbox: [mootools](http://mootools.net/) and [milkbox](http://reghellin.com/milkbox/)

Old (known working) versions of these libraries are included in this repository.
