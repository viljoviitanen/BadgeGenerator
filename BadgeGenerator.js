"use strict";

/*
	BadgeGenerator.js
	- Date: 01.10.2016
	- Author: Leif Andreas Rudlang
*/

class BadgeGenerator {
	
	constructor(canvas, data){
		this.canvas = canvas;
		this.context = canvas.getContext("2d");
		this.name = "Empty";
		this.title = "Empty";
		this.font = "bold 52px Courier";
		this.fontColor = "white";
		this.backgroundColor = "black";
		this.outlineColor = "green";
		this.url = null;
		this.size = 512;
		this.fontSize = 52;
		this.imageScale = 1;
		this.radius = 0;
		this.outline = 0;
		this.image = null;
		this.set(data);
	}
	
	set(data){
		
		if(!data){
			return;
		}
		
		if(data.name)
			this.setName(data.name);
		
		if(data.title)
			this.setTitle(data.title);
		
		if(data.outlineColor)
			this.setOutlineColor(data.outlineColor);
		
		if(data.backgroundColor)
			this.setBackgroundColor(data.backgroundColor);
		
		if(data.fontColor)
			this.setFontColor(data.fontColor);
		
		if(data.image)
			this.setImage(data.image);
		
		if(data.imageScale)
			this.setImageScale(data.imageScale);
		
		if(data.fontSize)
			this.setFontSize(data.fontSize);
		
		if(data.size)
			this.setSize(data.size);
	}
	
	setName(str){
		this.name = str;
	}
	
	setTitle(str){
		this.title = str;
	}
	
	setOutlineColor(str){
		this.outlineColor = str;
	}
	
	setBackgroundColor(str){
		this.backgroundColor = str;
	}
	
	setFontColor(str){
		this.fontColor = str;
	}
	
	setImage(url){
		this.url = url;
		this.image = null;
	}
	
	setImageScale(val){
		this.imageScale = Math.max(0.1, Math.min(val, 10));
	}
	
	setFontSize(size){
		this.fontSize = size;
		this.font = "bold "+this.fontSize+"px Courier";
	}
	
	setSize(size){
		this.size = size;
	}
	
	clear(){
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);	
	}
	
	make(call){
		
		this.clear();
		this.radius = Math.floor(this.size / 2);
		this.outline = Math.floor(this.fontSize * 1.25);
		
		this.prepare();
		this.paintBackground(()=>{
			
			var bottom = this.paintText(this.name, -1);
			var top = this.paintText(this.title, 1);
			this.paintDecoration(top, bottom);
		
			if(typeof call === "function")
				call();
		});
	}
	
	prepare(){
		
		this.canvas.width = this.size;
		this.canvas.height = this.size;
		this.context.font = this.font;
	}
	
	paintBackground(call){
		
		var ctx = this.context;
		ctx.beginPath();
		ctx.arc(this.radius, this.radius, this.radius - this.outline / 2, 0, 2 * Math.PI, false);
		ctx.fillStyle = this.backgroundColor;
		ctx.fill();
		
		this.paintDecal(()=>{
			
			ctx.lineWidth = this.outline;
			ctx.strokeStyle = this.outlineColor;
			ctx.stroke();
			ctx.lineWidth = Math.floor(this.outline * 0.7);
			ctx.strokeStyle = this.backgroundColor;
			ctx.stroke();
			call();
		});
	}
	
	paintText(str, mul){
		
		var ctx = this.context;
		ctx.save();
		ctx.fillStyle = this.fontColor;
		ctx.translate(this.radius, this.radius);
		var rads = this.fontSize / this.radius;
		
		ctx.rotate(mul * (rads * (str.length - 1.5) / 2));
		
		for(var i = 0; i < str.length; i++){
			ctx.save();
			ctx.rotate(-mul * i * rads);
			ctx.fillText(str[i], -this.fontSize / 2, mul * this.radius + (-mul * this.fontSize / 2) + this.outline * (mul === 1 ? 0.15 : 0.35));
			ctx.restore();
		}
		
		ctx.restore();
		
		return rads * (str.length + 1);
	}
	
	paintDecoration(top, bottom){
		
		var ctx = this.context;
		ctx.strokeStyle = this.outlineColor;
		ctx.lineWidth = this.fontSize / 10;
		
		var rads = Math.PI - (top + bottom) / 2;
		var start = bottom / 2 + (-Math.PI / 2 );
		
		ctx.beginPath();
		ctx.arc(this.radius, this.radius, this.radius - this.outline / 2, start,  start + rads, false);
		ctx.stroke();
		
		start =  -bottom/2 + (-Math.PI / 2 );
		ctx.beginPath();
		ctx.arc(this.radius, this.radius, this.radius - this.outline / 2, start - rads,  start, false);
		ctx.stroke();
	}
	
	paintDecal(call){
		
		if(this.image !== null || this.url === null){
			call();
			return;
		}
		
		this.image = new Image();
		this.image.src = this.url;
		this.image.onload = ()=>{
			
			var size = Math.floor(this.radius * this.imageScale);
			var aspect = this.image.width / this.image.height;
			var width = size;
			var height = size;
			
			if(aspect > 1){
				height = size * (this.image.height / this.image.width);
			}else{
				width = size * aspect;
			}
			
			var startX = this.radius - width / 2;
			var startY = this.radius - height / 2;
			this.context.drawImage(this.image, startX, startY, width, height);
			call();
		};
	}
	
}