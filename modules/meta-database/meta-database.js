m$.db={
	providers:{},provider_factory:{},	
	addprovider:function(name,type,options){var P=new m$.db.Provider(name,options);this.provider_factory[type](P);var error=P.validate();if(error){throw new Error(error)}else{this.providers[name]=P}},
	collections:{},
	types:['boolean','char','byte','sbyte','int8','uint8','int32','uint32','int64','uint64','float','date','time','datetime','string','blob','rel11','rel1M','relM1','relMM','json'],
	addcollection:function(name,provider){
		this.collections[name]={provider:provider}
	},	
	addone:function(collname,doc,next,_uid){this.providers[this.collections[collname].provider].addone(collname,doc,next,_uid);},
	setone:function(doc,next){if(!doc.$key){throw new Error('collection and id of object to update must be set in the $key property of the document in the format COLLECTIONNAME-DOCUMENTID');}
		var cn=doc.$key.split('-')[0];var docid=doc.$key.substring(cn.length+2);delete doc.$key;this.providers[this.collections[cn].provider].setone(cn,docid,doc,function(res){res.$key=cn+'-'+docid;next(res)});},
	delone:function(doc){if(!doc.$key){throw new Error('collection and id of object to delete must be set in the $key property of the document in the format COLLECTIONNAME-DOCUMENTID');}
		var cn=doc.$key.split('-')[0];var docid=doc.$key.substring(cn.length+2);this.providers[this.collections[cn].provider].delone(cn,docid,next);},
	getone:function($key,next){var cn=$key.split('-')[0];var docid=$key.substring(cn.length+2);var out=this.providers[this.collections[cn].provider].getone(cn,docid,function(res){res.$key=$key;next(res)});},
		
	/*M2M*/
	link:function(k1,field1,k2,field2,json){},
	unlink:function(k1,k2,json){},
	linkmany:function(k1,keys,json){},
	unlinkmany:function(k1,keys,json){},	
	find:function(exp,onresult,_onerror){
		//key:
		//--
		//rel:
		//coll:
		//after:
	},
};
m$.db.Provider=function(name,options){this.name=name;this.options=options;};m$.db.Provider.prototype={
	validate:function(){
		var must_implement=['addone','setone','updone','delone','getone','addrel','setrel','updrel','delrel','getrel'];
		for(var x=0;x<must_implement;x++){if(!this[must_implement[x]]){return 'db provider '+this.name+' does not implement the '+must_implement[x]+' method.'}}
		return false;
	}
};

m$.db.Model=function(name,fields){this.name=name;this.fields=fields;this.init();};m$.db.Model.prototype={
	init:function(){
		this.fields[this.fields.length]={name:'created',type:'datetime'};
		this.fields[this.fields.length]={name:'modified',type:'datetime'};
		this.fields[this.fields.length]={name:'created_by',type:'rel1M'};
		this.fields[this.fields.length]={name:'modified_by',type:'rel1M'};
		this.fields[this.fields.length]={name:'owned_by',type:'rel1M'};
},};

/* -------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
/* STUPID INMEMORY JSON - DATABASE PROVIDER */
m$.db.provider_factory.inmemory=function(P,options){
	if(localStorage[P.name]){P.cache=localStorage[name]}else{P.cache={}}	
	P.add_collection=function(name,next){this.cache[name]={};localStorage.setItem(this.name, this.cache);next();};	
	
	P.addone=function(cn,doc,next,_uid){if(!_uid){_uid=m$.getuid()}if(this.cache[cn][_uid]){throw new Error('document '+cn+ ' . ' + _uid+' already exists')}
		this.cache[cn][_uid]=doc;localStorage.setItem(this.name, this.cache);doc.$key=cn+'-'+_uid;next(doc);};
	P.setone=function(cn,docid,doc,next){this.cache[coll][docid]=doc;localStorage.setItem(this.name, this.cache);next(doc);};
	P.updone=function(cn,docid,doc,next){var curr=this.cache[coll][docid];for(k in doc){curr[k]=doc[k];}this.cache[coll][docid]=curr;localStorage.setItem(this.name, this.cache);next();};
	P.delone=function(cn,docid,next){var flag=false;if(this.cache[coll][docid]){delete this.cache[coll][docid];localStorage.setItem(this.name, this.cache);flag=true}next(flag);};
	P.getone=function(cn,docid,next){next(this.cache[cn][docid])};
	
	P.addrel=function(cn,docid,field,$relkey,json,next){if(this.cache[cn][docid][field][$relkey]){throw new Error('relation '+$relkey+ ' already exists for document '+cn+'-'+docid)}
		if(!_json){_json={exists:true}}this.cache[cn][docid][field][$relkey]=json;localStorage.setItem(this.name, this.cache);next(json);},
	P.setrel=function(cn,docid,field,$relkey,json,next){if(!_json){_json={exists:true}}this.cache[cn][docid][field][$relkey]=json;localStorage.setItem(this.name, this.cache);next(json);},
	P.updrel=function(cn,docid,field,$relkey,json,next){if(!this.cache[cn][docid][field][$relkey]){throw new Error('relation '+$relkey+ ' does not exists for document '+cn+'-'+docid)}
		if(!_json){_json={exists:true}}var rel=this.cache[cn][docid][field][$relkey];for(var k in json){rel[k]=json[k]}this.cache[cn][docid][field][$relkey]=rel;localStorage.setItem(this.name, this.cache);next(rel);},
	P.delrel=function(cn,docid,field,$relkey,next){var flag=false;if(this.cache[cn][docid][field][$relkey]){delete this.cache[cn][docid][field][$relkey];localStorage.setItem(this.name, this.cache);flag=true;}next(flag);},	
	P.getrel=function(cn,docid,field,$relkey,next){next(this.cache[cn][docid][field][$relkey])}
	return P;
};


m$.db.addprovider('localjson_1','inmemory');


/* ADD DATABASE STORAGE PROVIDERS TO CONFIG */
