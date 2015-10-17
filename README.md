# esCatField
```
node ./esCatField.js  --help
Processing Commandline arguments
node:
	[--url=localhost:9200]
	[--search=<filename> default: default.search
	[--fetchsize='20'  default: 100 
	[--context='{ 'custom':'json'}'  default:{"index":"_all","fetchsize":100,field:"message"}
		Context is what varables pass to the search template for json markup
		context=<key>=<val> is a way to set any varable inside the context array. 
		Make sure this is used after --contextfile or --context=<customejson>
	[--index=<index>|--context=index=<index>]     default: _all
	[--context=field=<fieldname>]     default: _all
```

#Example Command
Extract all indexes which have a host field. Sort it and uniq with count. I only have 1 host so this is what you would see

```
$ node ./esCatField.js --context=field=host | sort | uniq -c 
   2226 coperdragon
```

