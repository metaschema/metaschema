/* -------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
/* --------------------------------------------------------------------------------------------------------------------- METASCHEMA MULTI DATABASE CLIENT MIDDLEWARE--- */
/* -------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
m$.db={
	providers:{},provider_factory:{},collections:{},
	addprovider:function(name,type,options){var P=new m$.db.Provider(name,options);P=this.provider_factory[type](P,options);var error=P.validate();if(error){throw new Error(error)}else{this.providers[name]=P}},
	flushprovider:function(){},
	clearprovider:function(){},
	
	types:['boolean','char','byte','sbyte','int8','uint8','int32','uint32','int64','uint64','float','date','time','datetime','string','blob','rel11','rel1M','relM1','relMM','json'],
	addcollection:function(name,model,provider,next){this.collections[name]={provider:provider,model:model};this.providers[provider].add_collection(name,next);},	
	delcollection:function(name,provider,next){this.collections[name]={provider:provider};this.providers[provider].del_collection(name,next);},	
	
	addone:function(collname,doc,next,_uid){
		//MODEL VALIDATION
		this.providers[this.collections[collname].provider].addone(collname,doc,next,_uid);},
	setone:function(doc,next){if(!doc.$key){throw new Error('collection and id of object to update must be set in the $key property of the document in the format COLLECTIONNAME-DOCUMENTID');}
		var cn=doc.$key.split('-')[0];var docid=doc.$key.substring(cn.length+1);delete doc.$key;
		//MODEL VALIDATION
		this.providers[this.collections[cn].provider].setone(cn,docid,doc,function(res){res.$key=cn+'-'+docid;next(res)});},
	delone:function(doc,next){if(!doc.$key){throw new Error('collection and id of object to delete must be set in the $key property of the document in the format COLLECTIONNAME-DOCUMENTID');}
		var cn=doc.$key.split('-')[0];var docid=doc.$key.substring(cn.length+1);
		this.providers[this.collections[cn].provider].delone(cn,docid,next);},
	getone:function($key,next){var cn=$key.split('-')[0];var docid=$key.substring(cn.length+1);var out=this.providers[this.collections[cn].provider].getone(cn,docid,function(res){res.$key=$key;next(res)});},
	/*M2M*/
	link:function($k1,field1,$k2,field2,json,next){
		var cn1=$k1.split('-')[0];var did1=$k1.substring(cn1.length+1);this.providers[this.collections[cn1].provider].setrel(cn1,did1,field1,$k2,json);
		var cn2=$k2.split('-')[0];var did2=$k2.substring(cn2.length+1);this.providers[this.collections[cn2].provider].setrel(cn2,did2,field2,$k1,json);
		if(next){next();}},
	unlink:function($k1,$k2,next){
		var cn1=$k1.split('-')[0];var did1=$k1.substring(cn1.length+1);this.providers[this.collections[cn1].provider].delrel(cn1,did1,$k2);
		var cn2=$k2.split('-')[0];var did2=$k2.substring(cn2.length+1);this.providers[this.collections[cn2].provider].delrel(cn2,did2,$k1);
		if(next){next();}},
	linkmany:function(k1,keys,json){},
	unlinkmany:function(k1,keys,json){},	
	find:function(exp,onresult,_onerror){
		if((exp.indexOf('key:')==0)||(exp.indexOf(' key:')>0)){
			var kk=exp.substring(exp.indexOf('key:')+4);kk=kk.split(' ')[0];
			for(var k=0;k<kk.length;k++){this.getone(kk[k],onresult);}
		}else{
			var colls=[];
			if((exp.indexOf('coll:')==0)||(exp.indexOf(' coll:')>0)){
				
			}else{for(var c in this.collections){colls.push(c)}}
			if((exp.indexOf('f:')==0)||(exp.indexOf(' f:')>0)){
				
			}
		/*TODO: actual search in colls*/
		}
	},
};
m$.db.Provider=function(name,options){this.name=name;this.options=options;};m$.db.Provider.prototype={
	validate:function(){
		var must_implement=['addone','setone','updone','delone','getone','addrel','setrel','updrel','delrel','getrel'];
		for(var x=0;x<must_implement;x++){if(!this[must_implement[x]]){return 'db provider '+this.name+' does not implement the '+must_implement[x]+' method.'}}
		return false;
}	};

