/*****/
// Normal distribution
/*****/

var normalMean = new unboundedParameter(
	"mu",
	"\\mu",
	function() { return [-5,5]; },
	false,
	0,
	"continuous",
	"normal",
	"location"
);

var normalVariance = new positiveParameter(
	"sigma2",
	"\\sigma^2",
	function() { return [0.1,10]; },
	true,
	1,
	"continuous",
	"inversegamma",
	"variance"
);

var normalStandardDeviation = new positiveParameter(
	"sigma",
	"\\sigma",
	function() { return [0.1,10]; },
	true,
	1,
	"continuous",
	null,
	"standard deviation"
);


var normalPrecision = new positiveParameter(
	"tau",
	"\\tau",
	function() { return [0.1,10]; },
	true,
	1,
	"continuous",
	"gamma",
	"precision"
);

var normalMeanVariance = new distributionParametrization(
	"mean/variance",
	[normalMean, normalVariance],
	function(mu,sig2) { return [Number.NEGATIVE_INFINITY,Number.POSITIVE_INFINITY]; },
	function(mu,sig2) { return [-5,5]; },
	"(-\\infty,\\infty)",
	function(x, mu, sig2) { return jStat.normal.pdf(x, mu,Math.sqrt(sig2)); },
	"\\left(2\\pi\\sigma^2\\right)^{-\\frac{1}{2}}\\exp\\left\\{-\\frac{1}{2\\sigma^2}\\left(x-\\mu\\right)^2\\right\\}",
	function(x, mu, sig2) { return jStat.normal.cdf(x, mu,Math.sqrt(sig2)); },
	"normalinversegamma",
	function(mu,sig2){ return sig2>0;},
	{
		mean: { 
			fun: function(mu, sig2) { return jStat.normal.mean(mu, Math.sqrt(sig2)); }, 
			display: "\\mu" 
			},
		variance: {
			fun: function(mu, sig2) { return jStat.normal.variance(mu, Math.sqrt(sig2)); }, 
			display: "\\sigma^2" 
			},
		median: {
			fun: function(mu, sig2) { return jStat.normal.median(mu, Math.sqrt(sig2)); }, 
			display: "\\mu" 
			},
		mode: {
			fun: function(mu, sig2) { return jStat.normal.mode(mu, Math.sqrt(sig2)); }, 
			display: "\\mu" 
			}

	},
	null
);

var normalMeanPrecision = new distributionParametrization(
	"mean/precision",
	[normalMean, normalPrecision],
	function(mu,tau) { return [Number.NEGATIVE_INFINITY,Number.POSITIVE_INFINITY]; },
	function(mu,tau) { return [-5,5]; },
	"(-\\infty,\\infty)",
	function(x,mu,tau){ return jStat.normal.pdf(x,mu,Math.sqrt(1/tau)); },
	"\\left(\\frac{\\tau}{2\\pi}\\right)^{\\frac{1}{2}}\\exp\\left\\{-\\frac{\\tau}{2}\\left(x-\\mu\\right)^2\\right\\}",
	function(x,mu,tau){ return jStat.normal.cdf(x,mu,Math.sqrt(1/tau)); },
	"normalgamma",
	function(mu,tau){ return tau>0;},
	{
		mean: { 
			fun: function(mu, tau) { return jStat.normal.mean(mu, 1/Math.sqrt(tau)); }, 
			display: "\\mu" 
			},
		variance: {
			fun: function(mu, tau) { return jStat.normal.variance(mu, 1/Math.sqrt(tau)); }, 
			display: "\\frac{1}{\\tau}" 
			},
		median: {
			fun: function(mu, tau) { return jStat.normal.median(mu, 1/Math.sqrt(tau)); }, 
			display: "\\mu" 
			},
		mode: {
			fun: function(mu, tau) { return jStat.normal.mode(mu, 1/Math.sqrt(tau)); }, 
			display: "\\mu" 
			}
	},
	null

);

