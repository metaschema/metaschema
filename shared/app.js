window.currentLANG='_it';window.loadv=0;
window.fix=function(ev){ev.stopPropagation();ev.preventDefault();};
/* --------------------------------------------------------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------- TEMPLATES --- */
T={	relink:'<button class="color fr" onclick="app.search(\'frel:%KEY\')" style="display:absolute;" title="relativi..."><i class="fa fa-play"></i></button>',
	treenode:`<div class="treenode" id="TX%KEY" ondragstart="event.stopPropagation();app.drag('X%KEY','%JSTITLE')" ondrop="var conf=confirm('Stai cambiando il padre del prodotto. Vuoi continuare?');if(conf==true){fix(event);app.drop('X%KEY','%JSTITLE')}" ondragover="fix(event);"><button
		 onclick="app.toggleleaf('X%KEY',this.firstChild)"><i class="fa fa-plus-circle"></i></button>
		<a href="#" onclick="return app.search('parent:%KEY');">%TITLE</a><button class="color fr" href="#" onclick="app.dialog('%KEY')" style="background-color:%C2;border-color:%C1;">&nbsp;</button>%REL</div>`,
	reldialog:`<dialog class="dialog" id="%UID" draggable="true">%KEY1<br/>%KEY2<br/>
		<br/><button onclick="var conf=confirm('Stai relazionando i due documenti. Vuoi continuare?');if(conf==true){f$.db.link('%KEY1','%KEY2');app.dialog_close(this.parentElement.id)}"><i class="fa fa-link"></i></button><button
		 onclick="var conf=confirm('Stai cancellando la relazione tra i due documenti. Vuoi continuare?');if(conf==true){f$.db.unlink('%KEY1','%KEY2');app.dialog_close(this.parentElement.id)}"><i class="fa fa-unlink"></i></button><button onclick="app.dialog_close(this.parentElement.id)">cancel</button></dialog>`};
