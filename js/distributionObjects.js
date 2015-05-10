///////////
// Distribution stuff
///////////


function distributionParameter(name, label, range, interactRange, interactLog, interactStart, type, conjugate, note){
	this.name = name;
	this.label = label;
	this.range = range;
	this.interactRange = interactRange;
	this.interactLog = interactLog;
	this.interactStart = interactStart;
	this.type = type;
	this.conjugate = conjugate;
	this.note = note;
}

function createElement(fstart,frangeLo,frangeHi){
	var limits = this.interactRange.apply(null,arguments);
	var start = this.interactStart;
	
	if( frangeLo != null && frangeHi !=null ){
		limits = [frangeLo,frangeHi];
	}
	if(fstart != null && fstart>limits[0] && fstart<limits[1]){
		start = fstart;
	}
	
	var log = this.interactLog;
	var name = this.name;

	$('<div/>', {
    	id: "params_" + name + "_container",
		title: this.note
	}).appendTo('#parametercontainer');

	$("#params_" + name + "_container").addClass("paramsinglecontainer");
	
	$('<div/>', {
    	id: "params_label_" + name,
    	text: " \\("+this.label+"\\) "
	}).appendTo('#' + "params_" + name + "_container");

	$("#params_label_" + name ).addClass("paramlabel");

	$('<div/>', {
    	id: "params_slider_" + name
	}).appendTo('#' + "params_" + name + "_container");

	$("#params_slider_" + name ).addClass("paramslider");

	$('<input/>', {
    	id: "params_indicator_" + name,
    	value: start
	}).appendTo('#'+"params_" + name + "_container");

	$("#params_indicator_" + name ).addClass("paramindicator");

	$('<br/>', { 
		id: "params_end_" + name
	}).appendTo('#parametercontainer');

	$("#params_end_" + name ).addClass("clear");

	$("#params_" + name + "_container").tooltip({tipClass: "partooltip"});

	switch(this.type){
		
		case "discrete":
			var sliderMin = limits[0];
			var sliderMax = limits[1];
			var sliderStart = start;
		break;
		
		case "continuous":
			var sliderMin = 0;
			var sliderMax = sliderPoints-1;
			if(log){
				var sliderStart = sliderMax * (Math.log(start) - Math.log(limits[0]))/(Math.log(limits[1]) - Math.log(limits[0]));
			}else{
				var sliderStart = sliderMax * (start - limits[0])/(limits[1] - limits[0]);
			}
		break;
	}
	
	$( "#params_slider_" + name ).slider({ min: sliderMin, max: sliderMax, value: sliderStart });	
	$( "#params_slider_" + name ).slider().bind('slide',function(event,ui){ slide(name,ui); } );

}

distributionParameter.prototype.createElement = createElement;

function unboundedParameter(name, label, interactRange, interactLog, interactStart, type, conjugate, note){
	var range = function() { return [Number.NEGATIVE_INFINITY,Number.POSITIVE_INFINITY]; };
	distributionParameter.call(this, name, label, range, interactRange, interactLog, interactStart, type, conjugate, note);
}

function positiveParameter(name, label, interactRange, interactLog, interactStart, type, conjugate, note){
	var range = function() { return [0,Number.POSITIVE_INFINITY]; };
	distributionParameter.call(this, name, label, range, interactRange, interactLog, interactStart, type, conjugate, note);
}

positiveParameter.prototype = new distributionParameter();
unboundedParameter.prototype = new distributionParameter();

function distributionParametrization(ptznName, params, limits, interactLimits, displayLimits, density, densityDisplay, cdf, conjugate, check, quantities, note){
	this.name = ptznName;
	this.params = params;
	this.density = density;
	this.densityDisplay = densityDisplay;
	this.cdf = cdf;
	this.limits;
	this.interactLimits = interactLimits;
	this.checkPars = check;
	this.conjugate = conjugate;
	this.quantities = quantities;
	this.note = note;
	this.displayLimits = displayLimits;
}

function distribution(name,label,type,parametrizations,note,referenceurl){
	this.name = name;
	this.label = label;
	this.type = type;
	this.parametrizations = parametrizations;
	this.p = parametrizations[0];
	this.note = note;
	this.referenceurl = referenceurl;
}