var normalMeanStandardDeviation = new distributionParametrization(
	"mean/standard deviation",
	[normalMean, normalStandardDeviation],
	function(mu,sig2) { return [Number.NEGATIVE_INFINITY,Number.POSITIVE_INFINITY]; },
	function(mu,sig2) { return [-5,5]; },
	"(-\\infty,\\infty)",
	function(x, mu, sig) { return jStat.normal.pdf(x, mu, sig); },
	"\\left(2\\pi\\sigma^2\\right)^{-\\frac{1}{2}}\\exp\\left\\{-\\frac{1}{2\\sigma^2}\\left(x-\\mu\\right)^2\\right\\}",
	function(x, mu, sig) { return jStat.normal.cdf(x, mu, sig); },
	null,
	function(mu,sig){ return sig>0;},
	{
		mean: { 
			fun: function(mu, sig) { return jStat.normal.mean(mu, sig); }, 
			display: "\\mu" 
			},
		variance: {
			fun: function(mu, sig) { return jStat.normal.variance(mu, sig); }, 
			display: "\\sigma" 
			},
		median: {
			fun: function(mu, sig) { return jStat.normal.median(mu, sig); }, 
			display: "\\mu" 
			},
		mode: {
			fun: function(mu, sig) { return jStat.normal.mode(mu, sig); }, 
			display: "\\mu" 
			}

	},
	null
);


distributions["normal"] = new distribution(
	"normal",
	"Normal/Gaussian",
	"continuous",
	[ normalMeanVariance, normalMeanPrecision, normalMeanStandardDeviation],
	null,
	{ 
		name:"Wikipedia",
		link:"http://en.wikipedia.org/wiki/Normal_distribution"
	}
);


/*****/
// Gamma distribution
/*****/

var gammaShape = new positiveParameter(
	"k",
	"k",
	function() { return [.1,10]; },
	true,
	1,
	"continuous",
	null,
	"shape"
);

var gammaScale = new positiveParameter(
	"s",
	"s",
	function() { return [0.1,10]; },
	true,
	1,
	"continuous",
	"inversegamma",
	"scale"
);

var gammaRate = new positiveParameter(
	"theta",
	"\\theta",
	function() { return [0.1,10]; },
	true,
	1,
	"continuous",
	"gamma",
	"rate"
);

var gammaShapeScale = new distributionParametrization(
	"shape/scale",
	[gammaShape, gammaScale],
	function(k,s) { return [0,Number.POSITIVE_INFINITY]; },
	function(k,s) { return [.01,10]; },
	"(0,\\infty)",
	jStat.gamma.pdf,
	"\\frac{1}{\\Gamma(k)s^{k}} x^{k - 1} \\exp\\left\\{-\\frac{x}{s}\\right\\}",
	jStat.gamma.cdf,
	null,
	function(k,s){ return s>0 && k>0;},
	{
		mean: { 
			fun: jStat.gamma.mean, 
			display: "ks" 
			},
		variance: {
			fun: jStat.gamma.variance, 
			display: "ks^2"  
			},
		mode: { 
			fun: jStat.gamma.mode, 
			display: "(k-1)s, k\\geq 1" 
			}
	},
	null

);

var gammaShapeRate = new distributionParametrization(
	"shape/rate",
	[gammaShape, gammaRate],
	function(k,theta) { return [0,Number.POSITIVE_INFINITY]; },
	function(k,theta) { return [.01,10]; },
	"(0,\\infty)",
	function(x, k, theta) { return jStat.gamma.pdf(x, k, 1/theta); },
	"\\frac{\\theta^k}{\\Gamma(k)} x^{k - 1} \\exp\\left\\{-\\theta x\\right\\}",
	function(x, k, theta) { return jStat.gamma.cdf(x, k, 1/theta); },
	null,
	function(k,theta){ return theta>0 && k>0;},
	{
		mean: { 
			fun: function(k,theta) { return jStat.gamma.mean(k, 1/theta); }, 
			display: "\\frac{k}{\\theta}" 
			},
		variance: {
			fun: function(k,theta) { return jStat.gamma.variance(k, 1/theta); }, 
			display: "\\frac{k}{\\theta^2}"  
			},
		mode: { 
			fun: function(k,theta) { return jStat.gamma.mode(k, 1/theta); }, 
			display: "\\frac{k-1}{\\theta}, k\\geq 1" 
			}
	},
	null

);
distributions["gamma"] = new distribution(
	"gamma",
	"Gamma",
	"continuous",
	[ gammaShapeScale, gammaShapeRate ],
	null,
	{ 
		name:"Wikipedia",
		link:"http://en.wikipedia.org/wiki/Gamma_distribution"
	}
);


