/* --------------------------------------------------------------------------------------------------------------------------- */
/* --- templates you want to use in many templates have to be declared here -------------------------------- PRE TEMPLATES --- */_T={
	dialog_start:'<dialog class="dialog objdialog" id="DLG%KEY"><div class="dialoghandler" draggable="true" ondragstart="app.dialog_drag_start(event)" ondrop="app.dialog_drop(event)" ondragover="app.dialog_drag_over(event);">%KEY<button onclick="app.dialog_close(this.parentElement.parentElement.id)" style="float:right"><i class="fa fa-times"></i></button><button onclick="app.dialog(\'%KEY\',%FORCEJSON)" style="float:right"><i class="fa fa-code"></i></button>%BUTTONS</div>',
	b_save:'<button onclick="app.%SAVEFN(\'%KEY\');app.dialog_close(this.parentElement.parentElement.id)" style="float:right"><i class="fa fa-floppy-o"></i></button>',
	b_trash:'<button onclick="if(confirm(\'Eliminare davvero %JSTITLE?\')){f$.db.del(\'%KEY\');app.dialog_close(this.parentElement.parentElement.id)}" style="float:right"><i class="fa fa-trash-o"></i></button>',
};/* ------------------------------------------------------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------- BASIC TEMPLATES --- */T={
	taglink:'<a href="#" title="%KEY" onclick="return app.dialog(\'%KEY\')" draggable="true" ondragstart="app.drag(\'%KEY\',\'%JSTITLE\')" ondragover="event.preventDefault()" ondrop="fix(event);app.drop(\'%KEY\',\'%JSTITLE\')">%TITLE</a>',
/* --------------------------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------- TREE TEMPLATES --- */TREE:{
	relink:'<button class="color fr" href="#" onclick="app.search(\'rel:%KEY\')" style="display:absolute;" title="relativi..."><i class="fa fa-play"></i></button>',
	treenode:'<div class="treenode" id="TX%KEY" ondragstart="event.stopPropagation();app.drag(\'X%KEY\',\'%JSTITLE\')" ondrop="fix(event);app.drop(\'X%KEY\',\'%JSTITLE\')" ondragover="fix(event);"><button '+
		'onclick="app.toggleleaf(\'X%KEY\',this.firstChild)"><i class="fa fa-plus-circle"></i></button>'+
		'<a href="#" onclick="return app.search(\'parent:%KEY\');">%TITLE</a><button class="color fr" href="#" onclick="app.dialog(\'%KEY\')" style="background-color:%C2;border-color:%C1;">&nbsp;</button>%REL</div>',
	treeleaf:'<div id="TCX%KEY" class="treeleaf">%CTC</div>'
},/* ------------------------------------------------------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------------------------- COMMON DIALOG TEMPLATES --- */DLG:{
	newdialog:'<dialog class="dialog newobject" id="newdialog" draggable="true" ondragstart="app.dialog_drag_start(event)" ondrop="app.dialog_drop(event)" ondragover="app.dialog_drag_over(event);">'+
		'<span style="display:none"><input type="text" id="othercollname" placeholder="collection"/><br/></span><select'+
		'id="collname" onchange="if(this.options[this.selectedIndex].value==\'other\'){this.previousSibling.style.display=\'\'}else{this.previousSibling.style.display=\'none\'}"><option value="other">other</option>'+
		'</select><button class="fr" onclick="this.parentElement.close()"><i class="fa fa-times"></i></button><button class="fr" onclick="app.newobject();this.parentElement.close();"><i class="fa fa-check"></i></button></dialog>',
	seldialog:'<dialog class="dialog selobject" id="seldialog" draggable="true" ondragstart="app.dialog_drag_start(event)" ondrop="app.dialog_drop(event)" ondragover="app.dialog_drag_over(event);">'+
		'<button onclick="this.parentElement.close()" tittle="ok / close"><i class="fa fa-check-square"></i></button></dialog>',
	selcheck:'<input type="checkbox" class="selcheck" checked="checked" value="%KEY" style="zoom:2" /> %KEY',
	reldialog:'<dialog class="dialog" id="%UID" draggable="true">%KEY1<br/>%KEY2<br/><br/><button onclick="f$.db.link(\'%KEY1\',\'%KEY2\');app.dialog_close(this.parentElement.id)"><i class="fa fa-link"></i></button><button'+
		 'onclick="f$.db.unlink(\'%KEY1\',\'%KEY2\');app.dialog_close(this.parentElement.id)"><i class="fa fa-unlink"></i></button><button onclick="app.dialog_close(this.parentElement.id)">cancel</button></dialog>',
	newtagdialog:'<dialog class="dialog newtag" id="newtagdialog" draggable="true" ondragstart="app.dialog_drag_start(event)" ondrop="app.dialog_drop(event)" ondragover="app.dialog_drag_over(event);">'+
		'<input type="text" id="newtagname" placeholder="name"/> <input type="color" id="newtagc1" /><input type="color" id="newtagc2" value="#6fa56f" />'+
		'<button onclick="app.newtag();this.parentElement.close()"><i class="fa fa-check"></i></button><button onclick="this.parentElement.close()"><i class="fa fa-times"></i></button></dialog>',
	json:_T.dialog_start.replace('%BUTTONS',_T.b_save.replace('%SAVEFN','saveobj')+_T.b_trash)+'<textarea id="DLG-JSON-%KEY" >%JSON</textarea></dialog>',
/* --------------------------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------- COLLECTION SPECIFIC DIALOG TEMPLATES --- */	
	file:_T.dialog_start.replace('%BUTTONS',_T.b_save.replace('%SAVEFN','saveobj')+_T.b_trash).replace('db.del(','fs.del(')+'<textarea id="DLG-JSON-%KEY" >%JSON</textarea></dialog>',
	tag:_T.dialog_start.replace('%BUTTONS',_T.b_save.replace('%SAVEFN','savetag')+_T.b_trash)+'<input type="text" placeholder="name" value="%TITLE" style="width:60%;"/><input type="color" value="%C1" /><input type="color" value="%C2" />' +
		'<input type="number" value="%CElev" value="1" min="0" max="4" step="1" title="1=Livello di ingresso, 2=listato(brands):, 3=sottocategorie, 4=prodotti"/><br/>' +
		'<input type="text" placeholder="url immagine" value="%Cimgurl"  style="width:70%;" /><button onclick="app.openimgpicker(this.previousSibling,\'%KEY\')"><li class="fa fa-paperclip"></li></button><button onclick="app.openimgedit(this.previousSibling.previousSibling,\'%KEY\')"><li class="fa fa-edit"></li></button>' +
		'<input type="text" value="%CEurl"  title="url della tag" placeholder="url..." style="width:90%"/><div class="multieditables" style="margin-left:10px;margin-right:15px;display:block;">' +
		'<label>Descrizione</label><br/><div id="%KEY-desc1" class="editable" style="background-color:#fff;display:inline-block;min-width:450px;width:450px;height:64px;overflow:auto;resize:both">%Cdescription_it</div><br/>'+
		'<label>Description</label><br/><div id="%KEY-desc2" class="editable" style="background-color:#fff;display:inline-block;min-width:450px;width:450px;height:64px;overflow:auto;resize:both">%Cdescription_en</div></div></dialog>',
	products:_T.dialog_start.replace('%BUTTONS',_T.b_save.replace('%SAVEFN','saveprod')+_T.b_trash)+'<input type="text" placeholder="name" value="%TITLE" style="width:60%;"/><input type="text" placeholder="url immagine" value="%Cimgurl"  style="width:70%;" /><button onclick="app.openimgpicker(this.previousSibling,\'%KEY\')"><li class="fa fa-paperclip"></li></button><button onclick="app.openimgedit(this.previousSibling.previousSibling,\'%KEY\')"><li class="fa fa-edit"></li></button>'+
		'<input type="text" value="%CEurl"  title="url del prodotto..." placeholder="url..." style="width:90%"/><div class="multieditables" style="margin-left:10px;margin-right:15px;display:block;">' +
		'<label>Descrizione</label><br/><div id="%KEY-desc1" class="editable" style="background-color:#fff;display:inline-block;min-width:450px;width:450px;height:64px;overflow:auto;resize:both">%Cdescription_it</div><br/>' +
		'<label>Description</label><br/><div id="%KEY-desc2" class="editable" style="background-color:#fff;display:inline-block;min-width:450px;width:450px;height:64px;overflow:auto;resize:both">%Cdescription_en</div></div></dialog>',
},/* ------------------------------------------------------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------- TABLE FIELD TEMPLATES --- */TFIELD:{
	address:function(o){if(!o){return ''}return JSON.stringify(o).replace(/,/g,' ');},
	contacts:function(o){if(!o){return ''}var out='';var c='';
		for(c in o){console.log(c);if(c.toLowerCase().indexOf('ail')>-1){	out+='<a class="mail" href="mailto:'+o[c]+'" title="'+c.replace(/"/g,'&quot;')+'">'+o[c]+'</a>'+c+': '+o[c]+', ';}}
		for(c in o){if(c.toLowerCase().indexOf('tel')>-1){	out+=c+': '+o[c]+', ';}}
		for(c in o){if(c.toLowerCase().indexOf('fax')>-1){	out+=c+': '+o[c]+', ';}}
		for(c in o){if((c.toLowerCase().indexOf('ito')>-1)||(c.toLowerCase().indexOf('web')>-1)){	out+=c+': '+o[c]+', ';}}
		for(c in o){
		if(c.toLowerCase().indexOf('ail')<0){if(c.toLowerCase().indexOf('tel')<0){if(c.toLowerCase().indexOf('fax')<0){if(!(c.toLowerCase().indexOf('ito')>-1)||(c.toLowerCase().indexOf('web')>-1)){
			out+=c+': '+o[c]+', ';}}}}}
		return out},
	},
};
/* --------------------------------------------------------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------------------------------- COMMON CODE UTILS --- */
window.gid=function(id){return document.getElementById(id);};
window.$$=function(e){if(typeof e=='string'){e=document.getElementById(e);}return e;};
window.currentLANG='it';
window.uid=function(_pfx){_uid++;if(!_pfx){_pfx='uid'}return _pfx+'-'+uid};window._uid=0;
window.apphost=document.location.protocol+'//'+document.location.hostname;
window.toggleFullScreen=function(){if((document.fullScreenElement&&document.fullScreenElement!==null)||
(!document.mozFullScreen&&!document.webkitIsFullScreen)){if(document.documentElement.requestFullScreen){
document.documentElement.requestFullScreen();}else if(document.documentElement.mozRequestFullScreen){
document.documentElement.mozRequestFullScreen();}else if(document.documentElement.webkitRequestFullScreen){
document.documentElement.webkitRequestFullScreen(Element.ALLOWKEYBOARDINPUT);}}
else{if(document.cancelFullScreen){document.cancelFullScreen();}else if(document.mozCancelFullScreen){document.mozCancelFullScreen();}
else if(document.webkitCancelFullScreen){document.webkitCancelFullScreen();}}};
window.fix=function(ev){ev.stopPropagation();ev.preventDefault();};
window.clearchilds=function(elm){elm=$$(elm);if(elm&&elm.hasChildNodes&&elm.removeChild){while(elm.hasChildNodes()){elm.removeChild(elm.firstChild);}}};
/* --------------------------- ----------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------------- APP CODE --- */
window.app={loggedin:false,
	init:function(){var _this=this;f$.initAuth();firebase.auth().onAuthStateChanged(function(user){gid('prelogindiv').style.display='none';
		if(user){_this.loggedinit(user);gid('metaschema-app').style.display='';gid('logindiv').style.display='none';}
		else{gid('metaschema-app').style.display='none';gid('logindiv').style.display='';console.log('log off');}});
		gid('hiddentarget').innerHTML+=T.newdialog+T.DLG.seldialog+T.DLG.newtagdialog;},
	login:function(provider){f$.login(provider);},logout:function(provider){f$.logout();},
	loggedinit:function(user){
	 var uname=user.email;if(user.displayName){uname=user.displayName;}
		document.getElementById('username').innerHTML=' '+uname;
					//if user is not agreed make him agree to terms
					//ELSE
		firebase.database().ref('/tag/root').set({"doctitle":"root",c1:'#000000',c2:'#6fa56f'});
	firebase.database().ref('/OXY/e').set('e');
		this.refreshtree();
					//if not hidewelcomedialog show welcome dialog / assistent
	},
/* --------------------------------------------------------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------- TOP BAR */
	gototab:function(tab,button){var tabs=document.getElementsByClassName('tabs-b');for(var t=0;t<tabs.length;t++){tabs[t].classList.remove('pushed');}if(button){button.classList.add('pushed');}gid('mainwrap').classList.add(tab);
	if(tab!='homeview'){gid('mainwrap').classList.remove('homeview');}if(tab!='resultsview'){gid('mainwrap').classList.remove('resultsview');}if(tab!='detailsview'){gid('mainwrap').classList.remove('detailsview');}},
/* --------------------------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------------- TAG TREE --- */
toggletree:function(button){document.body.classList.toggle('noleft');button.classList.toggle('pushed');
		button.childNodes[0].classList.toggle('fa-dedent');button.childNodes[0].classList.toggle('fa-indent');this._ontablescroll()},
	refreshtree:function(){gid('tag-tree').innerHTML='';firebase.database().ref('/tag').off('child_added');
	 firebase.database().ref('/tag').off('child_changed');firebase.database().ref('/tag').off('child_removed');
		var r=firebase.database().ref('/tag').orderByChild("parent").startAt('tag-root').endAt('tag-root');
		r.on('child_added',app._refreshtree);r.on('child_changed',app._refreshtree);r.on('child_removed',app._tagremoved);},
	_refreshtree:function(snap){var v=snap.val();v.$key='tag-'+snap.key;var prev=gid('TX'+v.$key);if(prev){prev.parentElement.removeChild(prev);}
		var HTML=T.TREE.treenode;if(v.rels){HTML=HTML.replace('%REL',T.TREE.relink)}else{HTML=HTML.replace('%REL','')}
		HTML=HTML.replace(/%KEY/g,v.$key).replace(/%TITLE/g,v.doctitle).replace(/%JSTITLE/g,v.doctitle.replace('\'','\\\'')).replace(/%C2/g,v.c2).replace(/%C1/g,v.c1);gid('tag-tree').innerHTML+=HTML},
	toggleleaf:function($key,button){var k=$key.replace('Xtag-','tag-');var flag=true;if(button){button.classList.toggle('fa-plus-circle');button.classList.toggle('fa-minus-circle');}
		var leaf=gid('TC'+$key);if(!leaf){gid('T'+$key).innerHTML+=T.TREE.treeleaf.replace(/%KEY/g,$key.substr(1)).replace(/%CTC/g,'')}
		else{if(leaf.style.display!='none'){leaf.style.display='none';flag=false;}else{leaf.style.display='';flag=false}}
		var tmpfn=function(snap){app._toggleleaf(snap,$key)};var tmpfn1=function(snap){app._tagremoved(snap,$key)};
		if(flag){var r=firebase.database().ref('/tag').orderByChild("parent").startAt(k).endAt(k);
		r.on('child_added',tmpfn);r.on('child_changed',tmpfn);r.on('child_removed',app._tagremoved);}},
	_toggleleaf:function(snap,$key){var v=snap.val();v.$key='tag-'+snap.key;var prev=gid('TX'+v.$key);if(prev){prev.parentElement.removeChild(prev);}
		var HTML=T.TREE.treenode;if(v.rels){HTML=HTML.replace('%REL',T.TREE.relink)}else{HTML=HTML.replace('%REL','')}
		HTML=HTML.replace(/%KEY/g,v.$key).replace(/%TITLE/g,v.doctitle).replace(/%JSTITLE/g,v.doctitle.replace('\'','\\\'')).replace(/%C2/g,v.c2).replace(/%C1/g,v.c1);gid('TC'+$key).innerHTML+=HTML},
	_tagremoved:function(snap){var v=snap.val();console.log(v);v.$key='tag-'+snap.key;var prev=gid('TX'+v.$key);if(prev){prev.parentElement.removeChild(prev);}},
	tag_to_root:function(){app._draggingobj.c=app._draggingobj.k.substr(0,app._draggingobj.k.indexOf('-'));
		if(app._draggingobj.c=='Xtag'){var x=gid('T'+app._draggingobj.k);
		if(x.parentElement!=gid('tag-tree')){x.parentElement.removeChild(x);
		f$.db.setparent(app._draggingobj.k.replace('Xtag-','tag-'),'tag-root','root');}}},
/* --------------------------------------------------------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------------------------------- general drag and drop */
	_draggingobj:{},allowdrop:function(ev){ev.preventDefault();},drag:function(k,n){app._draggingobj={'k':k,'n':n}},
	drop:function(k,n){var droppedon={'k':k,'n':n};if((app._draggingobj.k==droppedon.k)){return false}else{return app.dropped(app._draggingobj,droppedon)}},
	dropped:function(dragobj,dropobj){
		dropobj.c=dropobj.k.substr(0,dropobj.k.indexOf('-'));dragobj.c=dragobj.k.substr(0,dragobj.k.indexOf('-'));
		if(dropobj.c=='Xtag'){console.log('Dragged SOMETHING to TREETAG : Setting DOCUMENT PARENT of: '+dragobj.k+' to '+dropobj.k.replace('Xtag-','tag-'));
				f$.db.setparent(dragobj.k.replace('Xtag-','tag-'),dropobj.k.replace('Xtag-','tag-'),dropobj.n);
				if(dragobj.c=='Xtag'){if(!gid('T'+dropobj.k).firstChild.firstChild.classList.contains('fa-minus-circle')){app.toggleleaf(dropobj.k,gid('T'+dropobj.k).firstChild.firstChild);}}
		}else{
			var s=T.DLG.reldialog.replace(/%UID/g,window.uid()).replace(/%KEY1/g,dragobj.k.replace('Xtag-','tag-')).replace(/%KEY2/g,dropobj.k.replace('Xtag-','tag-'));
		var d=document.createElement('div');d.innerHTML=s;gid('mainwrap').appendChild(d);d.firstChild.show()}},
/* --------------------------------------------------------------------------------------------------------------------------- */
/* --------------------------------------------------------------------------------------------------------------- UPLOADS --- */
	upload:function(files){for(var i=0;i<files.length;i++){f$.fs.add(files[i],app._onupload);
		gid('uploadlog').innerHTML+='<br/>'+new Date().toLocaleString()+' - Upload started : '+files[0].name+'  ...';};},
	_onupload:function(file){
		gid('uploadlog').innerHTML+='<br/>'+new Date().toLocaleString()+' - Uploaded : '+file.doctitle+' - size : ['+file.size+'] <a href="'+file.downloadURLs[0]+'"><i class="fa fa-download"></i></a>';},
/* --------------------------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------------------- PICKER */
	/*picker is a generic selector for records attributes, it can be use as a file url picker*/
	setpicker:function(target,template,_fieldname,_exp,_collnames,_validate,_allownav){if(!_fieldname){_fieldname='$key'}if(!_exp){_exp='parent:root'}
		var o={target:target,fname:_fieldname,allownav:_allownav,T:template,validate:_validate||function(j){return true}};if(_collnames&&_allownav){if(_collnames.indexOf('tag')<0){_collnames[_collnames.length]='tag'}}
		f$.db.find(_exp,function(d){app._onpickeresult(d,o)},false,_collnames);
	},_onpickeresult:function(doc,opts){var ctype=doc.$key.substr(doc.$key.indexOf('-')+1);
		if(ctype=='tag'){
			if(doc[opts.fname]){var vvv=doc[opts.fname];if(vvv.join){vvv=vvv[0]}
				var h=opts.T.t.replace('%KEY',doc.$key).replace('%TITLE',doc[f$.db.docnamefield]).replace(/%VALUE/g,vvv);
				gid(opts.target).innerHTML+=h;
		}	}else{
			if(doc[opts.fname]){if(opts.validate(doc)){var vvv=doc[opts.fname];if(vvv.join){vvv=vvv[0]}
				var h=opts.T.o.replace('%KEY',doc.$key).replace('%TITLE',doc[f$.db.docnamefield]).replace(/%VALUE/g,vvv);
				gid(opts.target).innerHTML+=h;
	}	}	}	},
	openkeypicker:function(){var fp=gid('fieldpicker');clearchilds(fp);app.setpicker('fieldpicker',{
			o:'<button onclick="%SELJS" title="%VALUE">%TITLE</button>',
			t:'<a href="#" onclick="return false" title="%VALUE">%TITLE</a><br/>'},
			'fullPath','parent:root',false,false,true);gid('filedialog').showModal();},
	openimgpicker:function(t,k){var fp=gid('fieldpicker');clearchilds(fp);app.setpicker('fieldpicker',{
				o:'<button onclick="app.pickimage(\'%VALUE\',\''+k+'\')" title="seleziona"><img src="%VALUE" alt="%TITLE"/></button>',
				t:'<a href="#" onclick="return false" title="%VALUE">%TITLE</a><br/>'},
			'downloadURLs','parent:tag--KRKRoP7M9JVhp9Toz8m',['file'],
			function(d){if(d.contentType){if(d.contentType.indexOf('image')>-1){return true}}return false;},true);gid('filedialog').showModal();},
	pickimage(url,k){
		var tg=gid(k+'-desc1').parentElement.parentElement.getElementsByTagName('input');
		if(k.indexOf('tag-')>-1){tg[4].value=url;}else if(k.indexOf('news-')>-1){tg[2].value=url;}else{tg[1].value=url;}
		gid('filedialog').close()
	},
	openimgedit:function(e,k){
		var fi=gid('fieldimg');clearchilds(fi);var src=e.value;console.log(e);console.log(src);gid('imgeditdialog').showModal();var im=document.createElement('div');im.setAttribute('key',k);
		var bg=gid('DLG'+k).getAttribute('bkgsize');im.setAttribute('style','background-size:'+bg+'%;background-position:50% 50%;width:30%;height:0;padding-bottom:30%;margin:20px;border:1px solid red;background-color:#ffffff;margin-left:35%;background-image:url("'+src+'")');
		fi.appendChild(im);},
	setbkgsize:function(e,p){var img=e.getElementsByTagName('div')[0];img.style.backgroundSize=p+'%'},
	saveimgedit:function(e){
		var img=e.getElementsByTagName('div')[0];var val=img.style.backgroundSize;val=val.replace('%','');
		var key=img.getAttribute('key');gid('DLG'+key).setAttribute('bkgsize',val);
		//firebase.database().ref('products/'+key).update({'bkgsize':val});
	},
	
/* --------------------------------------------------------------------------------------------------------------------------- */
/* --------------------------------------------------------------------------------------------------------------- DIALOGS --- */
  dialog:function(key,forcejson){f$.db.getonce(key,function(d){var dlg=gid('DLG'+d.$key);if(dlg){dlg.parentElement.removeChild(dlg)}
		var cn=d.$key.substr(0,d.$key.indexOf('-'));
		var tod=new Date;
		if(!T.DLG[cn]){cn='json'}var ocn=cn;
		if(forcejson){cn='json'}
		/*TODO:FIND MORE ELEGANT SOLUTION FOR THE LINE BELOW - unifom delete api(IN OXYGEN SINCE THE COLLECTION NAME FOR FILES IS ALREADY CONFIG/HARDCODED)*/
		if(forcejson&&(ocn=='file')){cn='file'}
		var DLG=T.DLG[cn];if(cn=='json'){DLG=DLG.replace('fa fa-code','fa fa-refresh').replace('%FORCEJSON','false')}else{DLG=DLG.replace('%FORCEJSON','true')}
		DLG=DLG.replace(/%KEY/g,d.$key).replace(/%TITLE/g,d.doctitle).replace(/%JSTITLE/g,d.doctitle.replace('\'','\\\''));
		DLG=DLG.replace(/%C1/g,d.c1).replace(/%C2/g,d.c2).replace(/%CElev/g,d.level||4);
		DLG=DLG.replace(/%CEurl/g,d.url||'').replace(/%Cimgurl/g,d.imgurl||'').replace(/%BKGSIZE/g,d.bkgsize||'100');
		DLG=DLG.replace(/%Cdescription_it/g,d['description_it']).replace(/%Cdescription_en/g,d.description_en);
		DLG=DLG.replace(/%JSON/g,JSON.stringify(d,' ',' '));
		DLG=DLG.replace(/%SELJS/g,'TODOSELJS');
		DLG=DLG.replace(/%PARENT/g,d.parent);
		if((tod.getUTCMonth()==10)||(tod.getUTCMonth()+1)==11||(tod.getUTCMonth()+1)==12){
		DLG=DLG.replace(/%CDATE/g,d.date||tod.getUTCFullYear()+'-'+(tod.getUTCMonth()+1)+'-'+(tod.getUTCDate()+1));	
		}else{DLG=DLG.replace(/%CDATE/g,d.date||tod.getUTCFullYear()+'-0'+(tod.getUTCMonth()+1)+'-'+(tod.getUTCDate()+1));}
		gid('hiddentarget').innerHTML+=DLG;
		setTimeout('app.maketiny(\'#DLG'+d.$key+' div.editable\');gid("DLG'+d.$key+'").show();',50);
	});return false;},
	dialog_close:function(dlgid){var x=gid(dlgid);var xx=x.getElementsByTagName('div');for(var e=0;e<xx.length;e++){tinymce.remove(tinymce.get(xx[e].id))};x.close();x.parentElement.removeChild(x);},
	dialog_drag_start:function(event){var style = window.getComputedStyle(event.target.parentElement, null);
    var str = (parseInt(style.getPropertyValue("left")) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top")) - event.clientY)+ ',' + event.target.parentElement.id;
    event.dataTransfer.setData("Text",str);},
	dialog_drop:function(event){var offset = event.dataTransfer.getData("Text").split(',');var dm=document.getElementById(offset[2]);
    dm.style.left=(event.clientX+parseInt(offset[0],10))+'px';dm.style.top =(event.clientY+parseInt(offset[1],10))+'px';
    event.preventDefault();document.body.removeAttribute('ondrop');document.body.removeAttribute('ondragover');return false;},
  dialog_drag_over:function(event){event.preventDefault();document.body.setAttribute('ondrop','app.dialog_drop(event)');document.body.setAttribute('ondragover','event.preventDefault()');return false;},
/* ---------------------------------------------------------------------------------------------------------------------****--- */
/* ------------------------------------------------------------------------------------------------------------------ DB CALLS */
	save:function(doc){if(!doc.$key){alert('$key property must be present in the document');}f$.db.set(J)},
	newtag:function(){var a=gid('newtagname');var o={doctitle:a.value,parent:'tag-root',ptitle:'root',c1:gid('newtagc1').value,c2:gid('newtagc2').value};a.value='';f$.db.add('tag',o);},
	savetag:function($key){var ee=gid('DLG'+$key).getElementsByTagName('input');var tt=gid('DLG'+$key).getElementsByClassName('editable');var bk=gid('DLG'+$key).getAttribute('bkgsize');
	 var ttc=[];for(var e=0;e<tt.length;e++){var test=tinymce.get(tt[e].id);if(test){ttc[e]=test.getContent()}else{ttc[e]=''}};var bk=gid('DLG'+$key).getAttribute('bkgsize');
		var o={doctitle:ee[0].value,c1:ee[1].value,c2:ee[2].value,level:ee[3].value,imgurl:ee[4].value,url:ee[5].value.toLowerCase(),description_it:ttc[0],description_en:ttc[1],$key:$key,bkgsize:bk};
		f$.db.update(o);},	
	saveprod:function($key){var ee=gid('DLG'+$key).getElementsByTagName('input');var tt=gid('DLG'+$key).getElementsByClassName('editable');var bk=gid('DLG'+$key).getAttribute('bkgsize');
	  var ttc=[];for(var e=0;e<tt.length;e++){console.log(tt[e].id);ttc[e]=tinymce.get(tt[e].id).getContent();};
		var o={doctitle:ee[0].value,imgurl:ee[1].value,url:ee[2].value.toLowerCase(),description_it:ttc[0],description_en:ttc[1],$key:$key,bkgsize:bk};
		f$.db.update(o);},
	savenews:function($key){var ee=gid('DLG'+$key).getElementsByTagName('input');var tt=gid('DLG'+$key).getElementsByClassName('editable');var bk=gid('DLG'+$key).getAttribute('bkgsize');
	 var ttc=[];for(var e=0;e<tt.length;e++){console.log(tt[e].id);ttc[e]=tinymce.get(tt[e].id).getContent();};
		var o={doctitle:ee[0].value,imgurl:ee[2].value,url:ee[3].value.toLowerCase(),description_it:ttc[0],description_en:ttc[1],date:ee[1].value,$key:$key,bkgsize:bk};
		f$.db.update(o);},
		newobject:function(){var cs=gid('collname');if(cs.selectedIndex>-1){var s=cs.options[cs.selectedIndex].value;if(s=='other'){s=gid('othercollname').value}
	s=s.trim();if(s==''){s='news'}f$.db.getone(f$.db.add(s,{doctitle:'untitled document',parent:'root'}).$key,app._on_records_results,app._on_records_results_removed);}else{console.log('No object type selected')}},
	saveobj:function($key){var ee=gid('DLG-JSON-'+$key).value;var o=JSON.parse(ee);f$.db.set(o);},
/* --------------------------------------------------------------------------------------------------------------------------- */
/* --------------------------------------------------------------------------------------------------------- RESULTS TABLE --- */
	_record_odd:false,
	search:function(exp,_collection){app.gototab('resultsview',gid('b_resultsview'));this._records_reset();f$.db.find(exp,app._on_records_results,app._on_records_removed,['societa','persona','location','file']);},
	_curr_cols:{"$key":{idx:0},"collection":{idx:1},"parent":{idx:2},"tags":{idx:3},"rels":{idx:4}},_curr_cols_count:5,
	_records_reset:function(){this._curr_cols={"$key":{idx:0},"doctitle":{idx:1},"collection":{idx:2},"parent":{idx:3},"tags":{idx:4},"rels":{idx:5}};this._curr_cols_count=6;
		gid('resultsview').innerHTML='<table id="resultstable"><tbody><th><b>doctitle</b></th><th><b>collection</b></th><th><b>parent</b></th><th><b>tags</b></th><th><b>rels</b></th></tbody><tbody></tbody></table>';
		gid('resultsview').setAttribute('onscroll',"app._ontablescroll()");app._ontablescroll()},	
	_ontablescroll:function(){var ty=gid('resultsview');var s='transform:translate(Xpx,Ypx);background-color:#0F0;border-bottom:1px solid #0F0';
		document.getElementsByTagName('tr')[0].setAttribute('style',s.replace('X',0-ty.scrollLeft).replace('Y',-25));},
	_on_records_results_removed:function(snap){if(snap.key){var tr=document.getElementsByClassName('res'+d['$key'])[0];if(tr){tau.clearchilds(tr);tr.parentElement.removeChild(tr);}}},
	_on_records_removed:function(key){var tr=document.getElementsByClassName('res'+key.replace(/ /g,''))[0];if(tr){tr.parentElement.removeChild(tr)}},
	_on_records_results:function(d){var x;var outs={};var out='';
		for(x in d){if(!app._curr_cols[x]){if((x!='ptitle')&&(x!='url')){app._curr_cols[x]={idx:app._curr_cols_count};app._curr_cols_count++;outs[app._curr_cols[x].idx]=d[x];
			var th=document.createElement('th');th.innerHTML='<b>'+x+'</b>';
			gid('resultstable').tBodies[0].rows[0].appendChild(th);}}}
		var tr=document.getElementsByClassName('res'+d['$key'].replace(/ /g,''))[0];
		if(!tr){tr=document.createElement('tr');tr=gid('resultstable').tBodies[1].insertRow(tr);}else{tau.clearchilds(tr);}	
		tr.classList.add('res'+d['$key'].replace(/ /g,''));
		
		if(app._record_odd){tr.classList.add('odd');app._record_odd=false}else{app._record_odd=true}
		var td=document.createElement('td');if(!d[f$.db.docnamefield]){d[f$.db.docnamefield]=d.$key.substr(d.$key.indexOf('-')+1).replace('*','.');}
		td.innerHTML='<a target="_blank" href="'+apphost+'/?'+d['url']+'" /><i class="fa fa-external-link"></i></a><a href="#" onclick="return app.dialog(\''+d['$key']+'\')" draggable="true" ondragstart="app.drag(\''+d['$key']+'\',\''+d[f$.db.docnamefield].replace('\'','\\\'')+'\')" ondragover="event.preventDefault()" ondrop="fix(event);app.drop(\''+d['$key']+'\',\''+d[f$.db.docnamefield]+'\')"> '+d[f$.db.docnamefield]+'</a>';
		tr.appendChild(td);var r;
		for(var o in app._curr_cols){if((o!='$key')&&(o!='doctitle')&&(o!='ptitle')&&(o!='url')){td=document.createElement('td');
			if(T.TFIELD[o]){td.innerHTML=T.TFIELD[o](d[o]);}else{
			if(!d[o]){if(o=='collection'){td.innerHTML=d.$key.substr(0,d.$key.indexOf('-'))}
				else if(o=='tags'){if(d.rels){var tmps='';for(r in d.rels){if(r.indexOf('tag-')==0){
					tmps+=T.taglink.replace(/%KEY/g,r).replace(/%TITLE/g,d.rels[r].n).replace(/%JSTITLE/g,d.rels[r].n.replace('\'','\\\''))+', ';
				}}td.innerHTML=tmps.substr(0,tmps.length-2);}}}
			else if(o=='rels'){if(d.rels){var tmps='';for(r in d.rels){if(r.indexOf('tag-')!=0){
					tmps+=T.taglink.replace(/%KEY/g,r).replace(/%TITLE/g,d.rels[r].n).replace(/%JSTITLE/g,d.rels[r].n.replace('\'','\\\''))+', ';
				}}td.innerHTML=tmps.substr(0,tmps.length-2);}}
			else if(o=='downloadURLs'){var hh='<a target="_blank" href="'+d[o].join('"><i class="fa fa-download"></i></a><a href="')+'"><i class="fa fa-download"></i></a>';td.innerHTML=hh;}
			else if(o=='parent'){
				td.innerHTML=T.taglink.replace(/%KEY/g,d[o]).replace(/%TITLE/g,d['ptitle']).replace(/%JSTITLE/g,d['ptitle'].replace('\'','\\\''))}
			else if(o=='imgurl'){
				td.innerHTML='<button onclick="alert(\'zoom todo\')"><img src="'+d[o]+'" alt="image for '+d[o]+'" style="height:40px" /></button>'}
			else if(d[o].join){td.innerHTML=d[o].join(', ')} 
			else if(typeof d[o]=='number'){td.innerHTML=d[o].toLocaleString()}
			else if(typeof d[o]=='object'){td.innerHTML=JSON.stringify(d[o])}
			else{if(d[o].length){
					d[o]=d[o].replace(/<.*\/>/g,' ');d[o]=d[o].replace(/\s/g,' ');
					d[o]=d[o].replace(/<([^>]+)\/>/g,' ');d[o]=d[o].replace(/(<([^>]+)>)/ig,'');d[o]=d[o].replace(/<link .*>/g,' ');
				if(d[o].length>100){d[o]=d[o].substring(0,95)+'[...]'}td.innerText=d[o]}}
			}tr.appendChild(td);}}},
/* --------------------------------------------------------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------ TINY MCE */
maketiny:function(selector){tinymce.init({selector: selector,
	image_advtab:true,inline:true,resize:'both',menubar: 'edit insert view format table tools',
	invalid_elements: '',extended_valid_elements: 'img[class=myclass|!src|border:0|alt|title|width|height|style],i[class=myclass|style]',
  //theme: 'modern',
  plugins: ['advlist autolink lists link image charmap hr anchor pagebreak',
    'searchreplace wordcount visualblocks visualchars code fullscreen',
    'insertdatetime media nonbreaking save table contextmenu directionality',
    'emoticons template paste textcolor colorpicker textpattern imagetools'],
	toolbar1: " forecolor backcolor | bullist numlist outdent indent | emoticons | code ",  
  templates: [
    { title: 'Test template 1', content: 'Test 1' },
    { title: 'Test template 2', content: 'Test 2' }
  ],
  content_css: [
    '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
    '//www.tinymce.com/css/codepen.min.css',				
		'https://cdn.rawgit.com/FortAwesome/Font-Awesome/master/css/font-awesome.min.css',
		'../../js/main.js',
  ]});}};
/* --------------------------------------------------------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------------------------------------------- ACE DITOR */




/*
 -METASCHEMA_CONFIG:{
	 'root'
	 'uploads'
 }
PRE SETUP STEPS
-FIREBASE CODE
-ANALYTICS CODE
-oxy prefix
-doctitle

SETUP STEPS
-root tag (auto)
-uploads tag (auto)
-templates tag (auto)
-reindex collections

//parent:-KKp9Xq_SB-X2IK7o4yp
parent:-KKpBIMNFcVbEW0t2cqT

*/
//TEMPORARY SCRIPT TO RESIZE TREE
function addListeners(){
	window.resizeBar=document.getElementById('resizebar');resizeBar.addEventListener('mousedown', mouseDown, false);window.addEventListener('mouseup', mouseUp, false);
}
function mouseUp()
{
    window.removeEventListener('mousemove', divMove, true);
}
function mouseDown(e){
	var button=document.getElementsByClassName('fa-indent')[0] || document.getElementsByClassName('fa-dedent')[0]
	button.classList.add('fa-dedent');button.classList.remove('fa-indent');document.body.classList.remove('noleft');window.addEventListener('mousemove', divMove, true);
}
function divMove(e){
    var div = document.getElementById('resizebar');var left = document.getElementById('leftwrap');var wrap = document.getElementById('mainwrap');
  div.style.left = e.clientX + 'px';wrap.style.left = e.clientX + 'px';left.style.width = e.clientX + 'px';
}