function updatePlot(ptznNum,name,ui){
		
	var nptzn = this.parametrizations.length;
	p = (ptznNum > (nptzn - 1)) ? this.p : this.parametrizations[ptznNum];
	

	
	var npars = p.params.length;
	var i = 0;
	var args = [];
	var par, sliderMin, sliderMax, sliderFrac, parValue;
	var limits;
	var plotType;
	
	if($("#buttonPDF").attr('disabled') !== undefined){
		plotType="pdf";
	}else if($("#buttonCDF").attr('disabled') !== undefined){
		plotType="cdf";
	}else{
		return;
	}

	
	// Iterate through parameters
	for(;i<npars;i++){
		par = p.params[i];
		//This is wrong, because it doesn't account for parameter
		//limits that depend on other parameters, but it will do for now
		limits = par.interactRange();
		sliderValue = (name==par.name) ? ui.value : $('#params_slider_' + par.name ).slider("value"); 
		
		// Get info from query string if it is there
		var rl = rangesLo[i]==undefined ? null : parseFloat(rangesLo[i]);
		var rh = rangesHi[i]==undefined ? null : parseFloat(rangesHi[i]);

		if(rl != null && rh !=null ){
			limits = [rl,rh];
		}

		
		switch(par.type){
			
			case "discrete":
				args.push(sliderValue);
				if((name==par.name)) $( '#params_indicator_' + par.name ).val(round(sliderValue, roundDigits));
			break;
			
			case "continuous":
					sliderMin = $('#params_slider_' + par.name).slider("option", "min");
					sliderMax = $('#params_slider_' + par.name).slider("option", "max");	
					sliderFrac = (sliderValue - sliderMin)/(sliderMax - sliderMin);
					if(par.interactLog){
						parValue = Math.exp(sliderFrac * (Math.log(limits[1]) - Math.log(limits[0])) + Math.log(limits[0]));
					}else{
						parValue = sliderFrac * (limits[1] - limits[0]) + limits[0];
					}
					args.push(parValue);
					if((name==par.name)) $( '#params_indicator_' + par.name ).val(round(parValue, roundDigits));
			break;
		
			default:
				alert("Invalid distribution type (not categorical or continuous?).");
				return;
			break;
		}
	}	
	
	
	var series, d = [];
	
	var limits = p.interactLimits.apply(null,args);
	
	if(plotxrng.length==2){
		if(parseFloat(plotxrng[0])<parseFloat(plotxrng[1]) ){
			limits = [ parseFloat(plotxrng[0]), parseFloat(plotxrng[1]) ];
		}
	}
	
	var fun = (plotType=="cdf") ? p.cdf : p.density ;
	var ttxDigits = (this.type=="discrete") ? 0 : roundDigits;
	var RVtype = this.type;

	switch(RVtype){
	
		case "continuous":
			d = jStat.seq( limits[0], limits[1], plotPoints, function( x ) {
    			return [ x, fun.apply( null, [x].concat(args) )];
				});
			series = {data: d, points: {show: false}, lines: {show: true}};	
			plotOptions[plotType].grid.autoHighlight = false;
		break;
	
		case "discrete":
			for(i=limits[0]; i<=limits[1]; i++){
				d.push( [i, fun.apply( null, [i].concat(args) )] );
			}
			series = {data: d, points: {show: true}, lines: {show: false} };	
			plotOptions[plotType].grid.autoHighlight = true;
			delete plotOptions[plotType].crosshair;
		break;
	
		default:
			alert("Invalid distribution type (not categorical or continuous?).");
			return;
		break;
	}
 
 	var series1 = [];
 	var series2 = [];
 	if(plot && RVtype=="continuous"){
		var data = plot.getData();
		var x1 = data[2];
		var x2 = data[3];
		if(x2.data.length!=0){
		 	x2 = x2.data[0][0];
		 	x1 = x1.data[0][0];
		 	series1 = [ [x1, 0], [x1, fun.apply( null, [x1].concat(args) ) ] ]; 
		 	series2	= [ [x2, 0], [x2, fun.apply( null, [x2].concat(args) ) ] ];
		 }else if(x1.data.length!=0){
			x1 = x1.data[0][0];
		 	series1 = [ [x1, 0], [x1, fun.apply( null, [x1].concat(args) ) ] ]; 
		 }
	}
 
	plot = $.plot($("#"+this.plotid),  [{data: [] }, {data: [] }, {data: series1 }, {data: series2 }, series ], plotOptions[plotType]);	

	
    function addFill(pos){
		var data = plot.getData();
		var x1 = data[2];
		var x2 = data[3];
		if(x2.data.length!=0){
		 	x2 = x2.data[0][0];
		 	x1 = x1.data[0][0];
		 }else if(x1.data.length!=0){
			x2 = limits[0];
			x1 = x1.data[0][0];
		 }else{
			if(pos===undefined) return;
			x2 = limits[0];
			x1 = pos.x;
		 }
		var i=0;
		
		var series = data[4].data;
		var newSeries = [];
		
		var minx = Math.min(x1,x2);
		var maxx = Math.max(x1,x2);
		
		for(;i<series.length;i++){
			if(series[i][0]<=maxx && series[i][0]>=minx) newSeries.push(series[i]);
		}
	
		data[0] = {data: newSeries, lines:{show:true, fill: true, fillColor: areaFillColor} };
	
		plot.setData(data);
		plot.draw();
	}

    function addCDFLines(x){
		var data = plot.getData();
		var cumdens = p.cdf.apply( null, [x].concat(args) );
		
		var newSeries = [ [ limits[0], cumdens ],
						  [ x, cumdens ],
						  [ x, 0 ]
						];
		
	
		data[1] = {data: newSeries, lines:{ show:true }, hoverable: false};
	
		plot.setData(data);
		plot.draw();
	}

 	
 	$("#"+this.plotid).unbind("plothover mouseout plotclick");
 	$("#"+this.plotid).bind("mouseout", function(){
 		$("#tooltip").remove();
 		var data = plot.getData();
		
		if(data[2].data.length==0)
 			data[0].data = [];
 		
 		data[1].data = [];
	
		plot.setData(data);
		plot.draw();
 	});
 	

    $("#"+this.plotid).bind("plotclick", function (event, pos, item) {
         if(plotType=="cdf" || RVtype=="discrete") return;
         var data = plot.getData();
		 var x1 = data[2];
		 var x2 = data[3];
		 if(x1.data.length==0){
		 	data[2].data = [ [ pos.x, 0 ], [ pos.x, p.density.apply( null, [pos.x].concat(args) ) ] ];
		 	data[2].lines = { show: true };
		 }else if(x2.data.length==0){
		 	data[3].data = [ [ pos.x, 0 ], [ pos.x, p.density.apply( null, [pos.x].concat(args) ) ] ];
		 	data[3].lines = { show: true };
		 	addFill(x1.data[0][0], x2.data[0][0]);
		 }else{
		 	data[0].data = [];
		 	data[2].data = [];
		 	data[3].data = [];
		 }
		plot.setData(data);
	
		addFill(pos);
		 
    });
    
    $("#"+this.plotid).bind("plothover", function (event, pos, item) {
            if (item && RVtype=="discrete") {
                if (previousPoint != item.dataIndex) {
                    previousPoint = item.dataIndex;
                    
                    $("#tooltip").remove();
                    var x = round(item.datapoint[0], ttxDigits),
                        y = round(item.datapoint[1], roundDigits);
                    
					var funname = (plotType=="pdf") ? "p" : "F";                    
                    showTooltip(item.pageX, item.pageY,
                                 funname+"(" + x + ") = " + y);
                    if(plotType=="cdf") addCDFLines(item.datapoint[0]);
                }
            }else if(RVtype == "continuous"){
                $("#tooltip").remove();
                var dens = round(p.density.apply( null, [pos.x].concat(args) ), roundDigits);
                var cumdens = round(p.cdf.apply( null, [pos.x].concat(args) ), roundDigits);
                var x = round(pos.x, roundDigits);
                    
                if(plotType=="pdf"){    
	                addFill(pos);
	                var shaded = getShaded(plot, pos, limits, p.cdf, args);
	                showTooltip(pos.pageX, pos.pageY,
                        "p(" + x + ") = " + dens + "<br/>" +
                        "Shaded: " + round(shaded, roundDigits));
            	}else if(plotType=="cdf"){
	                addCDFLines(pos.x);
	                showTooltip(pos.pageX, pos.pageY,
                        "F(" + x + ") = " + cumdens);            	
            	}
            }
            else {
                $("#tooltip").remove();
                previousPoint = null;            
            }
    	}); 
    
    if(RVtype=="continuous" && plotType=="pdf") addFill();
    
}