/*****/
// Inverse Gamma distribution
/*****/

var invgammaShape = new positiveParameter(
	"alpha",
	"\\alpha",
	function() { return [.1,10]; },
	true,
	1,
	"continuous",
	null,
	"shape"
);

var invgammaScale = new positiveParameter(
	"beta",
	"\\beta",
	function() { return [0.1,10]; },
	true,
	1,
	"continuous",
	"gamma",
	"scale"
);

var invgammaShapeScale = new distributionParametrization(
	"shape/scale",
	[invgammaShape, invgammaScale],
	function(alpha,beta) { return [0,Number.POSITIVE_INFINITY]; },
	function(alpha,beta) { return [.01,15]; },
	"(0,\\infty)",
	jStat.invgamma.pdf,
	"\\frac{\\beta^{\\alpha}}{\\Gamma(\\alpha)} x^{-\\alpha - 1} \\exp\\left\\{-\\frac{\\beta}{x}\\right\\}",
	jStat.invgamma.cdf,
	null,
	function(alpha,beta){ return alpha>0 && beta>0;},
	{
		mean: { 
			fun: jStat.invgamma.mean, 
			display: "\\frac{\\beta}{\\alpha-1}, \\alpha>1" 
			},
		variance: {
			fun: jStat.invgamma.variance, 
			display: "\\frac{\\beta^2}{(\\alpha-1)^2(\\alpha-2)}, \\alpha>2"  
			},
		mode: { 
			fun: jStat.invgamma.mode, 
			display: "\\frac{\\beta}{\\alpha+1}" 
			}
	},
	null
);

distributions["invgamma"] = new distribution(
	"invgamma",
	"Inverse Gamma",
	"continuous",
	[ invgammaShapeScale ],
	null,
	{ 
		name:"Wikipedia",
		link:"http://en.wikipedia.org/wiki/Inverse-gamma_distribution"
	}
);



/*****/
// Central F distribution
/*****/

var Fdf1 = new positiveParameter(
	"nu1",
	"\\nu_1",
	function() { return [1,40]; },
	false,
	5,
	"discrete",
	null,
	"numerator df"
);

var Fdf2 = new positiveParameter(
	"nu2",
	"\\nu_2",
	function() { return [1,40]; },
	false,
	5,
	"discrete",
	null,
	"denominator df"
);

var centralFpar = new distributionParametrization(
	"central",
	[Fdf1, Fdf2],
	function(nu1,nu2) { return [0,Number.POSITIVE_INFINITY]; },
	function(nu1,nu2) { return [.01,10]; },
	"(0,\\infty)",
	jStat.centralF.pdf,
	"\\frac{1}{x\\mbox{Be}\\left(\\frac{\\nu_1}{2},\\frac{\\nu_2}{2}\\right)}\\sqrt{\\frac{(\\nu_1x)^{\\nu_1}\\nu_2^{\\nu_2}}{(\\nu_1x + \\nu_2)^{\\nu_1+\\nu_2}}}",
	jStat.centralF.cdf,
	null,
	function(nu1,nu2){ return nu1>0 && nu2>0;},
	{
		mean: { 
			fun: jStat.centralF.mean, 
			display: "\\frac{\\nu_2}{\\nu_2-2}, \\nu_2>2" 
			},
		variance: {
			fun: jStat.centralF.variance, 
			display: "\\frac{2\\nu_2^2(\\nu_1 + \\nu_2-2)}{\\nu_1(\\nu_2-2)^2(\\nu_2-4)}, \\nu_2>4"  
			},
		mode: { 
			fun: jStat.centralF.mode, 
			display: "\\frac{\\nu_2(\\nu_1 - 2)}{\\nu_1(\\nu_2+2)}, \\nu_1<2" 
			}
	},
	null
);

