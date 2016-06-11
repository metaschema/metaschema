window.gid=function(id){return document.getElementById(id);}
window.app={loggedin:false,dbCollections:[],
	init:function(){var _this=this;f$.initAuth();
		firebase.auth().onAuthStateChanged(function(user){gid('prelogindiv').style.display='none';
			if(user){_this.loggedinit(user);gid('metaschema-app').style.display='';gid('logindiv').style.display='none';}
			else{gid('metaschema-app').style.display='none';gid('logindiv').style.display='';console.log('log off');}
	});},
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
		_scandb:function(d){var k=d.key;if(!(k.indexOf(f$.oxyprefix)==0)){app.dbCollections[app.dbCollections.length]=d.key;}},
		toggletree:function(button){
			document.body.classList.toggle('noleft');
			button.classList.toggle('pushed');
			button.childNodes[0].classList.toggle('fa-dedent');
			button.childNodes[0].classList.toggle('fa-indent');
		},
		refreshtree:function(){gid('tag-tree').innerHTML='';
			firebase.database().ref('/tag').orderByChild("parent").startAt('root').endAt('root').on('child_added',function(snap){var v=snap.val();v.$key='tag-'+snap.key;
					var s='<div class="treenode" id="T'+v.$key
					s+='"><a href="#" onclick="app.leaftoggle(\''+v.$key+'\',this.firstChild)"><i class="fa fa-plus-circle"></i></a> ';
					s+='<a href="#" onclick="app.open(\''+v.$key+'\');">'+v.doctitle+'</a>';
					s+='<a class="color" href="#" onclick="" style="background-color:#ffffff;"> </a></div>';
					gid('tag-tree').innerHTML+=s;
		});},
		leaftoggle:function($key,button){var k=$key.replace('tag-','');var flag=true;button.classList.toggle('fa-plus-circle');button.classList.toggle('fa-minus-circle');
			var leaf=gid('T'+$key).getElementsByTagName('div');
			if(leaf.length<1){gid('T'+$key).innerHTML+='<div id="TC'+$key+'" class="treeleaf"> </div>'}
			else{leaf=leaf[0];if(leaf.style.display!='none'){leaf.style.display='none';flag=false;}else{leaf.style.display='';gid('TC'+$key).innerHTML='';}}
			if(flag){
			firebase.database().ref('/tag').orderByChild("parent").startAt(k).endAt(k).on('child_added',function(snap){var v=snap.val();v.$key='tag-'+snap.key;
					var s='<div class="treenode" id="T'+v.$key
					s+='"><a href="#" onclick="app.leaftoggle(\''+v.$key+'\',this.firstChild)"><i class="fa fa-plus-circle"></i></a> ';
					s+='<a href="#" onclick="app.open(\''+v.$key+'\')">'+v.doctitle+'</a>';
					s+='<a class="color" href="#" onclick="" style="background-color:#ffffff;"> </a></div>';
					gid('TC'+$key).innerHTML+=s;
		});}},
		add_tag:function(){
			var n=prompt('insert name of new tag');
			if(n){
				f$.db.add('tag',{parent:"root",doctitle:n});
		}},
			 search:function(exp,_collection){gid('results').innerHTML='';f$.db.find(exp,app._search,_collection);},
			 _search:function(d){var s='<input onclick="app.open(\''+d.$key+'\');" type="button" value="'+d.title+' ['+d.$key+']" />';gid('results').innerHTML+=s;},
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
		gotohome:function(button){
			gid('mainwrap').classList.toggle('homeview');
			button.classList.toggle('fa-home');
			button.classList.toggle('fa-bars');
		}
			};