function refTableHeaderRow(type){

	var head = new Element('thead');
	var row = new Element('tr');
		
	row.adopt(	
	new Element('th', {
		html: "Name",
		scope: "col"
	}),
	new Element('th', {
		html: "Density function",
		scope: "col"
	}),
	new Element('th', {
		html: "Domain",
		scope: "col"
	}),
	new Element('th', {
		html: "Parameters",
		scope: "col"
	}),
	new Element('th', {
		html: "Conjugacy",
		scope: "col"
	}),
	new Element('th', {
		html: "Example",
		scope: "col"
	}),
	new Element('th', {
		html: "Reference",
		scope: "col"
	})
	);
	
	head.grab(row);
	
	head.inject(document.id(type+'_distributiontable'));
}

function refTableRow(odd, type){
		
	var idPre = type + "_dist_" + this.name;
	var rowname = idPre + "_row";
	
	var anch = new Element('a', {
		name: this.name+"table"
	});
	
	var row = new Element('tr', {
		id: rowname 
	});
	
	var example = new Element('td', {
		id: idPre + "_example"
	});
	
	example.grab(
		new Element('a', {
	    	href: "distributionDisplay.html?dist="+this.name,
   		 	id: idPre + "_interactlink",
    		html: "Interact",
			title: "The "+this.label+" distribution",
			'data-milkbox-size': "width:650,height:370",
			'data-milkbox': "dist"
		})
	);
	
	var reference = new Element('td', {
		id: idPre + "_reference"
	});
	
	reference.grab(
		new Element('a', {
    		href: this.referenceurl.link,
    		html: this.referenceurl.name,
    		target: "_blank"
		})
	);

	row.adopt(	
	new Element('th', {
		id: idPre + "_name",
		'class': 'column1',
		html: this.label,
		scope: "row"
	}),
	new Element('td', {
		id: idPre + "_density",
		html: "\\["+this.p.densityDisplay+"\\]"
	}),
	new Element('td', {
		id: idPre + "_domain",
		html: "\\("+this.p.displayLimits+"\\)"
	}),
	new Element('td', {
		id: idPre + "_parameters",
		html: "\\("+""+"\\)"
	}),
	new Element('td', {
		id: idPre + "_conjugate",
		html: ""
	}),
	example,
	reference
	);
	
	
	if(odd) row.set('class','odd');
	
	row.inject(document.id(type+'_distributiontablebody'));
	anch.inject(document.id(idPre+"_name"));

//MathJax.Hub.Queue(["Typeset",MathJax.Hub,document.getElementById(rowname)]);
}

function createInterfaceElements(ptznNum){
	
	var nptzn = this.parametrizations.length;
	p = (ptznNum > (nptzn - 1)) ? this.p : this.parametrizations[ptznNum];


	var npars = p.params.length;
	var text="";
	var i = 0;
	var s, rl, rh;
	for(;i<npars;i++ ){
		s = starts[i]==undefined ? null : parseFloat(starts[i]);
		rl = rangesLo[i]==undefined ? null : parseFloat(rangesLo[i]);
		rh = rangesHi[i]==undefined ? null : parseFloat(rangesHi[i]);
		p.params[i].createElement(s,rl,rh);
	}
	
}

distribution.prototype.updatePlot = updatePlot;
distribution.prototype.refTableRow = refTableRow;
distribution.prototype.createInterfaceElements = createInterfaceElements;



