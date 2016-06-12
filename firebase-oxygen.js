//OXYGEN for firebase by Hideki Yamamoto
/*TODO URGENT!!!!!!
	-Add index for _subcollections 	
	-Add index only for hashed words 	
	-Add index only for title words* - use for autocomplete	
	-Actually perform  Z=Y-X  during the indexing to remove old entries. 
	-CLEAN INDEXES ON DOCUMENT REMOVAL
*/
f$={oxyprefix:'oxy_',
inoe:function(v){if(!v)return true;if(typeof v!='string')return true;if(v.length==0)return true;return false;},
login:function(provider,method){if(!method){method='redirect'}
	if (!firebase.auth().currentUser){var provider;
		if(provider=='twitter'){provider=new firebase.auth.TwitterAuthProvider();}
		else if(provider=='google'){provider=new firebase.auth.GoogleAuthProvider();provider.addScope('https://www.googleapis.com/auth/plus.login');}
		else if(provider=='github'){provider=new firebase.auth.GithubAuthProvider();provider.addScope('repo');}
		else if(provider=='facebook'){provider=new firebase.auth.FacebookAuthProvider();provider.addScope('user_likes');}
		if(method=='redirect'){firebase.auth().signInWithRedirect(provider);}
	}else{console.log('Already logged in');}	
},
logout:function(){firebase.auth().signOut();},
initAuth:function(nextToken){if(!nextToken){nextToken=function(r){var i=0;}}firebase.auth().getRedirectResult().then(function(result){
 if(result.credential){nextToken(result);}
	else{nextToken(false);}
		var user = result.user;
  }).catch(function(error) {
        var errorCode = error.code;var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        if (errorCode === 'auth/account-exists-with-different-credential') {
          alert('You have already signed up with a different auth provider for that email.');
          // If you are using multiple auth providers on your app you should handle linking
          // the user's accounts here.
        }else{console.error(error);}
      });},

 /* ----------------------------------------------------------------------------------------------------------- */
	/* ------------------------------------------------------------------- FIREBASE DATABASE NAMESPACE - start --- */
db:{docnamefield:"doctitle",db:function(ref){return firebase.database().ref(ref)},
	start:function(key,event,next){this.db(key.replace('-','/-')).on(event,function(d){var v=d.val();if(v){v.$key=key.split('-')[0]+d.key;next(v);}});},
	end:function(key,event){this.db(key.replace('-','/-')).off(event);},
	/*SUBCOLLECTION start*/
	_add:function(stype,dkey,json){return this.db(stype+'_'+dkey.replace('-','/-')).push(json).key;},
	_set:function(stype,dkey,key,json){delete json.subkey;this.db(stype+'_'+dkey.replace('-','/-')+'/'+key).set(json);},
	_del:function(stype,dkey,key){this.db(stype+'_'+dkey.replace('-','/-')+'/'+key).remove();},
	_get:function(stype,dkey,next){this.db(stype+'_'+dkey.replace('-','/-')).on('child_added',function(data){var v=data.val();v.$subkey=data.key;next(v);});},
	_getone:function(stype,dkey,key,next){this.db(stype+'_'+dkey.replace('-','/-')+'/'+key).once('value',function(data){var v=data.val();v.$subkey=data.key;next(v);});},
    _getall:function(stype,dkey,key,next){},
	/*SUBCOLLECTION end*/
	/*COLLECTIONS start*/
	getone:function(key,next){this.db(key.replace('-','/-')).once('value',function(d){var v=d.val();if(v){v.$key=key.split('-')[0]+d.key;next(v);}});},
    getall:function(col,next){console.log(col+' '+next);this.db('/'+col).on('child_added',function(d){console.log(d.val+' '+d);var v=d.val();next(v)})},
	add:function(otype,doc){if(f$.inoe(doc[this.docnamefield])){doc[this.docnamefield]='new '+otype;}var x=this.db(otype).push(doc).key;this._add(f$.oxyprefix+'log',otype+x,{text:"Object Created"});
	var nkey=otype+x;this._doindex(doc,nkey,this.docnamefield);return nkey;},
	del:function(key){var _this=this;var doend=function(){_this.db('/'+f$.oxyprefix+'log_'+key.replace('-','/-')).remove();_this.db('/'+f$.oxyprefix+'ver_'+key.replace('-','/-')).remove();_this.db('/'+key.replace('-','/-')).remove();};
		this.getone(key,function(d){for(var k in d.rels){_this.db(k.replace('-','/-')+'/rels/'+key).remove();
			_this._add(f$.oxyprefix+'log',k,{text:'Unlinked from '+d[_this.docnamefield]+'['+key+'] because it\'s getting deleted.'});
		}doend();/*TODO CLEAN WINDEX*/});},
	set:function(doc,log){var k=doc.$key;this._doindex(doc,k,this.docnamefield);var _this=this;delete doc.$key;if(!log){log='Object Modified'}
			this.getone(k,function(d){delete d.$key;var verk=_this._add(f$.oxyprefix+"ver",k,d);
			_this.db(k.replace('-','/-')).set(doc);_this._add(f$.oxyprefix+'log',k,{text:log,prev:verk});});},
	/*COLLECTIONS end*//*RELATIONS start*/
	link:function(k1,k2,json){if(!json){json={role:'default'}}if(f$.inoe(k1)||(f$.inoe(k2))){console.log('only valid keys')}else{
		var _this=this;this.getone(k1,function(d){_this.getone(k2,function(dd){
			_this.db(k1.replace('-','/-')+'/rels/'+k2).set(json);_this._add(f$.oxyprefix+'log',k1,{text:'Linked with '+dd[_this.docnamefield]+'['+k2+']'});
			_this.db(k2.replace('-','/-')+'/rels/'+k1).set(json);_this._add(f$.oxyprefix+'log',k2,{text:'Linked with '+d[_this.docnamefield]+'['+k1+']'});
	});});}},
	unlink:function(k1,k2){if(f$.inoe(k1)||(f$.inoe(k2))){console.log('only valid keys')}else{
var _this=this;this.getone(k1,function(d){_this.getone(k2,function(dd){
			_this.db(k1.replace('-','/-')+'/rels/'+k2).remove();_this._add(f$.oxyprefix+'log',k1,{text:'Unlinked from '+dd[_this.docnamefield]+'['+k2+']'});
			_this.db(k2.replace('-','/-')+'/rels/'+k1).remove();_this._add(f$.oxyprefix+'log',k2,{text:'Unlinked from '+d[_this.docnamefield]+'['+k1+']'});
	});});}},	
	linkmany:function(k1,kk,json){var _this=this;this.getone(k1,function(dd){for(var k=0;k<kk.length;k++){_this.getone(kk[k],function(ddd){
			_this.db(k1.replace('-','/-')+'/rels/'+kk[k]).set(json);_this._add(f$.oxyprefix+'log',k1,{text:'Linked with '+ddd[_this.docnamefield]+'['+kk[k]+']'});
			_this.db(kk[k].replace('-','/-')+'/rels/'+k1).set(json);_this._add(f$.oxyprefix+'log',kk[k],{text:'Linked with '+dd[_this.docnamefield]+'['+k1+']'});
	});}});},
	unlinkmany:function(k1,kk){var _this=this;this.getone(k1,function(dd){for(var k=0;k<kk.length;k++){this.getone(kk[k],function(ddd){
			_this.db(k1.replace('-','/-')+'/rels/'+kk[k]).remove();_this._add(f$.oxyprefix+'log',k1,{text:'Unlinked with '+ddd[_this.docnamefield]+'['+kk[k]+']'});
			_this.db(kk[k].replace('-','/-')+'/rels/'+k1).remove();_this._add(f$.oxyprefix+'log',kk[k],{text:'Unlinked with '+dd[_this.docnamefield]+'['+k1+']'});
	});}});},/*RELATIONS end*//*WORD INDEX START*/
	find:function(s,next,_collection){var _this=this;var popped=[];
	 s=s.replace(/ |{|}|\||<|>|\\|!|"|£|$|%|&|\/|\(|\)|=|\?|'|"|^|\*|\+|\[|\]|§|°|@|\.|,|;|:/g,' ');
  s=s.replace(/# /g,' ');s=s.replace(/   /g,' ');s=s.replace(/  /g,' ');s=s.toLowerCase();
		var uninext=function(d){if(!popped[d.$key]){popped[d.$key]=true;next(d);}};var step;
		if(_collection){step=function(d){if(d.key.indexOf(_collection)==0){_this.getone(d.key,uninext);}}}
		else{step=function(d){_this.getone(d.key,uninext);}}
	 var xx=s.split(' ');var xlen=xx.length;for(var x=0;x<xlen;x++){console.log('->');xx[x]=xx[x].trim();if(xx[x].length>0){
		this.db('/'+f$.oxyprefix+'Wndex/'+xx[x]+'/keys').on('child_added',step);}}},
	
	_doindex:function(o,k,f){var RT=this._relevantText(o);var _this=this;var j;
	 var IDX=this._indexAllandHashedWords(RT);
		/* TODO URGENT : REMOVE OLD INDEX INFO ON REINDEX
		this.db('/'+f$.oxyprefix+'Wndex_inv/'+k).once('value',function(data){var yy=data.val();if(yy){var zz=[];
		//TODO:PERFORM Z=Y-X
		var zlen=zz.length;for(var z=0;z<zlen;z++){_this.db('/'+f$.oxyprefix+'Wndex/'+IDX.all[x].v+'/keys/'+zz[z]).remove();}
		}_this.db('/'+f$.oxyprefix+'Wndex_inv/'+k).set(IDX.all);});
		
		this.db('/'+f$.oxyprefix+'Hndex_inv/'+k).once('value',function(data){var yy=data.val();if(yy){var zz=[];
		//TODO:PERFORM Z=Y-X
		var zlen=zz.length;for(var z=0;z<zlen;z++){_this.db('/'+f$.oxyprefix+'Wndex/'+IDX.hash[x].v+'/keys/'+zz[z]).remove();}
		}_this.db('/'+f$.oxyprefix+'Hndex_inv/'+k).set(IDX.hash);});
		*/
		for(j in IDX.all){if(IDX.all[j].v!=''){this.db('/'+f$.oxyprefix+'Wndex/'+IDX.all[j].v+'/keys/'+k).set({ct:IDX.all[j].c});}}
		for(j in IDX.hash){if(IDX.hash[j].v!=''){this.db('/'+f$.oxyprefix+'Hndex/'+IDX.hash[j].v+'/keys/'+k).set({ct:IDX.hash[j].c});}}
		if(o[f]){this.db('/'+f$.oxyprefix+'Nndex/'+k).set({n:o[f]});}},
	_relevantText:function(o){var s=JSON.stringify(o);
		s=s.replace(/,"([^"]*)":/g,'');s=s.replace(/{"([^"]*)":/g,'');
		s=s.replace(/","/g,' ');s=s.replace(/""/g,' ');s=s.replace(/"/g,' ');
		s=s.replace(/<.*\/>/g,' ');
		s=s.replace(/<!--.*-->/g,' ');
		s=s.replace(/<.*>(.+)<\/.*>/g,' $1 ');
		s=s.replace(/<link .*>/g,' ');
		s=s.replace(/ |{|}|\||<|>|\\|!|"|£|$|%|&|\/|\(|\)|=|\?|'|"|^|\*|\+|\[|\]|§|°|@|\.|,|;|:/g,' ');
		s=s.replace(/  /g,' ');s=s.replace(/   /g,' ');s=s.replace(/  /g,' ');
		return s.toLowerCase()},	
	_indexAllandHashedWords:function(s){var out={all:{},hash:{}};var c=0;var cw='';var ct=1;var gh=''
		var ss=s.split(' ').sort();var len=ss.length;
		while((c<len)&&(ss[c].trim()=='')){c++}
		while(c<len){gh=ss[c].trim();if(cw!=gh){if(cw!=''){if(cw.length>2){out.all[cw.replace('#','')]={v:cw.replace('#',''),c:ct}};if(cw[0]=='#'){out.hash[cw.replace('#','')]={v:cw.replace('#',''),c:ct};}}cw=gh;ct=1;}else{ct++}c++}
	 out.all[cw]={v:cw,c:ct};return out;
	}
		/*------------------------------------------------------------------------------------------------WORD INDEX END*/	
	}
  };
		
		
		


		
		
		