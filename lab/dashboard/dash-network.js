var Dashboard = function(objConfig){
	'use strict';
	this.objConfig=objConfig;
	this.objLines=[];
	this.objStats={};
	this.strIconIn='';
	var self=this;
	this.init=function(fnCallback){
		self.fnCleanConfig(self.objConfig);
		self.objDashboard = self.fnCreateLayout(self.objConfig);
		//run callback if defined... 
		if(typeof fnCallback === 'function'){ fnCallback(); }
	};
	this.fnCleanConfig=function(objConfig){
		//set defaults, clean any breaking inconsistencies
		//sets the only id as the only container if no array is there, keeps things consistent and flexible
		if(typeof objConfig.containers==='undefined' || objConfig.containers.length===0){ self.objConfig.containers=[objConfig.id]; }
		//normalize the nodes
		for(var i=0;i<objConfig.nodes.length;i++){
			//set the container for all nodes
			if(!objConfig.nodes[i].container){ self.objConfig.nodes[i].container=objConfig.containers[0];}
		}
	};
	this.fnScaffold=function(strContainer){
		// create the subcontainers for  left | top , center , bottom | right
		//console.log('create', objConfig);
		var objElement=document.getElementById(strContainer);
		objElement.setAttribute('class', objElement.getAttribute('class')+' dash-network');

		objElement.appendChild( self.fnCreateContainer('left') );
		
		var objMid = self.fnCreateContainer('mid')
		objMid.appendChild( self.fnCreateContainer('top') );
		objMid.appendChild( self.fnCreateContainer('center') );
		objMid.appendChild( self.fnCreateContainer('bottom') );
		objElement.appendChild( objMid );
		
		objElement.appendChild( self.fnCreateContainer('right') );
	};
	this.fnCreateContainer=function(strPosition){
		var objChild = document.createElement('div');
		objChild.setAttribute('class','dash-network-container-'+strPosition);
		if(strPosition !== 'mid' && strPosition !== 'center'){
			var objIn = document.createElement('div');
			objIn.setAttribute('class','dash-network-incoming');
			objIn.innerHTML='<div class="in">'+self.fnGetIcon(strPosition,'in')+'</div>';
			var objStat=document.createElement('div');
			objStat.setAttribute('class','dash-network-stat');
			objIn.appendChild(objStat);

			var objOut = document.createElement('div');
			objOut.setAttribute('class','dash-network-outgoing');
			objOut.innerHTML='<div class="in">'+self.fnGetIcon(strPosition,'out')+'</div>';;
			var objStat=document.createElement('div');
			objStat.setAttribute('class','dash-network-stat');
			objOut.appendChild(objStat);
			objChild.appendChild(objIn);
			objChild.appendChild(objOut);
		}
		return objChild;
	};
	this.fnCreateLayout=function(objConfig){
		//need to do this per container if multiple exist
		for( var i=0; i<objConfig.containers.length; i++){
			//create the stats for each container
			self.objStats[objConfig.containers[i]]={
				 "top-in":0
				,"top-out":0
				,"bottom-in":0
				,"bottom-out":0
				,"left-in":0
				,"left-out":0
				,"right-in":0
				,"right-out":0
			};
			var objElement=document.getElementById(objConfig.containers[i]);
			//add the containers if they are needed
			var objDetails=document.querySelector('#'+objConfig.containers[i]+' .dash-network-container-center');
			if(typeof objConfig.nodes !== 'undefined' && objConfig.nodes.length > 0){
				if(objDetails === null){ self.fnScaffold(objConfig.containers[i]); }
				for(var ii=0;ii<objConfig.nodes.length;ii++){
					//send along the default container
					if(objConfig.nodes[ii].container===objConfig.containers[i]){
						self.fnAddNode(objConfig.nodes[ii]);	
					}
				}
			}
		}
	};
	this.fnAddNode=function(objConfig){
		var objChild=document.getElementById(objConfig.id);
		// see if the the node already exists
		if(objChild === null){
			objChild=document.createElement('div');
			objChild.setAttribute('id',objConfig.id);
			objChild.setAttribute('class','node');
			var strLabel = objConfig.id;
			if(typeof objConfig.label !== 'undefined' && objConfig.label !== ''){ strLabel = objConfig.label; }
			//set the icon for in an out based on position.
			objChild.innerHTML='<div class="label">'+strLabel+'</div><div class="in">'+this.fnGetIcon(objConfig.position,'in')+'</div><div class="out">'+this.fnGetIcon(objConfig.position,'out')+'</div>';
			var strContainer=objConfig.container;
			var objContainer = document.querySelector('#'+strContainer+' .dash-network-container-'+objConfig.position);
			objContainer.appendChild( objChild );
		}
	};
	this.fnGetIcon=function(strPosition,strDirection){
		var strArrow='down';
		switch(strPosition) {
			    case 'top': if(strDirection==='in'){ strArrow='up'; } break;
			    case 'bottom': if(strDirection==='out'){ strArrow='up'; } break;
			    case 'left': 
			    	if(strDirection==='in'){ strArrow='left'; } 
			    	if(strDirection==='out'){ strArrow='right'; } 
			        break;
			    case 'right':
			        if(strDirection==='out'){ strArrow='left'; } 
			    	if(strDirection==='in'){ strArrow='right'; } 
			        break;
			}
		return '<i class="fas fa-caret-square-'+strArrow+'"></i>';
	};
	this.fnGetPosition=function(strPosition){
		var strPoint = 'right';
		switch(strPosition){
			case 'top': var strPoint = 'bottom'; break;
			case 'bottom': var strPoint = 'top'; break;
			case 'right': var strPoint = 'left'; break;
		}
		return strPoint;
	};
	this.fnTrimEvents=function(){
		var intLimit = 20;
		if(self.objLines.length > intLimit){
			if( self.objLines[0].xcontainer && self.objLines[0].xcontainer === true){
				for(var i=0;i<self.objLines[0].obj.length;i++){
					self.objLines[0].obj[i].remove();
				}
			}else{
				self.objLines[0].obj.remove();
			}
			self.objLines.shift();
		}
		// if only 1 = 100%
		// if  2, 100% and 90%
		// if at limit than % of limit
		for(var i=0;i<self.objLines.length;i++){
			//get the age based on the limit
			var floAge= 0;
			if(self.objLines.length < intLimit){ floAge= (i+1)/self.objLines.length; }
			else{ floAge= (i+1)/intLimit; }
			//console.log(floAge);
			//age the events
			//self.objLines[i].obj.setOptions({"color":'rgba(0, 0, 0, '+ floAge +')'});
			if(self.objLines[i].xcontainer && self.objLines[i].xcontainer === true){
				for(var ii=0;ii<self.objLines[i].obj.length;ii++){
					self.objLines[i].obj[ii].setOptions({"gradient": { "startColor": 'rgba(255, 0, 0, '+ floAge +')', "endColor": 'rgb(0, 0, 0, '+ floAge +')' }});
					if(floAge<0.85){ self.objLines[i].obj[ii].setOptions({"dash": {animation: false}}); }
				}
			}else{
				//if(typeof self.objLines[i].obj.setOptions !== 'function'){ console.log(self.objLines[i]); }
				self.objLines[i].obj.setOptions({"gradient": { "startColor": 'rgba(255, 0, 0, '+ floAge +')', "endColor": 'rgb(0, 0, 0, '+ floAge +')' }});
				if(floAge<0.85){ self.objLines[i].obj.setOptions({"dash": {animation: false}}); }
			}
		}
	};
	this.fnEvent=function(objConfig){
		var strId=objConfig.from+'_'+objConfig.to;
		var objFrom = _.find(self.objConfig.nodes, { 'id': objConfig.from });
		var objTo = _.find(self.objConfig.nodes, { 'id': objConfig.to });

		//document.querySelector('.leader-line .leader-line-line-path').getAttribute('d')
		if(objFrom.container===objTo.container){
			//create the line / path
			self.objLines.push(
			{
			  	"obj":new LeaderLine(
				  document.querySelector('#'+objConfig.from+' div.out'),
				  document.querySelector('#'+objConfig.to+' div.in')
					).setOptions({
					 "startSocket": self.fnGetPosition(objFrom.position)
					,"endSocket": self.fnGetPosition(objTo.position)
					,"endPlug": 'arrow3'
					,"endPlugColor": 'rgb(100,100,100)'
					,"path":'grid'
					,"gradient": { "startColor": 'rgba(255, 0, 0, 0.9)', "endColor": 'rgb(0, 255, 0, 0.9)' }
					,"dash": {animation: true}
				})
				,"ts":Date.now()
			});
		}else{
			//these lines need a passthrougharea so they dont intersect nodes
			var objBegin= new LeaderLine(
				  document.querySelector('#'+objConfig.from+' div.out'),
				  document.querySelector('div.passthru-'+objFrom.container+' div.out')
					).setOptions({
					 "startSocket": self.fnGetPosition(objFrom.position)
					,"endSocket": 'top'
					,"endPlug": 'arrow3'
					,"endPlugColor": 'rgb(100,100,100)'
					,"path":'fluid'
					,"gradient": { "startColor": 'rgba(255, 0, 0, 0.9)', "endColor": 'rgb(0, 255, 0, 0.9)' }
					,"dash": {animation: true}
				});
			var objThru= new LeaderLine(
				  document.querySelector('div.passthru-'+objFrom.container+' div.out'),
				  document.querySelector('div.passthru-'+objTo.container+' div.in')
					).setOptions({
					 "startSocket": self.fnGetPosition(self.objConfig.layout[objFrom.container])
					,"endSocket": self.fnGetPosition(self.objConfig.layout[objTo.container])
					,"endPlug": 'arrow3'
					,"endPlugColor": 'rgb(100,100,100)'
					,"path":'grid'
					,"gradient": { "startColor": 'rgba(255, 0, 0, 0.9)', "endColor": 'rgb(0, 255, 0, 0.9)' }
					,"dash": {animation: true}
				});
			var objEnd= new LeaderLine(
				  document.querySelector('div.passthru-'+objTo.container+' div.in'),
				  document.querySelector('#'+objConfig.to+' div.in')
					).setOptions({
					 "startSocket": 'top'
					,"endSocket": self.fnGetPosition(objTo.position)
					,"endPlug": 'arrow3'
					,"endPlugColor": 'rgb(100,100,100)'
					,"path":'fluid'
					,"gradient": { "startColor": 'rgba(255, 0, 0, 0.9)', "endColor": 'rgb(0, 255, 0, 0.9)' }
					,"dash": {animation: true}
				});
			self.objLines.push(
			{
			  	 "obj":[ objBegin, objThru, objEnd]
				,"xcontainer":true
				,"ts":Date.now()
			});

		}
		//update stats
		//console.log(objFrom,objTo);
		self.objStats[objFrom.container][objFrom.position+'-out']++;
		self.objStats[objTo.container][objTo.position+'-in']++;
		//console.log(self.objStats);
		//update the stats on the page
		document.querySelector('#'+objTo.container+' div.dash-network-container-'+objTo.position+' div.dash-network-incoming div.dash-network-stat').innerHTML=self.objStats[objTo.container][objTo.position+'-in'];
		document.querySelector('#'+objFrom.container+' div.dash-network-container-'+objFrom.position+' div.dash-network-outgoing div.dash-network-stat').innerHTML=self.objStats[objFrom.container][objFrom.position+'-out'];
		self.fnTrimEvents();
		//leader-line-2-line-path
		//console.log('line path', document.getElementById('leader-line-'+self.objLines[strId]._id+'-line-path').getAttribute('d'));
	};
};