/* --------------------------- ------------------------------------------------------------------------------------------------ */
/* -------------------------------------------------------------------------------------------------------------- APP CODE --- */
window.app={loggedin:false,
	init:function(){var _this=this;document.title=METACONFIG.title;it3.$$('customlogo').src=METACONFIG.resdir+'/logo.png';it3.$$('customlink').href=METACONFIG.customlink;
		f$.initAuth();firebase.auth().onAuthStateChanged(function(user){it3.$$('prelogindiv').style.display='none';
		if(user){_this.loggedinit(user);it3.$$('metaschema-app').style.display='';it3.$$('logindiv').style.display='none';}
		else{it3.$$('metaschema-app').style.display='none';it3.$$('logindiv').style.display='';console.log('log off');}});
		app.MAINW=it3.$$('mainwrap');app.RESW=it3.$$('resultsview');it3.actb('pattern');
		it3.preload(METACONFIG.preloads,'responseText',function(){console.log('Preloaded OK')});},
	login:function(provider){f$.login(provider);},logout:function(provider){f$.logout();},
	loggedinit:function(user){var uname=user.email;if(user.displayName){uname=user.displayName;}
		it3.$$('username').innerHTML=' '+uname;
		//if user is not agreed make him agree to termsELSE	
		firebase.database().ref('/tag/root').set({"doctitle":"root",c1:'#000000',c2:'#6fa56f'});
		this.refreshtree();
		//if not hidewelcomedialog show welcome dialog / assistent
	},
/* --------------------------------------------------------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------- TOP BAR */
	gototab:function(tab,button){var tabs=it3.$$c('tabs-b');for(var t=0;t<tabs.length;t++){tabs[t].classList.remove('pushed');}if(button){button.classList.add('pushed');}app.MAINW.classList.add(tab);
	if(tab!='homeview'){app.MAINW.classList.remove('homeview');}if(tab!='resultsview'){app.MAINW.classList.remove('resultsview');}if(tab!='detailsview'){app.MAINW.classList.remove('detailsview');}},
/* --------------------------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------------- TAG TREE --- */
	toggletree:function(button){document.body.classList.toggle('noleft');button.classList.toggle('pushed');
		var c=button.childNodes[0].classList;c.toggle('ion-ios-arrow-back');c.toggle('ion-navicon');it3._Tonscroll(app.RESW);},
	refreshtree:function(){it3.$$('tag-tree').innerHTML='';firebase.database().ref('/tag').off('child_added');
	 firebase.database().ref('/tag').off('child_changed');firebase.database().ref('/tag').off('child_removed');
		var r=firebase.database().ref('/tag').orderByChild("parent").startAt('tag-root').endAt('tag-root');
		r.on('child_added',app._refreshtree);r.on('child_changed',app._refreshtree);r.on('child_removed',app._tagremoved);},
	_refreshtree:function(snap){var v=snap.val();v.$key='tag-'+snap.key;var prev=it3.$$('TX'+v.$key);if(prev){prev.parentElement.removeChild(prev);}
		var HTML=T.treenode;if(v.rels){HTML=HTML.replace('%REL',T.relink)}else{HTML=HTML.replace('%REL','')}
		HTML=HTML.replace(/%KEY/g,v.$key).replace(/%TITLE/g,v.doctitle).replace(/%JSTITLE/g,v.doctitle.replace('\'','\\\'')).replace(/%C2/g,v.c2).replace(/%C1/g,v.c1);it3.$$('tag-tree').innerHTML+=HTML},
	toggleleaf:function($key,button){var k=$key.replace('Xtag-','tag-');var flag=true;if(button){button.classList.toggle('fa-plus-circle');button.classList.toggle('fa-minus-circle');}
		var leaf=it3.$$('TC'+$key);if(!leaf){it3.$$('T'+$key).innerHTML+='<div id="TCX%KEY" class="treeleaf">%CTC</div>'.replace(/%KEY/g,$key.substr(1)).replace(/%CTC/g,'')}
		else{if(leaf.style.display!='none'){leaf.style.display='none';flag=false;}else{leaf.style.display='';flag=false}}
		var tmpfn=function(snap){app._toggleleaf(snap,$key)};var tmpfn1=function(snap){app._tagremoved(snap,$key)};
		if(flag){var r=firebase.database().ref('/tag').orderByChild("parent").startAt(k).endAt(k);
		r.on('child_added',tmpfn);r.on('child_changed',tmpfn);r.on('child_removed',app._tagremoved);}},
	_toggleleaf:function(snap,$key){var v=snap.val();v.$key='tag-'+snap.key;var prev=it3.$$('TX'+v.$key);if(prev){prev.parentElement.removeChild(prev);}
		var HTML=T.treenode;if(v.rels){HTML=HTML.replace('%REL',T.relink)}else{HTML=HTML.replace('%REL','')}
		HTML=HTML.replace(/%KEY/g,v.$key).replace(/%TITLE/g,v.doctitle).replace(/%JSTITLE/g,v.doctitle.replace('\'','\\\'')).replace(/%C2/g,v.c2).replace(/%C1/g,v.c1);it3.$$('TC'+$key).innerHTML+=HTML},
	_tagremoved:function(snap){var v=snap.val();console.log(v);v.$key='tag-'+snap.key;var prev=it3.$$('TX'+v.$key);if(prev){prev.parentElement.removeChild(prev);}},
	tag_to_root:function(){app._draggingobj.c=app._draggingobj.k.substr(0,app._draggingobj.k.indexOf('-'));
		if(app._draggingobj.c=='Xtag'){var x=it3.$$('T'+app._draggingobj.k);
		if(x.parentElement!=it3.$$('tag-tree')){x.parentElement.removeChild(x);
		f$.db.setparent(app._draggingobj.k.replace('Xtag-','tag-'),'tag-root','root');}}},
/* ---------------------------------------------------------------------------------------------------------- RESIZABLE BAR --- */
	listenResize:function(){window.resizeBar=it3.$$('resizebar');resizeBar.addEventListener('mousedown',function(){
		var button=it3.$$c('ion-navicon')[0]||it3.$$c('ion-ios-arrow-back')[0];
		button.classList.add('ion-ios-arrow-back');button.classList.remove('ion-navicon');
		document.body.classList.remove('noleft');window.addEventListener('mousemove',app._resizeBar,true);},false);
	window.addEventListener('mouseup',function(){window.removeEventListener('mousemove',app._resizeBar,true);},false);},
	_resizeBar:function(e){var div=it3.$$('resizebar');var left=it3.$$('leftwrap');var wrap=it3.$$('mainwrap');
		div.style.left=e.clientX+'px';wrap.style.left=e.clientX+'px';left.style.width=e.clientX+'px';},
/* ---------------------------------------------------------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------ general drag and drop */
	_draggingobj:{},allowdrop:function(ev){ev.preventDefault();},drag:function(k,n){app._draggingobj={'k':k,'n':n}},
	drop:function(k,n){var droppedon={'k':k,'n':n};if((app._draggingobj.k==droppedon.k)){return false}else{return app.dropped(app._draggingobj,droppedon)}},
	dropped:function(dragobj,dropobj){
		dropobj.c=dropobj.k.substr(0,dropobj.k.indexOf('-'));dragobj.c=dragobj.k.substr(0,dragobj.k.indexOf('-'));
		if(dropobj.c=='Xtag'){console.log('Dragged SOMETHING to TREETAG : Setting DOCUMENT PARENT of: '+dragobj.k+' to '+dropobj.k.replace('Xtag-','tag-'));
				f$.db.setparent(dragobj.k.replace('Xtag-','tag-'),dropobj.k.replace('Xtag-','tag-'),dropobj.n);
				if(dragobj.c=='Xtag'){if(!it3.$$('T'+dropobj.k).firstChild.firstChild.classList.contains('fa-minus-circle')){app.toggleleaf(dropobj.k,it3.$$('T'+dropobj.k).firstChild.firstChild);}}
		}else{var s=T.reldialog.replace(/%UID/g,it3.uid()).replace(/%KEY1/g,dragobj.k.replace('Xtag-','tag-')).replace(/%KEY2/g,dropobj.k.replace('Xtag-','tag-'));
		it3.ins(app.MAINW,'div',false,s).firstChild.show()}},
/* --------------------------------------------------------------------------------------------------------------------------- */
/* --------------------------------------------------------------------------------------------------------- RESULTS TABLE --- */
	search:function(exp,_collection){it3.actb('pattern').clear();app.gototab('resultsview',it3.$$('b_resultsview'));it3.tableremove('resultstable');it3.clearchilds(app.RESW);
		var XT=it3.ins(app.RESW,'table',['id','resultstable'],app._base_tbody.toString());XT=it3.table(XT);XT.colstot=5;
		XT.cols={'doctitle':true,'collection':true,'parent':true,'tags':true,'rels':true};
		XT.fncol=METACONFIG.TABLESPECIALCOLS;XT.ignorecol={'doctitle':true,'$key':true,'ptitle':true};		
		f$.db.find(exp,function(d){XT.add(d);app.loading();},function(x){XT.remove(x)},METACONFIG.searchcolls);return false;},
	_base_tbody:'<thead><th><b>doctitle</b></th><th><b>collection</b></th><th><b>parent</b></th><th><b>tags</b></th><th><b>rels</b></th></thead><tbody></tbody>',
	loading:function(){loadv=loadv+360;it3.$$('backup-icon').style.transform="rotate("+loadv+"deg)";if(loadv>=14000){loadv=0};},
/* --------------------------------------------------------------------------------------------------------------------------- */
/* --------------------------------------------------------------------------------------------------------------- DIALOGS --- */
	dialog:function(key,forcejson){f$.db.getonce(key,function(d){var dlg=it3.$$('DLG'+d.$key);if(dlg){dlg.parentElement.removeChild(dlg)}
		var cn=d.$key.substr(0,d.$key.indexOf('-'));var tod=new Date;var sort=100;var ocn=cn;
		if(forcejson){cn='json'}if(!it3.preloaded[METACONFIG.resdir+'/dlg-'+cn+'.xml']){cn='json'}		
			it3.render('hiddentarget',it3.preloaded[METACONFIG.resdir+'/dlg-'+cn+'.xml'],d,'append');
			setTimeout('app.maketiny(\'#DLG'+d.$key+' div.editable\');it3.$$("DLG'+d.$key+'").show();app.makeace(\'#DLG'+d.$key+' div.acedit\');',50);
		});return false;},
	dialog_close:function(dlgid){var x=it3.$$(dlgid);var xx=x.getElementsByTagName('div');for(var e=0;e<xx.length;e++){tinymce.remove(tinymce.get(xx[e].id))};x.close();x.parentElement.removeChild(x);},
	dialog_drag_start:function(event){var style = window.getComputedStyle(event.target.parentElement, null);
    var str = (parseInt(style.getPropertyValue("left")) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top")) - event.clientY)+ ',' + event.target.parentElement.id;
    event.dataTransfer.setData("Text",str);},
	dialog_drop:function(event){var offset = event.dataTransfer.getData("Text").split(',');var dm=it3.$$(offset[2]);
    dm.style.left=(event.clientX+parseInt(offset[0],10))+'px';dm.style.top =(event.clientY+parseInt(offset[1],10))+'px';
    event.preventDefault();document.body.removeAttribute('ondrop');document.body.removeAttribute('ondragover');return false;},
	dialog_drag_over:function(event){event.preventDefault();document.body.setAttribute('ondrop','app.dialog_drop(event)');document.body.setAttribute('ondragover','event.preventDefault()');return false;},
/* --------------------------------------------------------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------ SAVERS FUNCTIONS --- */
    _inputsaver:{'hidden':function(n){return n.value},'text':function(n){return n.value},
		'color':function(n){return n.value},'number':function(n){return n.value},'date':function(n){return n.value},'textarea':function(n){return n.value},
		'checkbox':function(n){if(n.checked){return true}else{return false}},'radio':function(n){if(n.checked){return true}else{return false}},
		'div':function(n){if(n.classList.contains('editable')){return tinymce.get(n.id).getContent();}else if(n.classList.contains('acedit')){return ace.edit(n).getValue()}}},
	saveobj:function($key){var ee=it3.$$('DLG-JSON-'+$key).value;var o=JSON.parse(ee);f$.db.set(o);},
	_save:function($key,p,ptit){var o={"$key":$key,parent:p,ptitle:ptit};
		var tt=it3.sel("//*[contains(@it3,'data')]",it3.$$('DLG'+$key));
		for(var i=0;i<tt.length;i++){var dt=tt[i].getAttribute('name');var i3=tt[i].getAttribute('it3');var vl;var nn=tt[i].nodeName.toLowerCase();
			if(nn=='input'){vl=app._inputsaver[tt[i].getAttribute('type')](tt[i]);}else{vl=app._inputsaver[nn](tt[i]);}
			if(it3.starts(i3,'data:json')){vl=JSON.parse(vl);}
			else if(it3.starts(i3,'data:something')){/*todo execute javascript in data attribute*/}
			if(vl){o[dt]=vl;}if(vl===false){o[dt]=vl;}}f$.db.update(o,'save',false);},
	save:function(doc){if(!doc.$key){alert('$key property must be present in the document');}f$.db.set(J)},
	newtag:function(){var a=it3.$$('newtagname');var o={doctitle:a.value,parent:'tag-root',ptitle:'root',c1:it3.$$('newtagc1').value,c2:it3.$$('newtagc2').value};a.value='';f$.db.add('tag',o);},
	newobject:function(){var cs=it3.$$('collname');if(cs.selectedIndex>-1){var s=cs.options[cs.selectedIndex].value;if(s=='other'){s=it3.$$('othercollname').value}
	s=s.trim();if(s==''){s='news'}app.search('key:'+f$.db.add(s,{doctitle:'untitled document',parent:'root'}).$key);}else{console.log('No object type selected')}},
/* --------------------------------------------------------------------------------------------------------------------------- */
/* --------------------------------------------------------------------------------------------------------------- UPLOADS --- */
	upload:function(files){for(var i=0;i<files.length;i++){f$.fs.add(files[i],app._onupload);
		it3.$$('uploadlog').innerHTML+='<br/>'+new Date().toLocaleString()+' - Upload started : '+files[0].name+'  ...';}},
	_onupload:function(file){it3.$$('uploadlog').innerHTML+='<br/>'+new Date().toLocaleString()+' - Uploaded : '+file.doctitle+' - ['+file.size+'b] <a href="'+file.downloadURLs[0]+'"><i class="fa fa-download"></i></a>';},
/* --------------------------------------------------------------------------------------------------------------------------- */
/* -- picker is a generic selector for records attributes, it can be use as a file url picker ------------------------- PICKER */
	setpicker:function(target,template,_fieldname,_exp,_collnames,_validate,_allownav){if(!_fieldname){_fieldname='$key'}if(!_exp){_exp='parent:root'}
		var o={target:target,fname:_fieldname,allownav:_allownav,T:template,validate:_validate||function(j){return true}};if(_collnames&&_allownav){if(_collnames.indexOf('tag')<0){_collnames[_collnames.length]='tag'}}
		f$.db.find(_exp,function(d){app._onpickeresult(d,o)},false,_collnames);},
	_onpickeresult:function(doc,opts){var ctype=doc.$key.substr(doc.$key.indexOf('-')+1);var n=doc[f$.db.docnamefield];var h;
		if(ctype=='tag'){if(doc[opts.fname]){var vvv=doc[opts.fname];if(vvv.join){vvv=vvv[0]}
			var h=opts.T.t.replace('%KEY',doc.$key).replace('%TITLE',n).replace(/%VALUE/g,vvv);
		}}else{if(doc[opts.fname]){if(opts.validate(doc)){var vvv=doc[opts.fname];if(vvv.join){vvv=vvv[0]}
			var h=opts.T.o.replace('%KEY',doc.$key).replace('%TITLE',n).replace(/%VALUE/g,vvv);
	}}}it3.$$(opts.target).innerHTML+=h;},
/*	openkeypicker:function(){var fp=it3.$$('fieldpicker');it3.clearchilds(fp);app.setpicker('fieldpicker',{
			o:'<button onclick="%SELJS" title="%VALUE">%TITLE</button>',t:'<a href="#" onclick="return false" title="%VALUE">%TITLE</a><br/>'},
			'fullPath','parent:root',false,false,true);it3.$$('filedialog').showModal();},*/
/* --------------------------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------------- IMG PICKER */			
	openimgpicker:function(t,k){var fp=it3.$$('fieldpicker');it3.clearchilds(fp);app.setpicker('fieldpicker',{
				o:'<button onclick="app.pickimage(\'%VALUE\',\''+k+'\')" title="seleziona"><img src="%VALUE" alt="%TITLE"/></button>',
				t:'<a href="#" onclick="return false" title="%VALUE">%TITLE</a><br/>'},'downloadURLs','parent:tag--KRKRoP7M9JVhp9Toz8m',['file'],
			function(d){if(d.contentType){if(d.contentType.indexOf('image')>-1){return true}}return false;},true);it3.$$('filedialog').showModal();},
	pickimage(url,k){var tg=it3.$$('imgurl-'+k);tg.value=url;tg.setAttribute('style','background-image:url('+url+')');it3.$$('filedialog').close()},
	openimgedit:function(e,k){var fi=it3.$$('fieldimg');it3.clearchilds(fi);var src=e.value;it3.$$('imgeditdialog').showModal();
		var styl='background-size:'+it3.$$('DLG'+k+'-bkgsize').value+'%;background-position:50% 50%;width:30%;height:0;padding-bottom:30%;margin:20px;border:1px solid red;background-color:#ffffff;margin-left:35%;background-image:url("'+src+'")';
		it3.ins(fi,'div',['key',k,'style',styl])},
	setbkgsize:function(e,p){var img=e.getElementsByTagName('div')[0];img.style.backgroundSize=p+'%'},
	saveimgedit:function(e){var img=e.getElementsByTagName('div')[0];var val=img.style.backgroundSize;val=val.replace('%','');
		var key=img.getAttribute('key');it3.$$('DLG'+key+'-bkgsize').value=val;},
	removeimg:function(k){it3.$$('imgurl-'+k).style.backgroundImage="url(shared/noimg.png)";it3.$$('imgurl-'+k).value="";},	
/* --------------------------------------------------------------------------------------------------------------------------- */
	langsel:function(lang,k){var l=it3.$$c('tab-content'+k);
		for(var i=0;i<l.length;i++){l[i].style.display="none";it3.$$c('langsel'+k)[i].classList.add('not');}
		it3.$$('tab-content'+k+'_'+lang).style.display="block";it3.$$('langsel_'+lang+'_'+k).classList.remove('not');},
	zoomimg:function(imgurl){
          var t=it3.ins(document.body,'div',['style','width:100vw;height:100vh;position:absolute;overflow-y:scroll;background:rgba(0,0,0,0.5)','onclick','this.parentElement.removeChild(this)']);
          it3.ins(t,'img',['src',imgurl,'style','width:50%;margin-left:25%;margin-top:5%;']);},
	filterimg:function(query,e){if(e.keyCode==13) {var imgs=it3.$$('fieldpicker').getElementsByTagName('button');
		for(var i=0;i<imgs.length;i++){if(query==""){imgs[i].style.display="inline-block"}else{
			imgs[i].style.display="none";
			var onc=imgs[i].getAttribute('onclick');var ONC=onc.toUpperCase();var oncc=onc.toLowerCase();
			if (onc.indexOf(query) >= 0||oncc.indexOf(query) >= 0||ONC.indexOf(query) >= 0){
				imgs[i].style.display="inline-block";
	}	}	}	}	},
/* --------------------------------------------------------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------ TINY MCE */
maketiny:function(selector){tinymce.init({selector: selector,image_advtab:true,inline:true,resize:'both',menubar: 'edit insert view format table tools',
	invalid_elements:'',extended_valid_elements:'img[class=myclass|!src|border:0|alt|title|width|height|style],i[class=myclass|style]',
	plugins:['advlist autolink lists link image charmap hr anchor pagebreak','searchreplace wordcount visualblocks visualchars code fullscreen',
		'insertdatetime media nonbreaking save table contextmenu directionality','emoticons template paste textcolor colorpicker textpattern imagetools',
		'fontawesome noneditable'],toolbar1:" forecolor backcolor | bullist numlist outdent indent | emoticons | code | fontawesome ",  
	noneditable_noneditable_class:'fa',templates:[{title:'Bordo stondato',description:'Aggiungi bordo stondato',content:'border-radius:200px'}],
	content_css: ['../../css/main.css.js','//www.tinymce.com/css/codepen.min.css','//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
		'https://cdn.rawgit.com/FortAwesome/Font-Awesome/master/css/font-awesome.min.css',
]});},
/* --------------------------------------------------------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------------------------------------------- ACE DITOR */
makeace:function(selector){var nn=document.querySelectorAll(selector);for(var n=0;n<nn.length;n++){
	var e=ace.edit(nn[n]);/*e.setTheme("ace/theme/monokai");*/e.getSession().setMode("ace/mode/html");
}}
};