distributions["centralF"] = new distribution(
	"centralF",
	"central F",
	"continuous",
	[ centralFpar ],
	null,
	{ 
		name:"Wikipedia",
		link:"http://en.wikipedia.org/wiki/F_distribution"
	}
);



/*****/
// Cauchy distribution
/*****/

var cauchyLocation= new unboundedParameter(
	"mu",
	"\\mu",
	function() { return [-8,8];},
	false,
	0,
	"continuous",
	null,
	"location"
);

var cauchyScale = new positiveParameter(
	"sigma",
	"\\sigma",
	function() { return [0.1,10];},
	true,
	1,
	"continuous",
	null,
	"scale"
);

var cauchyLocationScale = new distributionParametrization(
	"location/scale",
	[cauchyLocation, cauchyScale],
	function(mu,sig) { return [Number.NEGATIVE_INFINITY,Number.POSITIVE_INFINITY]; },
	function(mu,sig) { return [-8,8]; },
	"(-\\infty,\\infty)",
	jStat.cauchy.pdf,
	"\\frac{1}{\\pi\\sigma\\left(1+\\left(\\frac{x-\\mu}{\\sigma}\\right)^2\\right)}",
	jStat.cauchy.cdf,
	null,
	function(mu,sig){ return sig>0;},
	{
		mean: { 
			fun: function(mu, sig) { return undefined; }, 
			display: "undefined" 
			},
		variance: {
			fun: function(mu, sig) { return undefined; }, 
			display: "undefined" 
			},
		median: {
			fun: jStat.cauchy.median, 
			display: "\\mu" 
			},
		mode: {
			fun: jStat.cauchy.mode, 
			display: "\\mu" 
			}
	},
	null

);

distributions["cauchy"] = new distribution(
	"cauchy",
	"Cauchy",
	"continuous",
	[ cauchyLocationScale ],
	null,
	{ 
		name:"Wikipedia",
		link:"http://en.wikipedia.org/wiki/Cauchy_distribution"
	}
);

/*****/
// t distribution
/*****/

var tnu = new positiveParameter(
	"nu",
	"\\nu",
	function() { return [1,50]; },
	false,
	5,
	"discrete",
	null,
	"degrees of freedom"
);


var tLocation= new unboundedParameter(
	"mu",
	"\\mu",
	function() { return [-8,8];},
	false,
	0,
	"continuous",
	null,
	"location"
);

var tScale = new positiveParameter(
	"sigma",
	"\\sigma",
	function() { return [0.1,10];},
	true,
	1,
	"continuous",
	null,
	"scale"
);

var studenttLocationScale = new distributionParametrization(
	"location/scale",
	[tnu, tLocation, tScale],
	function(nu,mu,sig) { return [Number.NEGATIVE_INFINITY,Number.POSITIVE_INFINITY]; },
	function(nu,mu,sig) { return [-10,10]; },
	"(-\\infty,\\infty)",
	function(x,nu,mu,sig){ return jStat.studentt.pdf( (x - mu)/sig, nu)/sig; },
	"\\frac{\\Gamma\\left(\\frac{\\nu+1}{2}\\right)}{\\sqrt{\\pi\\nu\\sigma^2}\\Gamma\\left(\\frac{\\nu}{2}\\right)}\\left(1+\\frac{(x-\\mu)^2}{\\nu\\sigma^2}\\right)^{-\\frac{\\nu+1}{2}}",
	function(x,nu,mu,sig){ return jStat.studentt.cdf( (x - mu)/sig, nu); },
	null,
	function(nu,mu,sig){ return sig > 0 && nu > 0;},
	{
		mean: { 
			fun: function(nu, mu, sig) { return nu>1?mu:undefined; }, 
			display: "\\mu, \\nu>1" 
			},
		variance: {
			fun: function(nu, mu, sig) { return nu>2 ? nu/(nu-2) : undefined; }, 
			display: "\\frac{\\nu}{\\nu-2}\\sigma^2, \\nu>2" 
			},
		median: {
			fun: function(nu, mu, sig) { return mu; },  
			display: "\\mu" 
			},
		mode: {
			fun: function(nu, mu, sig) { return mu; },
			display: "\\mu" 
			}
	},
	null

);

