mouse_x = 0; 
mouse_y = 0;

$("#disk").on("onmousedown", function(event){
	console.log("down");
	$("#disk").on("onmousemove", function(e){
		console.log(e.clientX, e.clientY);
	});
});

$("#disk").on("onmouseup", function(event){
	console.log("up");
	$("#disk").off("onmousemove");
});