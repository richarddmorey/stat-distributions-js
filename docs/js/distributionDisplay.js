// Universal plotting options
var plotPoints = 200;
var plotOptions = [];
var sliderPoints = 101;
var roundDigits = 3;
var updateTime = 100;
var areaFillColor="rgba(0,200,0,.3)";

plotOptions["pdf"] = { 
				yaxis: { min:0 }, 
				colors: ["rgb(0,200,0)", "rgb(200,0,0)","rgb(150,150,150)","rgb(150,150,150)", "rgb(0,200,0)"], 
				series: {
					points: { fillColor: "rgb(0,200,0)"}
					},
				grid: { hoverable: true, clickable: true },
				crosshair: { mode: "x" }
				};
plotOptions["cdf"] = { 
				yaxis: { min:0, max: 1.001},
				colors: ["rgb(0,0,0)", "rgb(200,0,0)", "rgb(150,150,150)","rgb(150,150,150)", "rgb(0,200,0)"],
				series: {
					points: { fillColor: "rgb(0,200,0)"}
					},
				grid: { hoverable: true, clickable: false }
				};

var plot;
var dist;
var distName;
var ptznNum;
var starts; 
var rangesHi;
var rangesLo;
var plotxrng;

var distributions = [];

function getShaded(plot,pos, limits, cumdens, args){
		var data = plot.getData();
		var x1 = data[2];
		var x2 = data[3];

		if(x2.data.length!=0){
		 	x2 = x2.data[0][0];
		 	x1 = x1.data[0][0];
		 	var minx = Math.min(x1,x2);
		 	var maxx = Math.max(x1,x2);
		 	return cumdens.apply(null, [maxx].concat(args) ) - 
		 		   cumdens.apply(null, [minx].concat(args) );
		 }else if(x1.data.length!=0){
			x1 = x1.data[0][0];
			return cumdens.apply(null, [x1].concat(args) );
		 }else{
			return cumdens.apply(null, [pos.x].concat(args) );
			x2 = limits[0];
			x1 = pos.x;
		 }

}


function showTooltip(x, y, contents) {
    $('<div id="tooltip">' + contents + '</div>').css( {
        position: 'absolute',
        display: 'none',
        top: y - 30,
        left: x + 10,
        border: '1px solid #fdd',
        padding: '2px',
        'background-color': '#fee',
        opacity: 0.80,
        'font-family': 'sans-serif'
    }).appendTo("body").fadeIn(0);
}

function makeSortedTable(type, caption){

	var n = distributions.length;
	var list = [];
	var i=0;
    for(d in distributions){
    	if (distributions.hasOwnProperty(d))
	   	{
			if(distributions[d].type == type || type == "master") list.push(d);
        }
	}
	
	list.sort();
	
	document.id(type+'_distributionsdiv').grab(
        new Element("table",{
            id: type+"_distributiontable", 
            'class':"distribution"
        })
    );
    
    var cap = new Element('caption', {
		html: caption
	});
    document.id(type+'_distributiontable').grab(cap);

    refTableHeaderRow(type);
    
    var body = new Element("tbody",{
        id: type+"_distributiontablebody"
    });
    document.id(type+'_distributiontable').grab(body);
	
	
	if(list.length==0) return;
	
	for(;i<list.length;i++)
		distributions[list[i]].refTableRow(i%2==1,type);
	
}


function makePDF()
{
	$("#buttonCDF").removeAttr("disabled");
	$("#buttonPDF").attr('disabled','disabled');
	
	//plot = false;
	dist.updatePlot(ptznNum);
}

function makeCDF()
{
	$("#buttonCDF").attr('disabled','disabled');
	$("#buttonPDF").removeAttr("disabled");
	
	//plot = false;
	dist.updatePlot(ptznNum);
}

function slide(name, ui){
	dist.updatePlot(ptznNum,name, ui);
}

function is_int(value){ 
  if((parseFloat(value) == parseInt(value)) && !isNaN(value)){
      return true;
  } else { 
      return false;
  } 
}

function round(x,digits)
{
	var factor = Math.pow( 10, digits );
	return Math.round( x * factor ) / factor;
}