distributions["studentt"] = new distribution(
	"studentt",
	"Student's t",
	"continuous",
	[ studenttLocationScale ],
	null,
	{ 
		name:"Wikipedia",
		link:"http://en.wikipedia.org/wiki/Student's_t-distribution"
	}
);



/*****/
// Chi-squared distribution
/*****/

var chisqnu = new positiveParameter(
	"nu",
	"\\nu",
	function() { return [1,10]; },
	false,
	3,
	"discrete",
	null,
	"degrees of freedom"
);


var chisqScale = new positiveParameter(
	"sigma",
	"\\sigma",
	function() { return [0.1,10];},
	true,
	1,
	"continuous",
	null,
	"scale"
);

var chisqScalePar = new distributionParametrization(
	"scaled",
	[chisqnu, chisqScale],
	function(nu,sig) { return [0,Number.POSITIVE_INFINITY]; },
	function(nu,sig) { return [0,40]; },
	"[0,\\infty)",
	function(x,nu,sig){ return jStat.chisquare.pdf( x/sig, nu)/sig; },
	"\\frac{1}{(2\\sigma)^\\frac{\\nu}{2}\\Gamma\\left(\\frac{\\nu}{2}\\right)}x^{\\frac{\\nu}{2}-1}\\exp\\left\\{-\\frac{x}{2\\sigma}\\right\\}",
	function(x,nu,sig){ return jStat.chisquare.cdf( x/sig, nu); },
	null,
	function(nu,sig){ return sig > 0 && nu > 0;},
	{
		mean: { 
			fun: function(nu, sig) { return nu*sig; }, 
			display: "\\sigma\\nu" 
			},
		variance: {
			fun: function(nu, sig) { return 2*nu*sig*sig; }, 
			display: "2\\nu\\sigma^2" 
			}
	},
	null

);

distributions["chisquare"] = new distribution(
	"chisquare",
	"Chi-squared",
	"continuous",
	[ chisqScalePar ],
	null,
	{ 
		name:"Wikipedia",
		link:"http://en.wikipedia.org/wiki/Chi-squared_distribution"
	}
);




/*****/
// Beta distribution
/*****/

var betaA = new positiveParameter(
	"a",
	"a",
	function() { return [.1,10]; },
	true,
	1,
	"continuous",
	null,
	"shape"
);


var betaB = new positiveParameter(
	"b",
	"b",
	function() { return [.1,10]; },
	true,
	1,
	"continuous",
	null,
	"shape"
);

var betaAB = new distributionParametrization(
	"a/b",
	[betaA, betaB],
	function(a,b) { return [0,1]; },
	function(a,b) { return [0,1]; },
	"(0,1)",
	jStat.beta.pdf,
	"\\frac{1}{\\mbox{Be}(a,b)} x^{a-1} (1-x)^{b-1}",
	jStat.beta.cdf,
	null,
	function(a,b){ return a>0 && b>0;},
	{
		mean: { 
			fun: jStat.beta.mean, 
			display: "\\frac{a}{a+b}" 
			},
		variance: {
			fun: jStat.beta.variance, 
			display: "\\frac{ab}{(a+b)^2(a+b+1)}" 
			},
		median: {
			fun: jStat.beta.median, 
			display: "no closed form" 
			},
		mode: {
			fun: jStat.mode.median, 
			display: "\\frac{a-1}{a+b-2}, a>1, b>1" 
			}

	},
	null

);

