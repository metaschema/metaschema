window.gid=function(id){return document.getElementById(id);}
window.uid=function(_pfx){_uid++;if(!_pfx){_pfx='uid'}return _pfx+'-'+uid};window._uid=0;
window.toggleFullScreen=function(){if((document.fullScreenElement&&document.fullScreenElement!==null)||
(!document.mozFullScreen&&!document.webkitIsFullScreen)){if(document.documentElement.requestFullScreen){
document.documentElement.requestFullScreen();}else if(document.documentElement.mozRequestFullScreen){
document.documentElement.mozRequestFullScreen();}else if(document.documentElement.webkitRequestFullScreen){
document.documentElement.webkitRequestFullScreen(Element.ALLOWKEYBOARDINPUT);}}
else{if(document.cancelFullScreen){document.cancelFullScreen();}
else if(document.mozCancelFullScreen){document.mozCancelFullScreen();}
else if(document.webkitCancelFullScreen){document.webkitCancelFullScreen();}}};
window.fix=function(ev){ev.stopPropagation();ev.preventDefault();};
/* --------------------------------------------------------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------- TEMPLATES --- */
T={
	treenode:`<div class="treenode" id="TX%KEY" ondragstart="event.stopPropagation();app.drag('X%KEY','%TITLE')" ondrop="fix(event);app.drop('X%KEY','%TITLE')" ondragover="fix(event);"><a
		href="#" onclick="app.toggleleaf('X%KEY',this.firstChild)"><i class="fa fa-plus-circle"></i></a>
		<a href="#" onclick="app.open('%KEY');">%TITLE</a><button class="color fr" href="#" onclick="app.dialog('%KEY')" style="background-color:%C2;border-color:%C1;">&nbsp;</button></div>`,
	treeleaf:`<div id="TCX%KEY" class="treeleaf">%CTC</div>`,
		reldialog:`<div class="dialog" id="%UID" draggable="true">%COLL1 - %NAME1<br/>%COLL2 - %NAME2<br/>
		%JDOC<br/><button><i class="fa fa-link"></i></button><button><i class="fa fa-unlink"></i></button><button>cancel</button></div>`,
	newdialog:`<dialog class="dialog newobject" id="newdialog" draggable="true" ondragstart="app.dialog_drag_start(event)" ondrop="app.dialog_drop(event)" ondragover="app.dialog_drag_over(event);">
		<span style="display:none"><input type="text" id="othercollname" placeholder="collection"/><br/></span><select
		id="collname" onchange="if(this.options[this.selectedIndex].value=='other'){this.previousSibling.style.display=''}else{this.previousSibling.style.display='none'}"><option value="other">other</option>
		</select><button class="fr" onclick="this.parentElement.close()"><i class="fa fa-times"></i></button><button class="fr" onclick="app.newobject();this.parentElement.close();"><i class="fa fa-check"></i></button></dialog>`,
	seldialog:`<dialog class="dialog selobject" id="seldialog" draggable="true" ondragstart="app.dialog_drag_start(event)" ondrop="app.dialog_drop(event)" ondragover="app.dialog_drag_over(event);">
	 <button onclick="this.parentElement.close()" tittle="ok / close"><i class="fa fa-check-square"></i></button></dialog>`,
	newtagdialog:`<dialog class="dialog newtag" id="newtagdialog" draggable="true" ondragstart="app.dialog_drag_start(event)" ondrop="app.dialog_drop(event)" ondragover="app.dialog_drag_over(event);">
		<input type="text" id="newtagname" placeholder="name"/>
		<input type="color" id="newtagc1" /><input type="color" id="newtagc2" value="#00FF00" />
		<button onclick="app.newtag();this.parentElement.close()"><i class="fa fa-check"></i></button><button onclick="this.parentElement.close()"><i class="fa fa-times"></i></button>
		</dialog>`,
		selcheck:`<input type="checkbox" class="selcheck" checked="checked" value="%KEY" style="zoom:2" /> %KEY`,
	tagdialog:`<dialog class="dialog tagdialog" id="DLG%KEY" draggable="true" ondragstart="app.dialog_drag_start(event)" ondrop="app.dialog_drop(event)" ondragover="app.dialog_drag_over(event);">
		<input type="text" id="savetagname" placeholder="name" value="%TITLE"/><input type="hidden" id="savetagparent" value="%PARENT"/>
		<input type="color" id="savetagc1" value="%C1" /><input type="color" id="savetagc2" value="%C2" />
		<button onclick="app.savetag('%KEY');this.parentElement.close()"><i class="fa fa-floppy-o"></i></button><button onclick="if(confirm('Eliminare davvero %TITLE?')){f$.db.del('%KEY');this.parentElement.close()}"><i class="fa fa-trash-o"></i>
		</button><button onclick="this.parentElement.close()"><i class="fa fa-times"></i></button>
		</dialog>`,
		selcheck:`<input type="checkbox" class="selcheck" checked="checked" value="%KEY" style="zoom:2" /> %KEY`,
};
/* --------------------------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------------- APP CODE --- */
window.app={loggedin:false,dbCollections:[],
	init:function(){var _this=this;f$.initAuth();firebase.auth().onAuthStateChanged(function(user){gid('prelogindiv').style.display='none';
		if(user){_this.loggedinit(user);gid('metaschema-app').style.display='';gid('logindiv').style.display='none';}
		else{gid('metaschema-app').style.display='none';gid('logindiv').style.display='';console.log('log off');}});
		gid('hiddentarget').innerHTML+=T.newdialog+T.seldialog+T.newtagdialog;
		},
	login:function(provider){f$.login(provider);},logout:function(provider){f$.logout();},
	loggedinit:function(user){
	 var uname=user.email;if(user.displayName){uname=user.displayName;}
		document.getElementById('username').innerHTML=' '+uname;
		this.scandb();
					//if user is not agreed make him agree to terms
					//ELSE
		firebase.database().ref('/tag/root').set({"doctitle":"root",c1:'#000000',c2:'#00ff00'});
		this.refreshtree();
					//if not hidewelcomedialog show welcome dialog / assistent
	},
	scandb:function(){this.dbCollections=[];firebase.database().ref('/').on('child_added',app._scandb);},
	_scandb:function(d){var k=d.key;if(!(k.indexOf(f$.oxyprefix)==0)){app.dbCollections[app.dbCollections.length]=d.key;if(d.key!='tag'){
			var o=document.createElement('option');o.value=d.key;o.innerHTML=d.key;var nsel=gid('collname');nsel.insertBefore(o,nsel.firstChild);nsel.selectedIndex=0;
			var o=document.createElement('span');o.innerHTML=T.selcheck.replace(/%KEY/g,d.key);var sel=gid('seldialog');sel.insertBefore(o,sel.firstChild);}}},
/* --------------------------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------------- TAG TREE --- */
	toggletree:function(button){document.body.classList.toggle('noleft');button.classList.toggle('pushed');
		button.childNodes[0].classList.toggle('fa-dedent');button.childNodes[0].classList.toggle('fa-indent');},
	refreshtree:function(){gid('tag-tree').innerHTML='';firebase.database().ref('/tag').off('child_added');
	 firebase.database().ref('/tag').off('child_changed');
		var r=firebase.database().ref('/tag').orderByChild("parent").startAt('root').endAt('root');
		r.on('child_added',app._refreshtree);r.on('child_changed',app._refreshtree);},
 _refreshtree:function(snap){var v=snap.val();v.$key='tag-'+snap.key;var prev=gid('TX'+v.$key);if(prev){prev.parentElement.removeChild(prev);}
		gid('tag-tree').innerHTML+=T.treenode.replace(/%KEY/g,v.$key).replace(/%TITLE/g,v.doctitle).replace(/%C2/g,v.c2).replace(/%C1/g,v.c1);},
	toggleleaf:function($key,button){var k=$key.replace('Xtag-','');var flag=true;if(button){button.classList.toggle('fa-plus-circle');button.classList.toggle('fa-minus-circle');}
		var leaf=gid('TC'+$key);if(!leaf){gid('T'+$key).innerHTML+=T.treeleaf.replace(/%KEY/g,$key.substr(1)).replace(/%CTC/g,'')}
		else{if(leaf.style.display!='none'){leaf.style.display='none';flag=false;}else{leaf.style.display='';flag=false}}
		var tmpfn=function(snap){app._toggleleaf(snap,$key)};
		if(flag){var r=firebase.database().ref('/tag').orderByChild("parent").startAt(k).endAt(k);r.on('child_added',tmpfn);r.on('child_changed',tmpfn);}},
	_toggleleaf:function(snap,$key){var v=snap.val();v.$key='tag-'+snap.key;var prev=gid('TX'+v.$key);if(prev){prev.parentElement.removeChild(prev);}
		console.log('TC'+$key);gid('TC'+$key).innerHTML+=T.treenode.replace(/%KEY/g,v.$key).replace(/%TITLE/g,v.doctitle).replace(/%C2/g,v.c2).replace(/%C1/g,v.c1);},
	tag_to_root(){app._draggingobj.c=app._draggingobj.k.substr(0,app._draggingobj.k.indexOf('-'));
		if(app._draggingobj.c=='Xtag'){var x=gid('T'+app._draggingobj.k);
		if(x.parentElement!=gid('tag-tree')){x.parentElement.removeChild(x);
		firebase.database().ref('/tag/'+app._draggingobj.k.replace('Xtag-','')).update({parent:'root'});}}},
	/* --------------------------------------------------------------------------------------------------------------------- */
	/* ----------------------------------------------------------------------------------------------- general drag and drop */
	_draggingobj:{},allowdrop:function(ev){ev.preventDefault();},drag:function(k,n){app._draggingobj={'k':k,'n':n}},
	drop:function(k,n){var droppedon={'k':k,'n':n};if((app._draggingobj.k==droppedon.k)){return false}else{return app.dropped(app._draggingobj,droppedon)}},
	dropped:function(dragobj,dropobj){
		dropobj.c=dropobj.k.substr(0,dropobj.k.indexOf('-'));dragobj.c=dragobj.k.substr(0,dragobj.k.indexOf('-'));if(dragobj.c=='Xtag'&&dropobj.c=='Xtag'){
			if(!gid('T'+dropobj.k).firstChild.firstChild.classList.contains('fa-minus-circle')){app.toggleleaf(dropobj.k,gid('T'+dropobj.k).firstChild.firstChild);}
			firebase.database().ref('/tag/'+dragobj.k.replace('Xtag-','')).update({parent:dropobj.k.replace('Xtag-','')});
		}else{
			var s=T.reldialog.replace(/%UID/g,uid());
			s=s.replace(/%COLL1/g,dragobj.c).replace(/%TITLE1/g,dragobj.n);
			s=s.replace(/%COLL2/g,dragobj.c).replace(/%TITLE2/g,dragobj.n);
			var d=document.createElement('div');d.innerHTML=s;gid('mainwrap').appendChild(d);}},
	/* -------------------------------------------------------------------------------------------------------------------- */
	/* ------------------------------------------------------------------------------------------------------------ top bar */
	gototab:function(tab,button){var tabs=document.getElementsByClassName('tabs-b');for(var t=0;t<tabs.length;t++){tabs[t].classList.remove('pushed');}button.classList.add('pushed');gid(tab).classList.add(tab);
	if(!tab=='homeview'){gid('mainwrap').classList.remove('homeview');}if(!tab=='resultsview'){gid('mainwrap').classList.remove('resultsview');}if(!tab=='detailsview'){gid('mainwrap').classList.remove('detailsview');}},
 /* -------------------------------------------------------------------------------------------------------------------- */
	/* ----------------------------------------------------------------------------------------------------------- DB CALLS */
 search:function(exp,_collection){this._records_reset();f$.db.find(exp,app._on_records_results,_collection);},
	_search:function(d){var s='<input onclick="app.open(\''+d.$key+'\');" type="button" value="'+d.doctitle+' ['+d.$key+']" />';gid('resultsview').innerHTML+=s;},
	open:function($key){f$.db.getone($key,app._open);},
	_open:function(d){app.nonewUI(d.$key);gid('details').value=JSON.stringify(d);},
	save:function(doc){if(!doc.$key){alert('$key property must be present in the document');}f$.db.set(J)},
	newtag:function(){var a=gid('newtagname');var o={doctitle:a.value,parent:'root',c1:gid('newtagc1').value,c2:gid('newtagc2').value};a.value='';f$.db.add('tag',o);},
	savetag:function($key){var ee=gid('DLG'+$key).getElementsByTagName('input');console.log(ee);
		var o={doctitle:ee[0].value,parent:ee[1].value,c1:ee[2].value,c2:ee[3].value,$key:$key};console.log($key);
		f$.db.set(o);},
	newobject:function(){var cs=gid('collname');if(cs.selectedIndex>-1){var s=cs.options[cs.selectedIndex].value;if(s=='other'){s=gid('othercollname').value}
	s=s.trim();if(s==''){s='generic'}console.log(s);f$.db.add(s,{doctitle:'untitled document',parent:'root'});}else{console.log('No object type selected')}},
	
	/*seelog_clicked:function(){
	 gid('subcollections').innerHTML='';					
	var k=gid('dockey').value;},
	seever_clicked:function(){
	gid('subcollections').innerHTML='';
	var k=gid('dockey').value;},*/
/* -------------------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------- dialogs --- */
  dialog:function(key){f$.db.getone(key,function(d){var dlg=gid('DLG'+d.$key);if(dlg){dlg.parentElement.removeChild(dlg)}
			gid('hiddentarget').innerHTML+=T.tagdialog.replace(/%KEY/g,d.$key).replace(/%TITLE/g,d.doctitle).replace(/%C1/g,d.c1).replace(/%C2/g,d.c2).replace(/%PARENT/g,d.parent);setTimeout('gid("DLG'+d.$key+'").show()',50)})},
		dialog_drag_start:function(event){var style = window.getComputedStyle(event.target, null);
    var str = (parseInt(style.getPropertyValue("left")) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top")) - event.clientY)+ ',' + event.target.id;
    event.dataTransfer.setData("Text",str);},
		dialog_drop:function(event){var offset = event.dataTransfer.getData("Text").split(',');var dm=document.getElementById(offset[2]);
    dm.style.left=(event.clientX+parseInt(offset[0],10))+'px';dm.style.top =(event.clientY+parseInt(offset[1],10))+'px';
    event.preventDefault();document.body.removeAttribute('ondrop');document.body.removeAttribute('ondragover');return false;},
  dialog_drag_over:function(event){event.preventDefault();document.body.setAttribute('ondrop','app.dialog_drop(event)');document.body.setAttribute('ondragover','event.preventDefault()');return false;},
/* -------------------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------- results --- */
	_curr_cols:{"$key":{idx:0},"doctitle":{idx:1},"collection":{idx:2},"parent":{idx:3},"tags":{idx:4},"rels":{idx:5}},_curr_cols_count:6,
	_records_reset:function(){this._curr_cols={"$key":{idx:0},"doctitle":{idx:1},"collection":{idx:2},"parent":{idx:3},"tags":{idx:4},"rels":{idx:5}};this._curr_cols_count=6;
	/* gid('resultsview').innerHTML='<div id="resultswrap"><table id="resultstable"><tbody><th>key</th><th>doctitle</th><th>collection</th><th>parent</th><th>tags</th><th>rels</th></tbody><tbody></tbody></table></div>'},*/
	 gid('resultsview').innerHTML='<table id="resultstable"><tbody><th>key</th><th>doctitle</th><th>collection</th><th>parent</th><th>tags</th><th>rels</th></tbody><tbody></tbody></table>'},
 _record_odd:false,
	_on_records_results:function(d){var x;var outs={};var out='';
		for(x in d){if(!app._curr_cols[x]){app._curr_cols[x]={idx:app._curr_cols_count};app._curr_cols_count++;outs[app._curr_cols[x].idx]=d[x];
			var th=document.createElement('th');th.innerHTML=x;
			gid(gid('resultstable').tBodies[0].rows[0].appendChild(th));
		}}
		var tr=document.createElement('tr');if(app._record_odd){tr.className='odd';app._record_odd=false}else{app._record_odd=true}
		tr=gid('resultstable').tBodies[1].insertRow(tr);var td;
		for(var o in app._curr_cols){td=document.createElement('td');if(!d[o]){td.innerHTML=''}else{
			var to=typeof d[o];
			if(d[o].join){
				td.innerHTML=d[o].join(', ')
			}else{td.innerHTML=d[o]}
			}tr.appendChild(td);
		}
	},
};    