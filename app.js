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
	<a href="#" onclick="app.open('%KEY');">%TITLE</a><button class="color fr" href="#" onclick="" style="background-color:#ffffff;"> </button></div>`,
	treeleaf:`<div id="TCX%KEY" class="treeleaf">%CTC</div>`,
	reldialog:`<div class="dialog" id="%UID" draggable="true">%COLL1 - %NAME1<br/>%COLL2 - %NAME2<br/>
	%JDOC<br/><button><i class="fa fa-link"></i></button><button><i class="fa fa-unlink"></i></button><button>cancel</button></div>`,
	newdialog:`<dialog class="dialog newobject" id="newdialog" draggable="true" ondragstart="app.dialog_drag_start(event)" ondrop="app.dialog_drop(event)" ondragover="app.dialog_drag_over(event);">
	<select id="collname" onchange="if(this.options[this.selectedIndex].value=='other'){this.nextSibling.style.display=''}else{this.nextSibling.style.display='none'}"><option value="other">other</option></select><span><br/>
	<input type="text" id="othercollname" placeholder="new object collection" style="width:100px;"/></span><button><i class="fa fa-bolt"></i></button><button onclick="this.parentElement.close()"><i class="fa fa-times"></i></button></dialog>`,
	seldialog:`<dialog class="dialog selobject" id="seldialog" draggable="true" ondragstart="app.dialog_drag_start(event)" ondrop="app.dialog_drop(event)" ondragover="app.dialog_drag_over(event);">
	<select id="collname"><option value="other">other</option></select><span><br/>
	<input type="text" id="othercollname" placeholder="new object collection" style="width:100px;"/></span><button><i class="fa fa-bolt"></i></button><button onclick="this.parentElement.close()"><i class="fa fa-times"></i></button></dialog>`,
};
/* --------------------------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------------- APP CODE --- */
window.app={loggedin:false,dbCollections:[],
	init:function(){var _this=this;f$.initAuth();firebase.auth().onAuthStateChanged(function(user){gid('prelogindiv').style.display='none';
		if(user){_this.loggedinit(user);gid('metaschema-app').style.display='';gid('logindiv').style.display='none';}
		else{gid('metaschema-app').style.display='none';gid('logindiv').style.display='';console.log('log off');}});
		var s=T.newdialog;gid('hiddentarget').innerHTML+=s;
		},
	login:function(provider){f$.login(provider);},logout:function(provider){f$.logout();},
	loggedinit:function(user){console.log('ok');
		var uname=user.email;
		if(user.displayName){uname=user.displayName;}
		document.getElementById('username').innerHTML=' '+uname;
		this.scandb();
					//if user is not agreed make him agree to terms
					//ELSE
		firebase.database().ref('/tag/root').set({"doctitle":"root"});
		this.refreshtree();
					//if not hidewelcomedialog show welcome dialog / assistent
	},
	scandb:function(){this.dbCollections=[];firebase.database().ref('/').on('child_added',app._scandb);},
	_scandb:function(d){var k=d.key;if(!(k.indexOf(f$.oxyprefix)==0)){
		app.dbCollections[app.dbCollections.length]=d.key;
		var o=document.createElement('option');o.value=d.key;o.innerHTML=d.key;
		var sel=gid('collname');sel.insertBefore(o,sel.firstChild);sel.selectedIndex=0;
	}},
/* --------------------------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------------- TAG TREE --- */
	toggletree:function(button){document.body.classList.toggle('noleft');button.classList.toggle('pushed');
		button.childNodes[0].classList.toggle('fa-dedent');button.childNodes[0].classList.toggle('fa-indent');},
	refreshtree:function(){gid('tag-tree').innerHTML='';firebase.database().ref('/tag').off('child_added');
		firebase.database().ref('/tag').orderByChild("parent").startAt('root').endAt('root').on('child_added',function(snap){
		var v=snap.val();v.$key='tag-'+snap.key;					gid('tag-tree').innerHTML+=T.treenode.replace(/%KEY/g,v.$key).replace(/%TITLE/g,v.doctitle);});},
	toggleleaf:function($key,button){var k=$key.replace('Xtag-','');var flag=true;if(button){button.classList.toggle('fa-plus-circle');button.classList.toggle('fa-minus-circle');}
		var leaf=gid('T'+$key).getElementsByTagName('div');if(leaf.length<1){gid('T'+$key).innerHTML+=T.treeleaf.replace(/%KEY/g,$key.substr(1)).replace(/%CTC/g,'')}
		else{leaf=leaf[0];if(leaf.style.display!='none'){leaf.style.display='none';flag=false;}else{leaf.style.display='';gid('TC'+$key).innerHTML='';}}
		if(flag){firebase.database().ref('/tag').orderByChild("parent").startAt(k).endAt(k).on('child_added',function(snap){
		var v=snap.val();v.$key='tag-'+snap.key;var prev=gid('TX'+v.$key);if(prev){prev.parentElement.removeChild(prev);}
		gid('TC'+$key).innerHTML+=T.treenode.replace(/%KEY/g,v.$key).replace(/%TITLE/g,v.doctitle);});}},
	add_tag:function(){var n=prompt('insert name of new tag');if(n){f$.db.add('tag',{parent:"root",doctitle:n});}},
	tag_to_root(){app._draggingobj.c=app._draggingobj.k.substr(0,app._draggingobj.k.indexOf('-'));
		if(app._draggingobj.c=='Xtag'){var x=gid('T'+app._draggingobj.k);
		if(x.parentElement!=gid('tag-tree')){x.parentElement.removeChild(x);
		firebase.database().ref('/tag/'+app._draggingobj.k.replace('Xtag-','')).set({doctitle:app._draggingobj.n,parent:'root'});}}
	},
	/*---------------------------------------------------------------------------------------------------------- DRAG AND DROP*/
	_draggingobj:{},allowdrop:function(ev){ev.preventDefault();},
	drag:function(k,n){app._draggingobj={'k':k,'n':n}},
	drop:function(k,n){var droppedon={'k':k,'n':n};if((app._draggingobj.k==droppedon.k)){return false}else{return app.dropped(app._draggingobj,droppedon)}},
	dropped:function(dragobj,dropobj){console.log(dragobj.k+'->'+dropobj.k);
		dropobj.c=dropobj.k.substr(0,dropobj.k.indexOf('-'));dragobj.c=dragobj.k.substr(0,dragobj.k.indexOf('-'));if(dragobj.c=='Xtag'&&dropobj.c=='Xtag'){
			if(!gid('T'+dropobj.k).firstChild.firstChild.classList.contains('fa-minus-circle')){app.toggleleaf(dropobj.k,gid('T'+dropobj.k).firstChild.firstChild);}
			firebase.database().ref('/tag/'+dragobj.k.replace('Xtag-','')).set({doctitle:dragobj.n,parent:dropobj.k.replace('Xtag-','')});
		}else{
			var s=T.reldialog.replace(/%UID/g,uid());
			s=s.replace(/%COLL1/g,dragobj.c).replace(/%TITLE1/g,dragobj.n);
			s=s.replace(/%COLL2/g,dragobj.c).replace(/%TITLE2/g,dragobj.n);
			var d=document.createElement('div');d.innerHTML=s;gid('mainwrap').appendChild(d);
		}},
	/* --------------------------------------------------------------------------------------------------------------------------- */
	/*-------------------------------------------------------------------------------------------------------------------- TOP BAR */
	gototab:function(tab,button){var tabs=document.getElementsByClassName('tabs-b');for(var t=0;t<tabs.length;t++){tabs[t].classList.remove('pushed');}button.classList.add('pushed');gid(tab).classList.add(tab);
	if(!tab=='homeview'){gid('mainwrap').classList.remove('homeview');}if(!tab=='resultsview'){gid('mainwrap').classList.remove('resultsview');}if(!tab=='detailsview'){gid('mainwrap').classList.remove('detailsview');}},
	newobj:function(){gid('newdialog').showModal()},
	search:function(exp,_collection){gid('resultsview').innerHTML='';f$.db.find(exp,app._search,_collection);},
	_search:function(d){var s='<input onclick="app.open(\''+d.$key+'\');" type="button" value="'+d.doctitle+' ['+d.$key+']" />';gid('resultsview').innerHTML+=s;},
	

	open:function($key){f$.db.getone($key,app._open);},
			 _open:function(d){app.nonewUI(d.$key);gid('details').value=JSON.stringify(d);},
								seelog_clicked:function(){
				 gid('subcollections').innerHTML='';					
					var k=gid('dockey').value;},
				seever_clicked:function(){
					gid('subcollections').innerHTML='';
					var k=gid('dockey').value;},			
				save_clicked:function(){
					var e=gid('dockey');
					var J=JSON.parse(gid('details').value);
					if(e.value=='new doc'){app.nonewUI(f$.db.add(gid('collection').value,J));}
					else{if(!J.$key){alert('$key property must be present in the document');}else{f$.db.set(J)}}},
/* -------------------------------------------------------------------------------------------------------------------- */
		dialog_drag_start:function(event) 
    {
    var style = window.getComputedStyle(event.target, null);
    var str = (parseInt(style.getPropertyValue("left")) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top")) - event.clientY)+ ',' + event.target.id;
    event.dataTransfer.setData("Text",str);
    },

		dialog_drop:function(event) 
    {
    var offset = event.dataTransfer.getData("Text").split(',');
    var dm = document.getElementById(offset[2]);
    dm.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
    dm.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';
    event.preventDefault();
    return false;
    },

  dialog_drag_over:function(event)
    {
    event.preventDefault();
    return false;
    }   
};
    
}