distributions["beta"] = new distribution(
	"beta",
	"Beta",
	"continuous",
	[ betaAB ],
	null,
	{ 
		name:"Wikipedia",
		link:"http://en.wikipedia.org/wiki/Beta_distribution"
	}
);



/*****/
// Log Normal distribution
/*****/

var lognormalMean = new unboundedParameter(
	"mu",
	"\\mu",
	function() { return [-2,2]; },
	false,
	1,
	"continuous",
	"normal",
	"log-scale"
);

var lognormalVariance = new positiveParameter(
	"sigma2",
	"\\sigma^2",
	function() { return [.1,10]; },
	true,
	1,
	"continuous",
	"inversegamma",
	"shape"
);


var lognormalMeanVariance = new distributionParametrization(
	"mu/sigma2",
	[lognormalMean, lognormalVariance],
	function(mu,sig2) { return [0,Number.POSITIVE_INFINITY]; },
	function(mu,sig2) { return [0,15]; },
	"(0,\\infty)",
	function(x, mu, sig2) { return jStat.lognormal.pdf(x, mu,Math.sqrt(sig2)); },
	"\\left(\\pi\\sigma^2x^2\\right)^{-\\frac{1}{2}}\\exp\\left\\{-\\frac{1}{2\\sigma^2}\\left(\\log(x)-\\mu\\right)^2\\right\\}",
	function(x, mu, sig2) { return jStat.lognormal.cdf(x, mu,Math.sqrt(sig2)); },
	"normalinversegamma",
	function(mu,sig2){ return sig2>0;},
	{
		mean: { 
			fun: function(mu, sig2) { return jStat.lognormal.mean(mu, Math.sqrt(sig2)); }, 
			display: "\\exp\\left\\{\\mu + \\frac{\\sigma^2}{2}\\right\\}" 
			},
		variance: {
			fun: function(mu, sig2) { return jStat.lognormal.variance(mu, Math.sqrt(sig2)); }, 
			display: "\\left(e^{\\sigma^2}-1\\right)\\exp\\left\\{2\\mu + \\sigma^2\\right\\}" 
			},
		median: {
			fun: function(mu, sig2) { return jStat.lognormal.median(mu, Math.sqrt(sig2)); }, 
			display: "e^\\mu" 
			},
		mode: {
			fun: function(mu, sig2) { return jStat.lognormal.mode(mu, Math.sqrt(sig2)); }, 
			display: "\\exp\\left\\{\\mu-\\sigma^2\\right\\}" 
			}

	},
	null
);


distributions["lognormal"] = new distribution(
	"lognormal",
	"Log-normal",
	"continuous",
	[ lognormalMeanVariance ],
	null,
	{ 
		name:"Wikipedia",
		link:"http://en.wikipedia.org/wiki/Log-normal_distribution"
	}
);



/*****/
// Weibull distribution
/*****/

var weibullShift = new unboundedParameter(
	"x0",
	"x_0",
	function() { return [-3,5]; },
	false,
	0,
	"continuous",
	null,
	"shift"
);


var weibullShape = new positiveParameter(
	"k",
	"k",
	function() { return [.1,10]; },
	true,
	1,
	"continuous",
	null,
	"shape"
);

var weibullScale = new positiveParameter(
	"s",
	"s",
	function() { return [0.1,10]; },
	true,
	1,
	"continuous",
	"inversegamma",
	"scale"
);

var weibullRate = new positiveParameter(
	"theta",
	"\\theta",
	function() { return [0.1,10]; },
	true,
	1,
	"continuous",
	"gamma",
	"rate"
);

