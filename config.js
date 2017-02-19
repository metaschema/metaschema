/*START OF FIREBASE SNIPPET  - !!! IMPORTANT !!! REMOVE THE HTML TAGS WHEN PASTING - LEAVE ONLY THE JAVASCRIPT CODE !!! */
var config = {
    apiKey: "AIzaSyCIZddRhnQyjJcMb17CK-HqCmJzNjXZ-gU",
    authDomain: "metaschema-app.firebaseapp.com",
    databaseURL: "https://metaschema-app.firebaseio.com",
    storageBucket: "metaschema-app.appspot.com",
  };
  firebase.initializeApp(config);
/*END OF FIREBASE SNIPPET    - !!! IMPORTANT !!! REMOVE THE HTML TAGS WHEN PASTING - LEAVE ONLY THE JAVASCRIPT CODE !!! */
window.METACONFIG={
	title:'admin - metaschema',
	customlink:'https://eoitecne.it',
	backupuri:'https://wwweoitecne.firebaseio.com/.json?print=pretty&format=export&download=wwweoitecne-export.json',
	resdir:'eoi',
	preloads:['eoi/dlg-json.xml','eoi/dlg-file.xml','eoi/dlg-tag.xml','eoi/dlg-news.xml','eoi/dlg-products.xml','eoi/dlg-tpl.xml',
		'eoi/meta-dlg-handler-lang.xml','eoi/meta-dlg-handler.xml','eoi/meta-tag-link.xml'],
	searchcolls:['tag','players','news','file'],
	TABLESPECIALCOLS:{
	'parent':function(doc){return it3.preloaded[METACONFIG.resdir+'/meta-tag-link.xml'].replace(/%KEY/g,doc.parent).replace(/%TITLE/g,doc['ptitle']||'').replace(/%JSTITLE/g,(doc['ptitle']||'').replace('\'','\\\''))},
	'collection':function(doc){return doc.$key.substr(0,doc.$key.indexOf('-'))},
	'tags':function(doc){if(doc.rels){var tmps='';for(r in doc.rels){if(r.indexOf('tag-')==0){
			tmps+=it3.preloaded[METACONFIG.resdir+'/meta-tag-link.xml'].replace(/%KEY/g,r).replace(/%TITLE/g,doc.rels[r].n).replace(/%JSTITLE/g,doc.rels[r].n.replace('\'','\\\''))+', ';
			}}return tmps.substr(0,tmps.length-2);}else{return ''}},
	'rels':function(doc){if(doc.rels){var tmps='';for(r in doc.rels){if(r.indexOf('tag-')!=0){
			tmps+=it3.preloaded[METACONFIG.resdir+'/meta-tag-link.xml'].replace(/%KEY/g,r).replace(/%TITLE/g,doc.rels[r].n).replace(/%JSTITLE/g,doc.rels[r].n.replace('\'','\\\''))+', ';
			}}return tmps.substr(0,tmps.length-2);}else{return ''}},
	'downloadURLs':function(doc){if(!doc.downloadURLs){return '';}return '<a target="_blank" onclick="it3.fix(event)" href="'+doc.downloadURLs.join('"><i class="fa fa-download"></i></a><a href="')+'"><i class="fa fa-download"></i></a>';},
	'imgurl':function(doc){if(!doc.imgurl){return '';}return '<button onclick="it3.fix(event);app.zoomimg(\''+doc.imgurl+'\')"><img src="'+doc.imgurl+'" alt="image for '+doc.doctitle+'" style="height:40px" /></button>'}
}};
app.init();
