/*CONTEXT*/
m$.env='debug';
/*REALKERNEL*/


/*INNERMETHODS METHODS*/
m$.now=function(){};
m$.random=function(){};
m$.validate=function(data,model){};
m$.computefields=function(data,model){};
m$.render=function(data,_view){};
/*COREMODULE*/
m$.tenant=new m$.model('tenant',{
	administrator:{name:'associated partner',type:'rel11',false,{ref:'user'}},
}	);
m$.user=new m$.model('user',{
	tenant:{name:'tenant',type:'rel11'},
	stars:{name:'favourites',type:'relMM'},
}	);
m$.module=new m$.model('module',{
	tenant:{name:'tenant',type:'rel11'},
	
});


/* ------------------------------------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------------------- NEWDOO CORE UI */
m$.widget={
	'boolean':'<input type="checkbox" value="%v"/>','char','byte','sbyte','int8','uint8','int32','uint32','int64','uint64','float','date','time','datetime','string','blob','rel11','rel1M','relM1','relMM','json'
	address={
		
	},
	contacts={
		
	}

};

/*
ERROR CODES

Validation
9-
*/


