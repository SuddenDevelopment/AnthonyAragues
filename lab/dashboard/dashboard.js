/*
layout: col or row
states: { state:{label:'',style:'',icon:''} }
rules->actions: { change state, change flex,  }
	rule comparsison apply to the data collection, children or parent
	rule actions apply to existing conatiner, children or parent
types: ['boolean','string','number','object','array','collection']
details: ['state','stat', data ]
flex: 0-100

* for now, assume component area is wider than tall, by ~ 3:2 ratio
* rules are executed outside of the display component, rules change the properties to re-display
* layout is determined by hierarchy / structure

* click to focus
* show latest event
* snapshots over time
* hideable boolean property
* responsible for kids boolean property

{
	 label:''
	,state:
	,type:''
	,states:{  { label. detail, style}  }
	,kids:[]
	,data:[]
}



*/
var Dashboard = function(objConfig){
	'use strict';
	this.objDashboard={};
	this.objConfig=objConfig;
	this.last_updated=0;
	var self=this;
	this.init=function(fnCallback){
		self.objConfig = self.fnCleanConfig(self.objConfig);
		self.objDashboard = self.fnCreateLayout(self.objConfig);
		//run callback if defined... 
		if(typeof fnCallback === 'function'){ fnCallback(); }
	}
	this.fnCleanConfig=function(objConfig,fnCallback){
		if(typeof objConfig.limit === 'undefined'){ objConfig.limit=25; }
		if(typeof objConfig.detail === 'undefined'){ objConfig.detail=''; }
		if(typeof objConfig.state === 'undefined' || objConfig.state === null){ objConfig.state=0; }
		if(typeof objConfig.kids !== 'undefined' && objConfig.kids.length>0){
			for(var i=0; i<objConfig.kids.length; i++){
				if(typeof objConfig.kids[i].states === 'undefined'){ objConfig.kids[i].states=objConfig.states; }
				if(typeof objConfig.kids[i].limit === 'undefined'){ objConfig.kids[i].limit=objConfig.limit; }
				objConfig.kids[i]=self.fnCleanConfig(objConfig.kids[i]);
			}
		}else{ objConfig.kids=[]; }
		if(typeof fnCallback === 'function'){ console.log('callback');fnCallback(); }
		return objConfig;
	}
	this.fnCreateLayout=function(objConfig){
		self.last_updated=Date.now();
		//find the current item
		var objElement = document.getElementById(objConfig.id);
		//determine layout direction, this shoudl create an effect of alternating rows and columns
		if( typeof objConfig.layout === 'undefined'){
			if( objElement.clientWidth > objElement.clientHeight ){ objConfig.layout='dashboard-columns'; }
			if( objElement.clientWidth < objElement.clientHeight ){ objConfig.layout='dashboard-rows'; }
		}

		//set the classes of the container
		if(typeof objConfig.state !== 'undefined' && objConfig.state !== null){
			objElement.setAttribute('class','dashboard-container '+objConfig.states[objConfig.state].style);
		}else{
			//last updated is the only default info that will be set as a "detail"
			objElement.setAttribute('class','dashboard-container state-default');
			if(typeof objConfig.last_updated !== 'undefined'){ objConfig.detail= {"last_updated":objConfig.last_updated}; }
		}
		
		objElement.appendChild(self.fnLabel2Element(objConfig.label));

		//add details if they exist
		var objDetails = document.createElement('div');
		self.fnAddDetails(objConfig,objDetails);
		objElement.appendChild(objDetails);

		//add a subcontainer for kids
		var objKids = document.createElement('div');
		objKids.setAttribute('class','dashboard-kids '+objConfig.layout);
		objElement.appendChild(objKids);
		//add the kids
		for(var i=0; i<objConfig.kids.length; i++){
			// add ancestry
			//add element
			var objKid = document.createElement('div');
			objKid.setAttribute('id', objConfig.kids[i].id);
			objKids.appendChild(objKid);
			//if child is missing states, copy them.
			if(typeof objConfig.kids[i].states === 'undefined' || objConfig.kids[i].states.length === 0){ objConfig.kids[i].states=objConfig.states; }
			//if(objConfig.layout==='dashboard-rows'){objConfig.kids[i].layout='dashboard-columns';}else{objConfig.kids[i].layout='dashboard-rows';}
			//call self for the created kid node
			self.fnCreateLayout(objConfig.kids[i]);
		}
		return objElement;
	}
	this.fnUpdateElement = function(objConfig,fnCallback){
				var intNow = Date.now();		
		if(typeof objConfig.id !== 'undefined'){
			//console.log(objConfig.id,objConfig.state);
			var objElement=document.getElementById(objConfig.id);
			var objData=self.fnGetObjectById(objConfig.id,self.objConfig);
			objData.last_updated=intNow;
			//console.log(objElement,objData,objConfig);
			if(objElement !== null && typeof objData!=='undefined'){
				if(typeof objConfig.state !== 'undefined'){ objData.state=objConfig.state; }
				//console.log(objElement.clientWidth,objElement.clientHeight,objElement.querySelector('.dashboard-kids'));
				//if( objElement.clientWidth > objElement.clientHeight ){ var strLayoutClass='dashboard-columns'; }
				//else if(objElement.clientWidth > 0 && objElement.clientHeight > 0){ var strLayoutClass='dashboard-rows'; }
				//objElement.querySelector('.dashboard-kids').setAttribute('class','dashboard-kids '+strLayoutClass)
				if(typeof objData.state !== 'undefined'){ objElement.setAttribute('class','dashboard-container '+objData.states[objConfig.state].style); }
				if(typeof objConfig.detail !== 'undefined'){ this.fnAddDetails(objConfig); }
			}
			if(typeof fnCallback === 'function'){ fnCallback(); }
		}
	};
	this.fnScan=function(objConfig){
		if(typeof objConfig==='undefined'){ var objConfig = self.objConfig; }
		//sweep through
		//check  if it's time to degrade state
		var intNow = Date.now();
		var arrStates=[];
		//console.log(objConfig.time_updated,objConfig.states[objConfig.state].ttl,intNow);
		
		if(typeof objConfig.kids === 'object' && objConfig.kids.length > 0){
			var fUpdate=false;
			//think of the children!
			for(var i=0;i<objConfig.kids.length;i++){
				arrStates[i]=self.fnScan(objConfig.kids[i]);
				if(arrStates[i] > objConfig.state){ objConfig.state=arrStates[i]; fUpdate=true; }
			}
			if(fUpdate===true){ self.fnUpdateElement(objConfig); }
		}else if(objConfig.state > 0 && typeof objConfig.states[objConfig.state].ttl !== 'undefined' && objConfig.last_updated !== 'undefined' && objConfig.states[objConfig.state].ttl > 0 && objConfig.last_updated > 0 && objConfig.last_updated+objConfig.states[objConfig.state].ttl < intNow){
			//console.log('state time out');
			objConfig.state--;
			objConfig.last_updated=intNow;
			self.fnUpdateElement(objConfig);
		}
		return objConfig.state;
	};
	this.fnLabel2Element = function(strLabel){
		//add the label
		var objLabel=document.createElement('div');
		objLabel.setAttribute('class','dashboard-label');
		objLabel.innerHTML=strLabel;
		//expand button
		var objExpand=document.createElement('div');
		objExpand.setAttribute('class','dashboard-control-expand');
		objExpand.innerHTML='+';
		objExpand.addEventListener("click", function(event){ self.fnFocusLayout(event.target.parentElement.parentElement.id); });
		objLabel.prepend(objExpand);
		
		//close button
		var objClose=document.createElement('div');
		objClose.setAttribute('class','dashboard-control-close');
		objClose.innerHTML='x';
		objClose.addEventListener("click", function(event){ event.target.parentElement.parentElement.setAttribute('class','dashboard-hide') });
		objLabel.appendChild(objClose);
		//downgrade
		var objDegrade=document.createElement('div');
		objDegrade.setAttribute('class','dashboard-control-downgrade');
		objDegrade.innerHTML='v';
		objDegrade.addEventListener("click", function(event){ self.fnDegradeState(event.target.parentElement.parentElement.id); });
		objLabel.appendChild(objDegrade);
		return objLabel;
	};
	this.fnFocusLayout=function(strId){
		var objConfig=self.fnGetObjectById(strId,self.objConfig);
		self.fnCreateLayout(objConfig);
	};
	this.fnDegradeState=function(strId,intState){
		var objConfig=self.fnGetObjectById(strId,self.objConfig);
		if(objConfig.state > 0 && typeof intState === 'undefined'){
			objConfig.state--;
			objConfig.last_updated=Date.now();
			self.fnUpdateElement(objConfig);
		}else if(typeof intState !== 'undefined' && objConfig.state > intState){
			objConfig.state=intState;
			objConfig.last_updated=Date.now();
			self.fnUpdateElement(objConfig);
		}
		//look through children, degrade them too
		if(typeof objConfig.kids !== 'undefined' && objConfig.kids.length > 0){
			if(typeof intState === 'undefined'){ intState=objConfig.state; }
			for(var i=0;i<objConfig.kids.length;i++){
				self.fnDegradeState(objConfig.kids[i].id,intState);
			}
		}
	};
	this.fnAddDetails = function(objConfig,objDetails){
		//console.log(objConfig.limit);
		if(typeof objDetails === 'undefined'){ var objDetails=document.querySelector('#'+objConfig.id+' .dashboard-detail'); }
		//build or modiy detail for the given object
		objDetails.setAttribute('class','dashboard-detail');
		if(typeof objConfig.detail === 'object'){ 
			if(objConfig.detail.constructor !== Array){objConfig.detail=[objConfig.detail];}
			var arrPastDetails = objDetails.querySelectorAll('pre');
			//console.log('remove old',arrPastDetails.length,self.objConfig.limit);
			for(var i=0;i<objConfig.detail.length;i++){
				var objDetail=document.createElement('pre');
				objDetail.innerHTML=self.fnSyntaxHighlight(objConfig.detail[i]);
				objDetails.prepend(objDetail);
				//trim oldest if needed				
				if(arrPastDetails.length+i>self.objConfig.limit){ 
					objDetails.removeChild(arrPastDetails[arrPastDetails.length-1]); 
				}
			}
		}
		else if(typeof objConfig.detail !=='undefined' && objConfig.detail !== ''){ objDetails.innerHTML=objConfig.detail; }
	};
	this.fnSyntaxHighlight = function(json){
		//console.log(json);
	    json=JSON.stringify(json);
	    //replace any html tags found so they don't interfere with rendering
	    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (strMatch) {
	        var strClass = 'number';
	        if (/^"/.test(strMatch)){
	            if (/:$/.test(strMatch)){ strClass = 'key';}
	       		else{ strClass = 'string'; }
	        }else if (/true|false/.test(strMatch)){ strClass = 'boolean';}
	         else if (strMatch==='null'){ strClass = 'null'; }
	        return '<span class="' + strClass + '">' + strMatch + '</span>';
	    });
	};
	this.fnRandObject = function(objTarget){
		//this is useful for testing random combinations, maybe also useful for random checks
		if(typeof objTarget === 'undefined'){var objTarget=self.objConfig;}
		if(objTarget.kids && objTarget.kids.length > 0){
			var intKid=Math.round(Math.random() * objTarget.kids.length);
			if(intKid===objTarget.kids.length){ return objTarget; }
			else{ return this.fnRandObject(objTarget.kids[intKid]); }
		}else{ return objTarget; }
	};
	this.fnGetObjectById=function(strId,objConfig){
		if(typeof objConfig !== 'undefined'){
			//console.log(strId,objConfig.id);
			if(objConfig.id===strId){ return objConfig;}
			else if(typeof objConfig.kids ==='object'){
				for(var i=0;i<objConfig.kids.length;i++){
					var objResult=self.fnGetObjectById(strId,objConfig.kids[i]);
					if(typeof objResult !== 'undefined'){ return objResult; }
				}
			}
		}
	};
};