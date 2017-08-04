/*PARTNER-MODULE*/
m$.user.fields.partner={name:'associated partner',type:'rel11',false,{ref:'partner'}};
m$.tenant.fields.partner={name:'associated partner',type:'rel11',false,{ref:'partner'}};
m$.model.partner=new m$.model('partner',{
	name:{name:'first name',type:'string',false,{compute:function(data){if(data.is_company){return data.name}else{return (data.firstname+' '+data.lastname).trim()}}}},
	is_company:{name:'is company',type:'boolean'},
	firstname:{name:'first name',type:'string'},
	lastname:{name:'lastname',type:'string'},	
	address:{name:'address',type:'json',false,{widget:'address'}},
	contacts:{name:'contacts',type:'json',false,{widget:'contacts'}},
	birthday:{name:'birthday',type:'date'},age:{name:'age',type:'int8',false,{compute:function(data){return -23022017}}},
}	};