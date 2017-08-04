m$={/*it3*/
	load:function(url,_elm,_onfinish,_onstep,_onerror,_mem){var req=this._req();var $this=this;req.onreadystatechange=function(ev){
		$this._doload(ev,_elm,_onfinish,_onstep,_onerror,_mem);};if(!_elm){req.open("GET",url,true);req.send('');}
		else{var hasfile=false;if(!hasfile){req.open("POST",url,true);req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    		console.log('todo:serialize');req.send($this.serialize(_elm))}
			else{console.log('todo:file upload');}}return false;},
	_req:function(){var rq=false;if(window.XMLHttpRequest&&!(window.ActiveXObject)){try{rq=new XMLHttpRequest();}catch(exk){rq=false;}}else if(window.ActiveXObject){try{rq=new ActiveXObject("Msxml2.XMLHTTP");}catch(ex){try{rq=new ActiveXObject("Microsoft.XMLHTTP");}catch(exx){rq=false;}}}if(!rq){console.log('This browser is neither w3c or mozilla compatible*[2008], uno.xml javascript framework will not work.');}return rq;},
 	_doload:function(ev,_elm,_onfinish,_onstep,_onerror,_mem){var req=(ev.currentTarget||ev.target||ev.srcElement);if(req.readyState>1&&req.readyState<4){if(req.status==200){if(_onstep)_onstep(req);}
		}else if(req.readyState==4){if(req.status==200){_onfinish(req,_mem);}else{console.log('Request failed');console.log(req);if(_onerror){_onerror(req)}}}},
		
	/**/
	config:{},modules:{},modscript:'',moddata:'',resources:0,resources_toload:0,resources_loaded:0,
	modinstall:function(module,next){if(module.name){this._modinstall(module,next);}else{var _this=this;
		this.load(module+'/m$-manifest.js',false,function(res){var mod={};try{mod=eval(res.responseText);}catch(ex){throw new error('Cannot eval module manifest from '+module+'/m$-manifest.js')}_this._modinstall(mod);});}},
	_modinstall:function(module,next){var x;var direct=true;var toinstall=[module];	
		if(module.depends){for(x=0;x<module.depends.length;x++){if(!modules[module.depends[x]]){direct=false;toinstall.push(module.depends[x]);}}}
		if(direct){this._singlemodinstall(module,next)}else{
			/*TODO: QUEUED INSTALL*/
			throw new error('First you have to install '+toinstall.join(', ')+'.');			
	}	},
	_singlemodinstall:function(module,next){
		if(!module.is_metaschema_module){throw new error('The object is not a metaschema module');}
		var x;var _this;this.modules[module.name]=module;this.modules[module.name]._toinstall=0;this.modules[module.name]._installed=0;
		for(x in module.resources){this.modules[module.name]._toinstall++;this.resources_toload++;
			this.load(module.resources[x],false,function(req){_this._atominstall_end(module.name,'xmldata',req,module.resources[x],next);});
	}	},
	_atominstall_end:function(modulename,restype,res,resurl,next){
		if(this._atoms[restype]){this._atoms[restype](res,resurl)}
		this.modules[modulename]._installed++;this.resources_loaded++;
		if(this.modules[modulename]._installed==this.modules[modulename]._toinstall){this.modules[modulename].fullyinstalled=true;next()}
	},
	atoms:{
		'script':function(req,resurl){var o=document.createElement('script');o.setAttribute('type','text/javascript');o.innerText=req.responseText;document.getElementsByTagName('head')[0].appendChild(o)}
	},
};