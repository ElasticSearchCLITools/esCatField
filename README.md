# esCatField
```
node ./esCatField.js  --help
Processing Commandline arguments
node:
	[--url=localhost:9200]
	[--search=<filename> default: default.search
	[--fetchsize='20'  default: 100 
	[--context='{ 'custom':'json'}'  default:{"index":"_all","fetchsize":100}
		Context is what varables pass to the search template for json markup
		context=<key>=<val> is a way to set any varable inside the context array. 
		Make sure this is used after --contextfile or --context=<customejson>
	[--index=<index>|--context=index=<index>]     default: _all
```

Example Command

node ./esCatField.js  --index=std* 

```
Running search
2015-10-11T17:36:08.368Z: std-2015.10.11:Sun Oct 11 13:35:55 EDT 2015
2015-10-11T17:36:08.385Z: std-2015.10.11:Sun Oct 11 13:35:55 EDT 2015
2015-10-11T17:36:08.392Z: std-2015.10.11:Sun Oct 11 13:35:55 EDT 2015
2015-10-11T17:36:08.404Z: std-2015.10.11:Sun Oct 11 13:35:55 EDT 2015
2015-10-11T17:36:08.415Z: std-2015.10.11:Sun Oct 11 13:35:55 EDT 2015
2015-10-11T17:36:08.431Z: std-2015.10.11:Sun Oct 11 13:35:55 EDT 2015
```
