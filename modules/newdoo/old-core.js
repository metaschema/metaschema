/*CONTEXT*/
m$.env='debug';

/*REALKERNEL*/
m$.types={['boolean','char','byte','sbyte','int8','uint8','int32','uint32','int64','uint64','float','date','time','datetime','string','blob','rel11','rel1M','relM1','relMM','json']};
m$.model=function(name,fields){this.name=name;this.fields=fields;this.init();};m$.model.prototype={
	init:function(){
		this.fields[this.fields.length]={name:'created',type:'datetime'};
		this.fields[this.fields.length]={name:'modified',type:'datetime'};
		this.fields[this.fields.length]={name:'created_by',type:'rel1M'};
		this.fields[this.fields.length]={name:'modified_by',type:'rel1M'};
		this.fields[this.fields.length]={name:'owned_by',type:'rel1M'};
	},
};

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

/*CORE-WIDGETS*/
m$.widget={
	'boolean':'<input type="checkbox" value="%v"/>','char','byte','sbyte','int8','uint8','int32','uint32','int64','uint64','float','date','time','datetime','string','blob','rel11','rel1M','relM1','relMM','json'
	address={
		
	},
	contacts={
		
	}

};


/*CORE-APP*/
m$.load=function(){
	//check environment
	if(this.env=='debug'){
		
	}else if(this.env=='test'){
		
	}else{
		
	}
};
m$.loadmodule=function(){
	//check environment
	if(this.env=='debug'){
		
	}else if(this.env=='test'){
		
	}else{
		
	}
};

/*
ERROR CODES

Validation
9-
*/


