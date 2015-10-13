/**************************************************
**
** Requirements
**
***************************************************/
var elasticsearch = require('elasticsearch');
var markupjs = require('markup-js');
var fs = require('fs');
var colour = require('colour')
/**************************************************
**
** Varables
**
***************************************************/
// Disable Info messages
console.info = function (){};
/**************************************************
**
** Varables
**
***************************************************/
// Count of documents retrieved which tells us when the scan/scroll is finished
var count = 0;
// the Host to connect to
var url="localhost:9200"
// Default search template (json markup) 
var searchFilename="default.search"
// The DSL Query to Elasticsearch 
// - I'll probably set a default so the script has no requirements to just work
var searchTemplate = "";
// set loglevel
var loglevel="error"
// This is used for the JSON Markup - I'll probably add a file option 
var context = {
    index:"_all",
    from:"now-10m",
    fetchsize: 100
}
/***************************************************
**
** Setup
**
***************************************************/
/*******************************
**
** Process Command Line 
**
********************************/
console.info("Processing Commandline arguments");
process.argv.forEach(function (val, ind, array) {
    if(/^(-h|--help|-\?)$/.test(val) ){
        console.log(process.argv[0]+":");
        console.log("\t[--url="+url+"]");
        console.log("\t[--search=<filename> default: "+searchFilename);
        console.log("\t[--fetchsize='20'  default: 100 ");
        console.log("\t[--context='{ 'custom':'json'}'  default:"+JSON.stringify(context) );
	console.log("\t\t\tContext is what varables pass to the search template for json markup");
	console.log("\t\t\tcontext=<key>=<val> is a way to set any varable inside the context array. Make sure this is used after --contextfile or --context=<customejson>");
        console.log("\t[--index=<index>|--context=index=<index>     default: "+context.index);
        process.exit(1)
    }
    if(val.indexOf('=') >0){
        var s = val.split(/=/);
        console.info(s[0] + ' : ' + s[1]); 
        if (s[0] === "--url" ){
            url=s[1];
        }
	if (s[0] === "--loglevel" ){
	    loglevel = s[1];
	}
	if (s[0] === "--contextfile" ){
	    context = s[1];
	    if (fs.existsSync(s[1])) {
			var searchTemplate = fs.readFileSync(s[1],'utf8'); 
			console.info(searchTemplate);
	    }else{
			console.error("file does not exist:"+s[1]);
			process.exit(2);
	    }
	    context = JSON.parse(context);
	}
	if (s[0] === "--context" && s.length == 2){
	    context = s[1];
	    context = JSON.parse(context);
	}
        if (s[0] === "--context" && s.length > 2 ){
	    console.log(s);
            context[s[1]]=s[2]
	    console.info("context."+s[1]+"="+s[2]);
        }
        if (s[0] === "--search"){
            searchFilename=s[1];
        }
    }
});
// Convert CLI options to an actual regex expression and set the regex output to be displayed
if (fs.existsSync(searchFilename)) {
	var searchTemplate = fs.readFileSync(searchFilename,'utf8'); 
}else{
	console.error("file does not exist:"+searchFilename);
	process.exit(2);
}
// Open the Elasticsearch Connection
var client = new elasticsearch.Client({
  host: url,
  protocol: 'http',
  index: context.index,
  keepAlive: true ,
  ignore: [404],
  suggestCompression: true,
  sniffOnStart: true,
  sniffInterval: 60000,
});
/**************************************************
**
** Test Connection make sure it is available
**
***************************************************/
client.ping({
  requestTimeout: 1000,
}, function (error) {
  if (error) {
    console.error('elasticsearch cluster maybe down!');
    process.exit(1);
  }else{
    console.log('Connected to Elasticsearch cluster.')	
  } 
});

/********************************************************************************
**
** Functions
**
*********************************************************************************/
// Main search
	console.info("Running search".blue);
	// convert the Template to a valid search
	var search = markupjs.up(searchTemplate,context); 
	// Execute the Search
	client.search( JSON.parse(search) , ph = function printHits(error, response) {
	  	// Loop over the events
	 	if (error != undefined) {
			console.error("ERR:".red+error);
			return;
		}
	  	response.hits.hits.forEach(function (hit) {
		    console.log(hit._source["@timestamp"].red
			+": ".green+hit._index.green+":".green
			+hit._source.message)
		    // Count the number of document read so far
		    count++;
	 	});
	 	// If the retrieved docements equals the count then we are done
		 if ( count >= response.hits.total ){ 
			return;
		 }
		 // Else query the scroll again to get more documents
		 client.scroll({
		      scrollId: response._scroll_id,
		      scroll: '30s'
		 }, ph);
	});