var weibullShiftShapeScale = new distributionParametrization(
	"shift/scale/shape",
	[weibullShift,weibullScale, weibullShape],
	function(x0,s,k) { return [x0,Number.POSITIVE_INFINITY]; },
	function(x0,s,k) { return [x0,x0 + 10]; },
	"(x_0,\\infty)",
	function(x,x0,s,k) { return jStat.weibull.pdf(x - x0, s, k); },
	"\\frac{k}{s}\\left(\\frac{x-x_0}{s}\\right)^{k-1} \\exp\\left\\{-\\left(\\frac{x-x_0}{s}\\right)^k\\right\\}",
	function(x,x0,s,k) { return jStat.weibull.cdf(x - x0, s, k); },
	null,
	function(x0,s,k){ return s>0 && k>0;},
	{
		mean: { 
			fun: function(x0,s,k) { return jStat.weibull.mean(s,k) + x0; }, 
			display: "x_0 + s\\Gamma\\left(1+\\frac{1}{k}\\right)" 
			},
		variance: {
			fun: function(x0,s,k) { return jStat.weibull.variance(s,k); }, 
			display: "s^2\\Gamma\\left(1+\\frac{2}{k}\\right) - \\left(x_0 + s\\Gamma\\left(1+\\frac{1}{k}\\right)\\right)^2"  
			},
		mode: { 
			fun: function(x0,s,k) { return jStat.weibull.mode(s,k) + x0; },
			display: "s\\left(\\frac{k-1}{k}\\right)^{\\frac{1}{k}}, k > 1" 
			},
		median: { 
			fun: function(x0,s,k) { return jStat.weibull.median(s,k) + x0; },
			display: "s\\left(\\log(2)\\right)^{\\frac{1}{k}}" 
			}
	},
	null
);

var weibullShiftShapeRate = new distributionParametrization(
	"shift/rate/shape",
	[weibullShift,weibullRate, weibullShape],
	function(x0,theta,k) { return [x0,Number.POSITIVE_INFINITY]; },
	function(x0,theta,k) { return [x0,x0 + 10]; },
	"(x_0,\\infty)",
	function(x,x0,theta,k) { return jStat.weibull.pdf(x - x0, 1/theta, k); },
	"k\\theta\\left(x\\theta\\right)^{k-1} \\exp\\left\\{-\\left(\\theta(x-x_0)\\right)^k\\right\\}",
	function(x,x0,theta,k) { return jStat.weibull.cdf(x - x0, 1/theta, k); },
	null,
	function(x0,theta,k){ return theta>0 && k>0;},
	{
		mean: { 
			fun: function(x0,theta,k) { return jStat.weibull.mean(1/theta,k) + x0; }, 
			display: "x_0 + \\frac{1}{\\theta}\\Gamma\\left(1+\\frac{1}{k}\\right)" 
			},
		variance: {
			fun: function(x0,theta,k) { return jStat.weibull.variance(1/theta,k); }, 
			display: "\\frac{1}{\\theta^2}\\Gamma\\left(1+\\frac{2}{k}\\right) - \\left(x_0 + \\frac{1}{\\theta}\\Gamma\\left(1+\\frac{1}{k}\\right)\\right)^2"  
			},
		mode: { 
			fun: function(x0,theta,k) { return jStat.weibull.mode(1/theta,k) + x0; },
			display: "\\frac{1}{\\theta}\\left(\\frac{k-1}{k}\\right)^{\\frac{1}{k}}, k > 1" 
			},
		median: { 
			fun: function(x0,theta,k) { return jStat.weibull.median(1/theta,k) + x0; },
			display: "\\frac{1}{\\theta}\\left(\\log(2)\\right)^{\\frac{1}{k}}" 
			}
	},
	null
);

distributions["weibull"] = new distribution(
	"weibull",
	"three-parameter Weibull",
	"continuous",
	[ weibullShiftShapeScale, weibullShiftShapeRate ],
	null,
	{ 
		name:"Wikipedia",
		link:"http://en.wikipedia.org/wiki/Weibull_distribution"
	}
);





////***************
// DISCRETE
////***************

/*****/
// Binomial distribution
/*****/