/* -------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------------------------------------------------- STUPID INMEMORY JSON - DATABASE PROVIDER --- */
m$.db.provider_factory.inmemory=function(P,options){P.type='inmemory';P.cache={};
	if(localStorage[P.name]){P.cache=JSON.parse(localStorage.getItem(P.name));}
	
	P.add_collection=function(name,next){if(!this.cache[name]){this.cache[name]={};localStorage.setItem(this.name, JSON.stringify(this.cache));}if(next){next();}};
	P.addone=function(cn,doc,next,_uid){if(!_uid){_uid=m$.getuid()}if(this.cache[cn][_uid]){throw new Error('document '+cn+ ' . ' + _uid+' already exists')}
		this.cache[cn][_uid]=doc;localStorage.setItem(this.name, JSON.stringify(this.cache));doc.$key=cn+'-'+_uid;if(next){next(doc);}};
	P.setone=function(cn,docid,doc,next){this.cache[cn][docid]=doc;localStorage.setItem(this.name,JSON.stringify(this.cache));if(next){next(doc);}};
	P.updone=function(cn,docid,doc,next){var curr=this.cache[cn][docid];for(k in doc){curr[k]=doc[k];}this.cache[cn][docid]=curr;localStorage.setItem(this.name, JSON.stringify(this.cache));if(next){next(curr);}};
	P.delone=function(cn,docid,next){var flag=false;if(this.cache[cn][docid]){delete this.cache[cn][docid];localStorage.setItem(this.name, JSON.stringify(this.cache));flag=true}if(next){next(flag);}};
	P.getone=function(cn,docid,next){if(next){next(this.cache[cn][docid])}};
	
	P.addrel=function(cn,docid,field,$relkey,json,next){if(this.cache[cn][docid][field][$relkey]){throw new Error('relation '+$relkey+ ' already exists for document '+cn+'-'+docid)}
		if(!_json){_json={exists:true}}this.cache[cn][docid][field][$relkey]=json;localStorage.setItem(this.name, JSON.stringify(this.cache));next(json);};
	P.setrel=function(cn,docid,field,$relkey,json,next){if(!_json){_json={exists:true}}this.cache[cn][docid][field][$relkey]=json;localStorage.setItem(this.name, JSON.stringify(this.cache));next(json);};
	P.updrel=function(cn,docid,field,$relkey,json,next){if(!this.cache[cn][docid][field][$relkey]){throw new Error('relation '+$relkey+ ' does not exists for document '+cn+'-'+docid)}
		if(!_json){_json={exists:true}}var rel=this.cache[cn][docid][field][$relkey];for(var k in json){rel[k]=json[k]}this.cache[cn][docid][field][$relkey]=rel;localStorage.setItem(this.name, JSON.stringify(this.cache));next(rel);};
	P.delrel=function(cn,docid,field,$relkey,next){var flag=false;if(this.cache[cn][docid][field][$relkey]){delete this.cache[cn][docid][field][$relkey];localStorage.setItem(this.name,JSON.stringify(this.cache));flag=true;}next(flag);};
	P.getrel=function(cn,docid,field,$relkey,next){next(this.cache[cn][docid][field][$relkey])};
	return P;};
m$.db.addprovider('localjson_1','inmemory');

/* -------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
m$.db.Model=function(name,fields){this.name=name;this.fields=fields;this.init();};m$.db.Model.prototype={
	init:function(){
		this.fields['created']={type:'datetime'};
		this.fields['modified']={type:'datetime'};
		this.fields['created_by']={type:'rel1M'};
		this.fields['modified_by']={type:'rel1M'};
	this.fields['owned_by']={type:'rel1M'};},
	validatedoc:function(doc){var k='';var errors=[];
		//TODOcheck mandatory are existant
		for(k in this.fields){if(this.fields.mandatory){if(!doc[k]){errors.push('Field '+k+' is mandatory for document');}}}
		for(k in doc){var error=this.atomvalid[this.fields[k].type](doc[k],this.fields[k]);if(error){errors.push(error);}}
		if(errors.length>0){return errors.join('\n');}else{return false;}},
	computedoc:function(doc){var k='';var errors=[];
		//TODOcheck mandatory are existant
		for(k in this.fields){if(this.fields[k].computefn){
			
	}}},
	atomvalid:{
		'boolean':function(v,o){},
		'char':function(v,o){},
		'byte':function(v,o){if((v<0)||(v>254)||(v%1!=0)){return 'Value out of bounds for data type';}if(o.min){if(v<o.min){return 'Value exceeds custom minimum';}}if(o.max){if(v>o.max){return 'Value exceeds custom maximum';}}},
		'sbyte':function(v,o){if((v<-127)||(v>127)||(v%1!=0)){return 'Value out of bounds for data type';}if(o.min){if(v<o.min){return 'Value exceeds custom minimum';}}if(o.max){if(v>o.max){return 'Value exceeds custom maximum';}}},
		'int8':function(v,o){},
		'uint8':function(v,o){},
		'int32':function(v,o){},
		'uint32':function(v,o){},
		'int64':function(v,o){},
		'uint64':function(v,o){},
		'float':function(v,o){},
		'date':function(v,o){},
		'time':function(v,o){},
		'datetime':function(v,o){},
		'string':function(v,o){},
		'blob':function(v,o){},
		'rel11':function(v,o){},
		'rel1M':function(v,o){},
		'relM1':function(v,o){},
		'relMM':function(v,o){},
		'json':function(v,o){}
}	};

/* ADD storage for modules install at install time */
/* ADD DATABASE STORAGE PROVIDERS TO CONFIG - NO : Because they are added by module install */
/* ADD Collections configuration - NO / Only custom - because collections are created by modules*/
/* -------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