var binomialN = new positiveParameter(
	"N",
	"N",
	function() { return [1,100]; },
	false,
	20,
	"discrete",
	null,
	"sample size"
);

var binomialp = new distributionParameter(
	"p",
	"p",
	function() { return [0,1]; },
	function() { return [0,1]; },
	false,
	.5,
	"continuous",
	"beta",
	"probability of success"
);

var binomialNp = new distributionParametrization(
	"probability",
	[binomialN, binomialp],
	function(N, p) { return [0,N]; },
	function(N, p) { return [0,N]; },
	"[0,N]",
	jStat.binomial.pdf,
	"\\binom{N}{x} p^x (1-p)^{N-x}",
	jStat.binomial.cdf,
	"beta",
	function(N,p){ return N>0 && is_int(N) && p<1 && p>0;},
	{
		mean: { 
			fun: jStat.binomial.mean, 
			display: "Np" 
			},
		variance: {
			fun: jStat.binomial.variance, 
			display: "Np(1-p)" 
			}
	},
	null

);

distributions["binomial"] = new distribution(
	"binomial",
	"Binomial",
	"discrete",
	[ binomialNp ],
	null,
	{ 
		name:"Wikipedia",
		link:"http://en.wikipedia.org/wiki/Binomial_distribution"
	}
);


/*****/
// Poisson distribution
/*****/

var poissonRate = new positiveParameter(
	"lambda",
	"\\lambda",
	function() { return [1/10,10]; },
	true,
	1,
	"continuous",
	null,
	"rate"
);

var poissonRate = new distributionParametrization(
	"rate",
	[ poissonRate ],
	function(lambda) { return [0,Number.POSITIVE_INFINITY]; },
	function(lambda) { return [0,25]; },
	"[0,\\infty)",
	jStat.poisson.pdf,
	"\\frac{\\lambda^x}{x!} \\exp\\left\\{-\\lambda\\right\\}",
	jStat.poisson.cdf,
	"gamma",
	function(lambda){ return lambda>0;},
	{
		mean: { 
			fun: jStat.poisson.mean, 
			display: "\\lambda" 
			},
		variance: {
			fun: jStat.poisson.variance, 
			display: "\\lambda" 
			}
	},
	null
);

distributions["poisson"] = new distribution(
	"poisson",
	"Poisson",
	"discrete",
	[ poissonRate ],
	null,
	{ 
		name:"Wikipedia",
		link:"http://en.wikipedia.org/wiki/Poisson_distribution"
	}
);

/*****/
// Negative Binomial distribution
/*****/

var negbinomialr = new positiveParameter(
	"r",
	"r",
	function() { return [1,50]; },
	false,
	20,
	"discrete",
	null,
	"number of successes required"
);

var negbinomialp = new distributionParameter(
	"p",
	"p",
	function() { return [0,1]; },
	function() { return [0,1]; },
	false,
	.2,
	"continuous",
	"beta",
	"probability of failure"
);

var negbinomialrp = new distributionParametrization(
	"probability",
	[negbinomialr, negbinomialp],
	function(r, p) { return [0,Number.POSITIVE_INFINITY]; },
	function(r, p) { return [0,50]; },
	"[0,\\infty)",
	jStat.negbin.pdf,
	"\\binom{x+r-1}{x} p^x (1-p)^{r}",
	jStat.negbin.cdf,
	"beta",
	function(r,p){ return r>0 && is_int(r) && p<1 && p>0;},
	{
		mean: { 
			fun: function(r,p){ return p*r/(1-p);}, 
			display: "\\frac{rp}{1-p}" 
			},
		variance: {
			fun: function(r,p){ return p*r/(1-p)^2;},
			display: "\\frac{rp}{(1-p)^2}" 
			}
	},
	null

);

distributions["negativebinomial"] = new distribution(
	"negativebinomial",
	"Negatve binomial",
	"discrete",
	[ negbinomialrp ],
	null,
	{ 
		name:"Wikipedia",
		link:"http://en.wikipedia.org/wiki/Negative_binomial_distribution"
	}
);

