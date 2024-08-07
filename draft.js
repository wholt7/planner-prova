/*

var stage = new Konva.Stage({
    container: 'container2',
    width: 600,
    height: 600,
  });
var layer = new Konva.Layer();
/////
function update(activeAnchor) {
    var group = activeAnchor.getParent();

    var topLeft = group.findOne('.topLeft');
    var topRight = group.findOne('.topRight');
    var bottomRight = group.findOne('.bottomRight');
    var bottomLeft = group.findOne('.bottomLeft');
    var image = group.findOne('Image');

    var anchorX = activeAnchor.x();
    var anchorY = activeAnchor.y();

    // update anchor positions
    switch (activeAnchor.getName()) {
      case 'topLeft':
        topRight.y(anchorY);
        bottomLeft.x(anchorX);
        break;
      case 'topRight':
        topLeft.y(anchorY);
        bottomRight.x(anchorX);
        break;
      case 'bottomRight':
        bottomLeft.y(anchorY);
        topRight.x(anchorX);
        break;
      case 'bottomLeft':
        bottomRight.y(anchorY);
        topLeft.x(anchorX);
        break;
    }

    image.position(topLeft.position());

    var width = topRight.x() - topLeft.x();
    var height = bottomLeft.y() - topLeft.y();
    if (width && height) {
      image.width(width);
      image.height(height);
    }
  }
  function addAnchor(group, x, y, name) {
    var stage = group.getStage();
    var layer = group.getLayer();

    var anchor = new Konva.Circle({
      x: x,
      y: y,
      stroke: '#666',
      fill: '#ddd',
      strokeWidth: 2,
      radius: 8,
      name: name,
      draggable: true,
      dragOnTop: false,
    });

    anchor.on('dragmove', function () {
      update(this);
    });
    anchor.on('mousedown touchstart', function () {
      group.draggable(false);
      this.moveToTop();
    });
    anchor.on('dragend', function () {
      group.draggable(true);
    });
    // add hover styling
    anchor.on('mouseover', function () {
      var layer = this.getLayer();
      document.body.style.cursor = 'pointer';
      this.strokeWidth(4);
    });
    anchor.on('mouseout', function () {
      var layer = this.getLayer();
      document.body.style.cursor = 'default';
      this.strokeWidth(2);
    });

    group.add(anchor);
  }
function createObject(attrs,imgx) {
    return Object.assign({}, attrs, {
      // define position
      x: 0,
      y: 0,
      // here should be url to image
      src: imgx,
      // and define filter on it, let's define that we can have only
      // "blur", "invert" or "" (none)
      filter: 'none',
    });
  }
function createDarth(attrs,imgSrc) {
    return Object.assign(createObject(attrs,imgSrc), {
      src: imgSrc,
    });
  }

  // initial state
  var state = [createDarth({ x: 50, y: 50 })];

  // our history
  var appHistory = [state];
  var appHistoryStep = 0;

  // create function will destroy previous drawing
  // then it will created required nodes and attach all events
  function create() {
    layer.destroyChildren();
    state.forEach((item, index) => {
        var darthVaderGroup = new Konva.Group({
            x: 180,
            y: 50,
            draggable: true,
          });
      addAnchor(darthVaderGroup, 0, 0, 'topLeft');
      addAnchor(darthVaderGroup, 200, 0, 'topRight');
      addAnchor(darthVaderGroup, 200, 138, 'bottomRight');
      addAnchor(darthVaderGroup, 0, 138, 'bottomLeft');
      var node = new Konva.Image({
        draggable: true,
        name: 'item-' + index,
        // make it smaller
        width: 200,
        height: 137,
      });
      darthVaderGroup.add(node);
      layer.add(darthVaderGroup);
      node.on('dragend', () => {
        // make new state
        state = state.slice();
        // update object data
        state[index] = Object.assign({}, state[index], {
          x: node.x(),
          y: node.y(),
        });
        // save it into history
        saveStateToHistory(state);
        // don't need to call update here
        // because changes already in node
      });

      node.on('click', () => {
        // find new filter
        var oldFilterIndex = possibleFilters.indexOf(state[index].filter);
        var nextIndex = (oldFilterIndex + 1) % possibleFilters.length;
        var filter = possibleFilters[nextIndex];

        // apply state changes
        state = state.slice();
        state[index] = Object.assign({}, state[index], {
          filter: filter,
        });
        // save state to history
        saveStateToHistory(state);
        // update canvas from state
        update(state);
      });

      var img = new window.Image();
      img.onload = function () {
        node.image(img);
        update(state);
      };
      img.src = item.src;
    });
    update(state);
  }

  function update() {
    state.forEach(function (item, index) {
      var node = stage.findOne('.item-' + index);
      node.setAttrs({
        x: item.x,
        y: item.y,
      });

      if (!node.image()) {
        return;
      }
      if (item.filter === 'blur') {
        node.filters([Konva.Filters.Blur]);
        node.blurRadius(10);
        node.cache();
      } else if (item.filter === 'invert') {
        node.filters([Konva.Filters.Invert]);
        node.cache();
      } else {
        node.filters([]);
        node.clearCache();
      }
    });
  }

  //
  function saveStateToHistory(state) {
    appHistory = appHistory.slice(0, appHistoryStep + 1);
    appHistory = appHistory.concat([state]);
    appHistoryStep += 1;
  }
  //create(state);


  document.querySelector('#undo').addEventListener('click', function () {
    if (appHistoryStep === 0) {
      return;
    }
    appHistoryStep -= 1;
    state = appHistory[appHistoryStep];
    // create everything from scratch
    create(state);
  });

  document.querySelector('#redo').addEventListener('click', function () {
    if (appHistoryStep === appHistory.length - 1) {
      return;
    }
    appHistoryStep += 1;
    state = appHistory[appHistoryStep];
    // create everything from scratch
    create(state);
  });
stage.add(layer);
document.addEventListener("click",(e)=>{
    if(e.target.classList.contains("imgxmd")){
        let imageObj=e.target.cloneNode();
        // create new object
      state.push(
        createDarth({
          x: 300 * Math.random(),
          y: 300 * Math.random(),
        },imageObj.src)
      );
      // recreate canvas
      
      create(state);
    }
},true)


// darth vader

// our history /////////////////////////////////////////////////////
function createObject(attrs,imgx) {
    return Object.assign({}, attrs, {
      // define position
      x: 0,
      y: 0,
      // here should be url to image
      src: imgx,
      scaleX:1,
      scaleY:1,
    });
}
function createDarth(attrs,imgSrc) {
    return Object.assign(createObject(attrs,imgSrc), {
      src: imgSrc,
    });
  }
function update2() {
    state.forEach(function (item, index) {
      var node = stage.findOne('.item-' + index);
      node.setAttrs({
        x: item.x,
        y: item.y,
        scaleX:item.scaleX,
        scaleY:item.scaleY,

      });

      
      
    });
  }
var state = [];
var appHistory = [state];
var appHistoryStep = 0;
function saveStateToHistory(state) {
    appHistory = appHistory.slice(0, appHistoryStep + 1);
    appHistory = appHistory.concat([state]);
    appHistoryStep += 1;
}
function create() {
    layer.destroyChildren();
    state.forEach((item, index) => {

        var node = new Konva.Group({
            x: 180,
            y: 50,
            draggable: true,
            name: 'item-' + index,
        });
        var darthVaderImg = new Konva.Image({
            width: 200,
            height: 137,
            name:'added-to-work',
        });  
        node.add(darthVaderImg);

    addAnchor(node, 0, 0, 'topLeft');
    addAnchor(node, 200, 0, 'topRight');
    addAnchor(node, 200, 138, 'bottomRight');
    addAnchor(node, 0, 138, 'bottomLeft');
      layer.add(node);
      node.on('dragend', () => {
        // make new state
        state = state.slice();
        // update object data
        state[index] = Object.assign({}, state[index], {
          x: node.x(),
          y: node.y(),
          scaleX:node.scaleX(),
          scaleY:node.scaleY(),

        });
        // save it into history
        saveStateToHistory(state);
        // don't need to call update here
        // because changes already in node
        console.log("fired")
      });
      
      var imageObj1 = new Image();
      imageObj1.onload = function () {
          darthVaderImg.image(imageObj1);
          update2(state);
      };
      imageObj1.src = item.src;
    });
    update2(state);
  }
*/

////////////////////////////////////////////////////
/*
document.addEventListener("click",(e)=>{
    if(e.target.classList.contains("imgxmd")){
        var darthVaderImg = new Konva.Image({
            width: 200,
            height: 137,
        });            
        var darthVaderGroup = new Konva.Group({
            x: 180,
            y: 50,
            draggable: true,
        });
        layer.add(darthVaderGroup);
        darthVaderGroup.add(darthVaderImg);
        addAnchor(darthVaderGroup, 0, 0, 'topLeft');
        addAnchor(darthVaderGroup, 200, 0, 'topRight');
        addAnchor(darthVaderGroup, 200, 138, 'bottomRight');
        addAnchor(darthVaderGroup, 0, 138, 'bottomLeft');
        
        
        var imageObj1 = new Image();
        imageObj1.onload = function () {
            darthVaderImg.image(imageObj1);
        };
        imageObj1.src = e.target.src;
        create(state)

    }
},true)



var shapes=stage.find(".selected-obj");
shapes.forEach((item)=>{
    item.setAttrs({
        stroke: 'black',
        strokeWidth: 4,
    })
})


var shapes=stage.find(".selected-obj");
shapes.forEach((item)=>{
    
    item.on("foo",()=>{
        console.log("try")
    });

})
function scaleIn(){
    var shapes=stage.find(".selected-obj");
    shapes.forEach((item)=>{
        item.scaleX(item.scaleX()+0.15);
        item.scaleY(item.scaleY()+0.15);
        item.fire('foo');
    })
    state.forEach((item, index) => {

        
      document.getElementById("scale-in").addEventListener('click', () => {
        // make new state
        state = state.slice();
        // update object data
        state[index] = Object.assign({}, state[index], {
          x: shapes[0].x(),
          y: shapes[0].y(),
          scaleX:shapes[0].scaleX(),
          scaleY:shapes[0].scaleY(),

        });
        // save it into history
        saveStateToHistory(state);
        // don't need to call update here
        // because changes already in node
        console.log("fired")
      });
      
      
    });
    update2(state);    

    
  
}*/









//___________________________________//
var mainColor=document.getElementById("color-picker").value;
var mainSize=document.getElementById("size-picker").value;
var fontSize=document.getElementById("font-size").value;

let iconsBoxes=document.querySelectorAll("#boxes-sec img");
document.addEventListener("click",(event)=>{
    if(event.target.id=="fields-icon" || event.target.parentNode.id=="fields-icon"){
        for (let ele of iconsBoxes){
            if(ele.classList.contains('selected')){
                ele.classList.remove('selected');
            }
        }
        event.target.classList.add("selected");
        document.querySelector(".vert-sec .right .fields").style.display="flex";
        document.querySelector(".vert-sec .right .tools").style.display="none";
        document.querySelector(".vert-sec .right .positions").style.display="none";
    }else if(event.target.id=="tools-icon" || event.target.parentNode.id=="tools-icon"){
        for (let ele of iconsBoxes){
            if(ele.classList.contains('selected')){
                ele.classList.remove('selected');
            }
        }
        event.target.classList.add("selected");
        document.querySelector(".vert-sec .right .fields").style.display="none";
        document.querySelector(".vert-sec .right .tools").style.display="flex";
        document.querySelector(".vert-sec .right .positions").style.display="none";
    }else if(event.target.id=="positions-icon" || event.target.parentNode.id=="positions-icon"){
        for (let ele of iconsBoxes){
            if(ele.classList.contains('selected')){
                ele.classList.remove('selected');
            }
        }
        event.target.classList.add("selected");
        document.querySelector(".vert-sec .right .fields").style.display="none";
        document.querySelector(".vert-sec .right .tools").style.display="none";
        document.querySelector(".vert-sec .right .positions").style.display="flex";
    }
})

var statesAll=new Array();
var indexC= -1;
var width = window.innerWidth;
var height = window.innerHeight;

function update(activeAnchor) {
  var group = activeAnchor.getParent();

  var topLeft = group.findOne('.topLeft');
  var topRight = group.findOne('.topRight');
  var bottomRight = group.findOne('.bottomRight');
  var bottomLeft = group.findOne('.bottomLeft');
  var image = group.findOne('Image');

  var anchorX = activeAnchor.x();
  var anchorY = activeAnchor.y();

  // update anchor positions
  switch (activeAnchor.getName()) {
      case 'topLeft':
      topRight.y(anchorY);
      bottomLeft.x(anchorX);
      break;
      case 'topRight':
      topLeft.y(anchorY);
      bottomRight.x(anchorX);
      break;
      case 'bottomRight':
      bottomLeft.y(anchorY);
      topRight.x(anchorX);
      break;
      case 'bottomLeft':
      bottomRight.y(anchorY);
      topLeft.x(anchorX);
      break;
  }

  image.position(topLeft.position());

  var width = topRight.x() - topLeft.x();
  var height = bottomLeft.y() - topLeft.y();
  if (width && height) {
      image.width(width);
      image.height(height);
  }
}
function addAnchor(group, x, y, name) {
  var stage = group.getStage();
  var layer = group.getLayer();

  var anchor = new Konva.Circle({
      x: x,
      y: y,
      stroke: '#666',
      fill: '#ddd',
      strokeWidth: 2,
      radius: 8,
      name: name,
      draggable: true,
      dragOnTop: false,
  });

  anchor.on('dragmove', function () {
      update(this);
  });
  anchor.on('mousedown touchstart', function () {
      group.draggable(false);
      this.moveToTop();
  });
  anchor.on('dragend', function () {
      group.draggable(true);
      updateStates();
  });
  // add hover styling
  anchor.on('mouseover', function () {
      var layer = this.getLayer();
      document.body.style.cursor = 'pointer';
      this.strokeWidth(4);
  });
  anchor.on('mouseout', function () {
      var layer = this.getLayer();
      document.body.style.cursor = 'default';
      this.strokeWidth(2);
  });

  group.add(anchor);
}

var stage = new Konva.Stage({
  container: 'container2',
  width: width,
  height: height,
});

var layer = new Konva.Layer();
var mainLayer=new Konva.Layer();
stage.add(mainLayer);
stage.add(layer);
mainLayer.zIndex(0);
layer.zIndex(1);
let transTool=document.getElementById("transform");

function updateStates(){
  indexC++;
  var state=[];
  let children=stage.find(".added-to-work");
  children.forEach((item)=>{
    let obj;
    if(item.hasName("line")){
      obj={
        type:"line",
        attrs:Object.assign({},item.attrs),
      };
    }else if(item.hasName("text")){
      obj={
        type:"text",
        attrs:Object.assign({},item.attrs),
      };
    }else{
      obj={
        type:"image",
        attrs:Object.assign({},item.attrs),
        parent:{
          x:item.getParent().x(),
          y:item.getParent().y(),
          zIndex:item.getParent().zIndex(),
          scaleX:item.getParent().scaleX(),
          scaleY:item.getParent().scaleY()
        }
      };
    }
    state.push(Object.assign({},obj));
  })
  statesAll.push(state);

}
stage.on("dragend",()=>{
  updateStates();
  console.log("here")
})
function originalState(target){
  let controllers=document.querySelectorAll(".hori-sec .controllers img");
  for(let ele of controllers){
      if(ele.classList.contains("selected")){
          ele.classList.remove("selected");
      }
  }
  target.classList.add("selected");
}

stage.on("click",(e)=>{
  if(e.target.hasName("field")){
    console.log("field")
    var shapes=stage.find(".selected-obj");
    shapes.forEach((item)=>{
        if (item.hasName("line")){
          item.setAttrs({
            opacity: 1,
          })
        }else{
          item.setAttrs({
            stroke: 'none',
            strokeWidth: 0,
          })
        }
        item.removeName("selected-obj");
    })
  }else if(e.target.attrs.container!==undefined){
    if(e.target.attrs.container.id=="container2"){
      console.log("container")
        var shapes=stage.find(".selected-obj");
        shapes.forEach((item)=>{
            if (item.hasName("line")){
              item.setAttrs({
                opacity: 1,
              })
            }else{
              item.setAttrs({
                stroke: 'none',
                strokeWidth: 0,
              })
            }
            item.removeName("selected-obj");
        })
    }
  }else{
    var container=stage.container();
    container.addEventListener("click",(ev)=>{
        if(ev.ctrlKey){
            
        }else{
            var shapes=stage.find(".selected-obj");
            shapes.forEach((item)=>{
              if (item.hasName("line")){
                item.setAttrs({
                  opacity: 1,
                })
              }else{
                item.setAttrs({
                  stroke: 'none',
                  strokeWidth: 0,
                })
              }
                
              item.removeName("selected-obj");
            })
            e.target.addName("selected-obj");
            var shapes=stage.find(".selected-obj");
            shapes.forEach((item)=>{
              if(item.hasName("line")){
                item.setAttrs({
                  opacity: 0.5,
                })
              }else{
                item.setAttrs({
                  stroke: 'blue',
                  strokeWidth: 2,
                })
              }
            })
            console.log(stage.find(".selected-obj"))
        }
    })
  }
    

  
  
})

stage.container().addEventListener("click",(ev)=>{
  if(ev.ctrlKey){
    stage.on("click",(e)=>{
      if(e.target.hasName("selected-obj")){
        e.target.removeName("selected-obj");
        if (e.target.hasName("line")){
          e.target.setAttrs({
            opacity: 1,
          })
        }else{
          e.target.setAttrs({
            stroke: 'none',
            strokeWidth: 0,
          })
        }
    }else{
        e.target.addName("selected-obj");

    }
    var shapes=stage.find(".selected-obj");
    shapes.forEach((item)=>{
      if(item.hasName("line")){
        item.setAttrs({
          opacity:0.5,
        })
      }else{
        item.setAttrs({
          stroke: 'blue',
          strokeWidth: 2,
        })
      }
        
    })
    })
  }
})
document.addEventListener("click",(e)=>{
  if(e.target.classList.contains("imgxmd")){
      let imageObj=e.target.cloneNode();
      // create new object
      let allObjsAdded=stage.find(".added-to-work");
      let mainContainerWidth=document.getElementById("container2").clientWidth;
      let realWidth,realHeight,dragOpt;
      if(imageObj.classList.contains("field")){
        realWidth=mainContainerWidth* 0.90;
        realHeight=(imageObj.naturalHeight /imageObj.naturalWidth)*realWidth;
        dragOpt=false;

      }else{
        realWidth=mainContainerWidth* 0.08;
        realHeight=(imageObj.naturalHeight /imageObj.naturalWidth)*realWidth;
        dragOpt=true;
      }
      console.log(dragOpt,realWidth,realHeight,mainContainerWidth)
      var darthVaderImgx = new Konva.Image({
        width:realWidth,
        height:realHeight,
        name: dragOpt ? "added-to-work":"field",
      });
      
      var node = new Konva.Group({
        x: 30,
        y: 25,
        draggable: dragOpt,
      });    
      node.add(darthVaderImgx);
      if(imageObj.classList.contains("field")){
        mainLayer.add(node);
        node.zIndex(0)
      }else{
        node.zIndex(allObjsAdded.length);
        addAnchor(node, 0, 0, 'topLeft');
        addAnchor(node, realWidth, 0, 'topRight');
        addAnchor(node, realWidth, realHeight, 'bottomRight');
        addAnchor(node, 0, realHeight, 'bottomLeft');
        layer.add(node);
      }
      
      var imageObj1 = new Image();
      imageObj1.onload = function () {
        darthVaderImgx.image(imageObj1);
      };
      imageObj1.src = imageObj.src;

    
    
  }
},true)


// START ALL FUNCTIONS //

function scaleIn(){
  var shapes=stage.find(".selected-obj");
  shapes.forEach((item)=>{
      let deltaX=item.width();
      let deltaY=item.height();
      item.width(item.width()*1.15);
      item.height(item.height()*1.15);
      console.log(item.getParent());
      deltaX=item.width()-deltaX;
      deltaY=item.height()-deltaY;
      let topRight=item.getParent().findOne(".topRight");
      let bottomLeft=item.getParent().findOne(".bottomLeft");
      let bottomRight=item.getParent().findOne(".bottomRight");
      topRight.x(topRight.x()+deltaX);
      bottomLeft.y(bottomLeft.y()+deltaY);
      bottomRight.x(bottomRight.x()+deltaX);
      bottomRight.y(bottomRight.y()+deltaY);

  })

  updateStates()
    
}
function scaleOut(){
  var shapes=stage.find(".selected-obj");
  shapes.forEach((item)=>{
      let deltaX=item.width();
      let deltaY=item.height();
      item.width(item.width()*0.90);
      item.height(item.height()*0.90);
      console.log(item.getParent());
      deltaX=deltaX-item.width();
      deltaY=deltaY-item.height();
      let topRight=item.getParent().findOne(".topRight");
      let bottomLeft=item.getParent().findOne(".bottomLeft");
      let bottomRight=item.getParent().findOne(".bottomRight");
      topRight.x(topRight.x()-deltaX);
      bottomLeft.y(bottomLeft.y()-deltaY);
      bottomRight.x(bottomRight.x()-deltaX);
      bottomRight.y(bottomRight.y()-deltaY);

  })

  updateStates()
    
}
function deleteObject(){
  var shapes=stage.find(".selected-obj");
  shapes.forEach((item)=>{
    item.getParent().remove();
  })
  updateStates();
}
function flipHori(){
  var shapes=stage.find(".selected-obj");
  shapes.forEach((item)=>{
    item.getParent().offsetX(item.width()/2);
    item.getParent().scaleX(item.getParent().scaleX() * -1);
  })
  updateStates();
}
function flipVert(){
  var shapes=stage.find(".selected-obj");
  shapes.forEach((item)=>{
    item.getParent().offsetY(item.height() / 2);
    item.getParent().scaleY(item.getParent().scaleY() * -1);
  })
  updateStates();
}
function zIndexDown(){
  var shapes=stage.find(".selected-obj");
  let allWorkObjs=stage.find(".added-to-work");
  if(shapes.length>0){
      shapes.forEach((item)=>{
        let actionItem;
        if(item.hasName("line") || item.hasName("text")){
          actionItem=item;
        }else{ 
          actionItem=item.getParent();
        }
        if(actionItem.zIndex()-1 <0){
          actionItem.zIndex(0);
        }else{
          actionItem.zIndex(actionItem.zIndex()-1);
        }
      })
      let tempArr=[];
      for (let ele of allWorkObjs){
            let actionItem;
            if(ele.hasName("line") || ele.hasName("text")){
            actionItem=ele;
            }else{ 
            actionItem=ele.getParent();
            }
          tempArr.push(actionItem.zIndex());
      }
      tempArr.sort(function(a, b){return a-b});
      console.log(tempArr)
      for(let counter=0;counter<tempArr.length;counter++){
          for (let ele of allWorkObjs){
                let actionItem;
                if(ele.hasName("line") || ele.hasName("text")){
                    actionItem=ele;
                }else{ 
                    actionItem=ele.getParent();
                }
                if(actionItem.hasName("updated")){
                    continue;
                }
                if(actionItem.zIndex()==tempArr[counter]){
                    console.log("moda");
                    actionItem.zIndex(counter);
                    console.log(counter)
                    actionItem.addName("updated");
                    break;
                }
          }
      }
      for(let ele of allWorkObjs){
        let actionItem;
        if(ele.hasName("line") || ele.hasName("text")){
          actionItem=ele;
        }else{ 
          actionItem=ele.getParent();
        }
        if(actionItem.hasName("updated")){
            actionItem.removeName("updated");
        }
      }
      updateStates();
    }
}
function zIndexUp(){
  var shapes=stage.find(".selected-obj");
  let allWorkObjs=stage.find(".added-to-work");
  if(shapes.length>0){
      for(let ele of shapes){
        let actionItem;
            if(ele.hasName("line") || ele.hasName("text")){
            actionItem=ele;
            }else{ 
            actionItem=ele.getParent();
            }
        if(actionItem.zIndex()<allWorkObjs.length-1){
          let tempArr=[];
          for(let obj of allWorkObjs){
              if(ele==obj){
                  continue;
              }
              let actionItem2;
            if(obj.hasName("line") || obj.hasName("text")){
            actionItem2=obj;
            }else{ 
            actionItem2=obj.getParent();
            }
              tempArr.push(actionItem2.zIndex());
          }
          let maxNum=Math.max(...tempArr);
          if(actionItem.zIndex()+1>maxNum){
              actionItem.zIndex(maxNum);
          }else{
            actionItem.zIndex(actionItem.zIndex()+1)
          }
        }
      }
      let tempArr=[];
      for (let ele of allWorkObjs){
            let actionItem;
            if(ele.hasName("line") || ele.hasName("text")){
            actionItem=ele;
            }else{ 
            actionItem=ele.getParent();
            }
          tempArr.push(actionItem.zIndex());
      }
      tempArr.sort(function(a, b){return a-b});
      console.log(tempArr)
      for(let counter=0;counter<tempArr.length;counter++){
          for (let ele of allWorkObjs){
                let actionItem;
                if(ele.hasName("line") || ele.hasName("text")){
                    actionItem=ele;
                }else{ 
                    actionItem=ele.getParent();
                }
                if(actionItem.hasName("updated")){
                    continue;
                }
                if(actionItem.zIndex()==tempArr[counter]){
                    console.log("moda");
                    actionItem.zIndex(counter);
                    console.log(counter)
                    actionItem.addName("updated");
                    break;
                }
          }
      }
      for(let ele of allWorkObjs){
        let actionItem;
        if(ele.hasName("line") || ele.hasName("text")){
          actionItem=ele;
        }else{ 
          actionItem=ele.getParent();
        }
        if(actionItem.hasName("updated")){
            actionItem.removeName("updated");
        }
      }
      updateStates();
  }
}
function background(){
  var shapes=stage.find(".selected-obj");
  let allWorkObjs=stage.find(".added-to-work");
  if(shapes.length>0){
      for(let ele of shapes){
        let actionItem;
        if(ele.hasName("line") || ele.hasName("text")){
            actionItem=ele;
        }else{ 
            actionItem=ele.getParent();
        }
        actionItem.zIndex(0);
      }
      let tempArr=[];
      for (let ele of allWorkObjs){
        let actionItem;
        if(ele.hasName("line") || ele.hasName("text")){
            actionItem=ele;
        }else{ 
            actionItem=ele.getParent();
        }
        tempArr.push(actionItem.zIndex());
      }
      tempArr.sort(function(a, b){return a-b});
      console.log(tempArr)
      for(let counter=0;counter<tempArr.length;counter++){
          for (let ele of allWorkObjs){
                let actionItem;
                if(ele.hasName("line") || ele.hasName("text")){
                    actionItem=ele;
                }else{ 
                    actionItem=ele.getParent();
                }
                if(actionItem.hasName("updated")){
                    continue;
                }
                if(actionItem.zIndex()==tempArr[counter]){
                    console.log("moda");
                    actionItem.zIndex(counter);
                    console.log(counter)
                    actionItem.addName("updated");
                    break;
                }
          }
      }
      for(let ele of allWorkObjs){
        let actionItem;
        if(ele.hasName("line") || ele.hasName("text")){
          actionItem=ele;
        }else{ 
          actionItem=ele.getParent();
        }
        if(actionItem.hasName("updated")){
            actionItem.removeName("updated");
        }
      }
      updateStates();
  }
}
function foreground(){
  var shapes=stage.find(".selected-obj");
  let allWorkObjs=stage.find(".added-to-work");
  if(shapes.length>0){
      for(let ele of shapes){
        let actionItem;
        if(ele.hasName("line") || ele.hasName("text")){
          actionItem=ele;
        }else{ 
          actionItem=ele.getParent();
        }

        let tempArr=[];
        for(let obj of allWorkObjs){
            let actionItem2;
            if(obj.hasName("line") || obj.hasName("text")){
            actionItem2=obj;
            }else{ 
            actionItem2=obj.getParent();
            }
            if(ele==obj){
                continue;
            }
            tempArr.push(actionItem2.zIndex());
        }
        let maxNum=Math.max(...tempArr);
        actionItem.zIndex(maxNum);
      }
      let tempArr=[];
      for (let ele of allWorkObjs){
        let actionItem;
        if(ele.hasName("line") || ele.hasName("text")){
            actionItem=ele;
        }else{ 
            actionItem=ele.getParent();
        }
        tempArr.push(actionItem.zIndex());
      }
      tempArr.sort(function(a, b){return a-b});
      console.log(tempArr)
      for(let counter=0;counter<tempArr.length;counter++){
          for (let ele of allWorkObjs){
                let actionItem;
                if(ele.hasName("line") || ele.hasName("text")){
                    actionItem=ele;
                }else{ 
                    actionItem=ele.getParent();
                }
                if(actionItem.hasName("updated")){
                    continue;
                }
                if(actionItem.zIndex()==tempArr[counter]){
                    console.log("moda");
                    actionItem.zIndex(counter);
                    console.log(counter)
                    actionItem.addName("updated");
                    break;
                }
          }
      }
      for(let ele of allWorkObjs){
        let actionItem;
        if(ele.hasName("line") || ele.hasName("text")){
          actionItem=ele;
        }else{ 
          actionItem=ele.getParent();
        }
        if(actionItem.hasName("updated")){
            actionItem.removeName("updated");
        }
      }
      updateStates();
  }
}
function changeText(text){
  var tr = new Konva.Transformer({
    nodes: [text],
    padding: 5,
    boundBoxFunc: function (oldBox, newBox) {
      newBox.width = Math.max(30, newBox.width);
      return newBox;
    },
  })
  text.on('transform', function () {
    // reset scale, so only with is changing by transformer
    text.setAttrs({
      width: text.width() * text.scaleX(),
      scaleX: 1,
    });
  });
  layer.add(tr);
  text.on('dblclick', () => {
    // hide text node and transformer:
    text.hide();
    tr.hide();

    // create textarea over canvas with absolute position
    // first we need to find position for textarea
    // how to find it?

    // at first lets find position of text node relative to the stage:
    var textPosition = text.absolutePosition();

    // so position of textarea will be the sum of positions above:
    var areaPosition = {
      x: stage.container().offsetLeft + textPosition.x,
      y: stage.container().offsetTop + textPosition.y,
    };

    // create textarea and style it
    var textarea = document.createElement('textarea');
    document.body.appendChild(textarea);

    // apply many styles to match text on canvas as close as possible
    // remember that text rendering on canvas and on the textarea can be different
    // and sometimes it is hard to make it 100% the same. But we will try...
    textarea.value = text.text();
    textarea.style.position = 'absolute';
    textarea.style.top = areaPosition.y + 'px';
    textarea.style.left = areaPosition.x + 'px';
    textarea.style.width = text.width() - text.padding() * 2 + 'px';
    textarea.style.height =
      text.height() - text.padding() * 2 + 5 + 'px';
    textarea.style.fontSize = text.fontSize() + 'px';
    textarea.style.border = 'none';
    textarea.style.padding = '0px';
    textarea.style.margin = '0px';
    textarea.style.overflow = 'hidden';
    textarea.style.background = 'none';
    textarea.style.outline = 'none';
    textarea.style.resize = 'none';
    textarea.style.lineHeight = text.lineHeight();
    textarea.style.fontFamily = text.fontFamily();
    textarea.style.transformOrigin = 'left top';
    textarea.style.textAlign = text.align();
    textarea.style.color = text.fill();
    rotation = text.rotation();
    var transform = '';
    if (rotation) {
      transform += 'rotateZ(' + rotation + 'deg)';
    }

    var px = 0;
    // also we need to slightly move textarea on firefox
    // because it jumps a bit
    var isFirefox =
      navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    if (isFirefox) {
      px += 2 + Math.round(text.fontSize() / 20);
    }
    transform += 'translateY(-' + px + 'px)';

    textarea.style.transform = transform;

    // reset height
    textarea.style.height = 'auto';
    // after browsers resized it we can set actual value
    textarea.style.height = textarea.scrollHeight + 3 + 'px';

    textarea.focus();

    function removeTextarea() {
      textarea.parentNode.removeChild(textarea);
      window.removeEventListener('click', handleOutsideClick);
      text.show();
      tr.show();
      tr.forceUpdate();
      updateStates();

    }

    function setTextareaWidth(newWidth) {
      if (!newWidth) {
        // set width for placeholder
        newWidth = text.placeholder.length * text.fontSize();
      }
      // some extra fixes on different browsers
      var isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      var isFirefox =
        navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
      if (isSafari || isFirefox) {
        newWidth = Math.ceil(newWidth);
      }

      var isEdge =
        document.documentMode || /Edge/.test(navigator.userAgent);
      if (isEdge) {
        newWidth += 1;
      }
      textarea.style.width = newWidth + 'px';
    }

    textarea.addEventListener('keydown', function (e) {
      // hide on enter
      // but don't hide on shift + enter
      if (e.keyCode === 13 && !e.shiftKey) {
        text.text(textarea.value);
        removeTextarea();
      }
      // on esc do not set value back to node
      if (e.keyCode === 27) {
        removeTextarea();
      }
    });

    textarea.addEventListener('keydown', function (e) {
      scale = text.getAbsoluteScale().x;
      setTextareaWidth(text.width() * scale);
      textarea.style.height = 'auto';
      textarea.style.height =
        textarea.scrollHeight + text.fontSize() + 'px';
    });

    function handleOutsideClick(e) {
      if (e.target !== textarea) {
        text.text(textarea.value);
        removeTextarea();
      }
    }
    setTimeout(() => {
      window.addEventListener('click', handleOutsideClick);
    });
  });
}
function createText(){
  let text=new Konva.Text({
    x: 50,
    y: 50,
    fontSize: fontSize,
    text: 'Text',
    draggable: true,
    fill:mainColor,
    width:200,
    height:100,
    name:"added-to-work text",
  })
  layer.add(text);
  changeText(text);
  updateStates();
  
}
function freeDraw(){
  var isPaint = false;
      var lastLine;

      stage.on('mousedown touchstart', function (e) {
        if(document.getElementById("free-drawing").classList.contains("selected")){
          isPaint = true;
          var pos = stage.getPointerPosition();
          lastLine = new Konva.Line({
            draggable:true,
            name:"added-to-work line",
            stroke: mainColor,
            strokeWidth: parseInt(mainSize),
            globalCompositeOperation:'source-over',
            // round cap for smoother lines
            lineCap: 'round',
            lineJoin: 'round',
            // add point twice, so we have some drawings even on a simple click
            points: [pos.x, pos.y, pos.x, pos.y],
          });
          layer.add(lastLine);
          var trLine = new Konva.Transformer({
            nodes: [lastLine],
            padding: 5,
          })
          layer.add(trLine);

        }
        
      });

      stage.on('mouseup touchend', function () {
          isPaint = false;
          updateStates();
      });

      // and core function - drawing
      stage.on('mousemove touchmove', function (e) {
          if (!isPaint) {
            return;
          }
  
          console.log(isPaint)
          const pos = stage.getPointerPosition();
          var newPoints = lastLine.points().concat([pos.x, pos.y]);
          lastLine.points(newPoints);
        
      });
}
function undo(){
  indexC--;
  layer.destroyChildren();
  if(indexC>=0){
    statesAll[indexC].forEach((item)=>{
      if(item.type=="image"){
        let img=new Konva.Image({
          src:item.attrs.image.currentSrc,
        });
        img.setAttrs(item.attrs);
        let nodeRe = new Konva.Group({
          x: item.parent.x,
          y: item.parent.y,
          scaleX:item.parent.scaleX,
          scaleY:item.parent.scaleY,
          draggable: true,
        });
        nodeRe.zIndex(item.parent.zIndex);
        nodeRe.add(img);
        addAnchor(nodeRe, 0, 0, 'topLeft');
        addAnchor(nodeRe, img.width(), 0, 'topRight');
        addAnchor(nodeRe, img.width(), img.height(), 'bottomRight');
        addAnchor(nodeRe, 0, img.height(), 'bottomLeft');
        layer.add(nodeRe);
      }else if(item.type=="line"){
        let linexx=new Konva.Line();
        linexx.setAttrs(item.attrs);
        var trLine = new Konva.Transformer({
          nodes: [linexx],
          padding: 5,
        })
        layer.add(trLine);
        layer.add(linexx);
      }else if(item.type=="text"){
        let textxx=new Konva.Text();
        textxx.setAttrs(item.attrs);
        layer.add(textxx);
        changeText(textxx);

      }
      
    })
  }else{
    indexC=0;
  }
  
}
function redo(){
  indexC++;
  layer.destroyChildren();
  if(indexC<statesAll.length){
    statesAll[indexC].forEach((item)=>{
      if(item.type=="image"){
        let img=new Konva.Image({
          src:item.attrs.image.currentSrc,
        });
        img.setAttrs(item.attrs);
        let nodeRe = new Konva.Group({
          x: item.parent.x,
          y: item.parent.y,
          scaleX:item.parent.scaleX,
          scaleY:item.parent.scaleY,
          draggable: true,
        });
        nodeRe.zIndex(item.parent.zIndex);
        nodeRe.add(img);
        addAnchor(nodeRe, 0, 0, 'topLeft');
        addAnchor(nodeRe, img.width(), 0, 'topRight');
        addAnchor(nodeRe, img.width(), img.height(), 'bottomRight');
        addAnchor(nodeRe, 0, img.height(), 'bottomLeft');
        layer.add(nodeRe);
      }else if(item.type=="line"){
        let linexx=new Konva.Line();
        linexx.setAttrs(item.attrs);
        var trLine = new Konva.Transformer({
          nodes: [linexx],
          padding: 5,
        })
        layer.add(trLine);
        layer.add(linexx);
      }else if(item.type=="text"){
        let textxx=new Konva.Text();
        textxx.setAttrs(item.attrs);
        layer.add(textxx);
        changeText(textxx);

      }
    })
  }else{
    indexC=statesAll.length-1;
    statesAll[indexC].forEach((item)=>{
      if(item.type=="image"){
        let img=new Konva.Image({
          src:item.attrs.image.currentSrc,
        });
        img.setAttrs(item.attrs);
        let nodeRe = new Konva.Group({
          x: item.parent.x,
          y: item.parent.y,
          scaleX:item.parent.scaleX,
          scaleY:item.parent.scaleY,
          draggable: true,
        });
        nodeRe.zIndex(item.parent.zIndex);
        nodeRe.add(img);
        addAnchor(nodeRe, 0, 0, 'topLeft');
        addAnchor(nodeRe, img.width(), 0, 'topRight');
        addAnchor(nodeRe, img.width(), img.height(), 'bottomRight');
        addAnchor(nodeRe, 0, img.height(), 'bottomLeft');
        layer.add(nodeRe);
      }else if(item.type=="line"){
        let linexx=new Konva.Line();
        linexx.setAttrs(item.attrs);
        var trLine = new Konva.Transformer({
          nodes: [linexx],
          padding: 5,
        })
        layer.add(trLine);
        layer.add(linexx);
      }else if(item.type=="text"){
        let textxx=new Konva.Text();
        textxx.setAttrs(item.attrs);
        layer.add(textxx);
        changeText(textxx);

      }
    })
  }
  
}
function downloadURI(uri, name) {
  var link = document.createElement('a');
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}


//______________________ END FUNCTIONS __________________//
// Scale In Action //
document.getElementById("scale-in").addEventListener("click",(e)=>{
  if(!document.getElementById("free-drawing").classList.contains("selected")){

      originalState(e.target);
      scaleIn();
      setTimeout(()=>{originalState(transTool)},100); 
  }
},true)
// Scale Out Action //
document.getElementById("scale-out").addEventListener("click",(e)=>{
  if(!document.getElementById("free-drawing").classList.contains("selected")){

  originalState(e.target);
  scaleOut();
  setTimeout(()=>{originalState(transTool)},100); 
  }
},true)
// Delete Object Action //
document.getElementById("delete-obj").addEventListener("click",(e)=>{
  if(!document.getElementById("free-drawing").classList.contains("selected")){

  originalState(e.target);
  deleteObject();
  setTimeout(()=>{originalState(transTool)},100); 
  }
})
// Flip Horizontal Action //
document.getElementById("flip-hori").addEventListener("click",(e)=>{
  if(!document.getElementById("free-drawing").classList.contains("selected")){

  originalState(e.target);
  flipHori();
  setTimeout(()=>{originalState(transTool)},100); 
  }
})
// Flip Vertical Action //
document.getElementById("flip-vert").addEventListener("click",(e)=>{
  if(!document.getElementById("free-drawing").classList.contains("selected")){

  originalState(e.target);
  flipVert();
  setTimeout(()=>{originalState(transTool)},100); 
  }
})
// Z-Index Down Action //
document.getElementById("zindex-down").addEventListener("click",(e)=>{
  if(!document.getElementById("free-drawing").classList.contains("selected")){

  originalState(e.target);
  zIndexDown();
  setTimeout(()=>{originalState(transTool)},100); 
  }
})
// Z-Index Up Action //
document.getElementById("zindex-up").addEventListener("click",(e)=>{
  if(!document.getElementById("free-drawing").classList.contains("selected")){

  originalState(e.target);
  zIndexUp();
  setTimeout(()=>{originalState(transTool)},100); 
  }
})
// Z-Index Down Along Back Action //
document.getElementById("zindex-down2").addEventListener("click",(e)=>{
  if(!document.getElementById("free-drawing").classList.contains("selected")){

  originalState(e.target);
  background();
  setTimeout(()=>{originalState(transTool)},100); 
  }
})
// Z-Index Up Along Forward Action //
document.getElementById("zindex-up2").addEventListener("click",(e)=>{
  if(!document.getElementById("free-drawing").classList.contains("selected")){

  originalState(e.target);
  foreground();
  setTimeout(()=>{originalState(transTool)},100); 
  }
})
// Undo Action //
document.getElementById("undo").addEventListener("click",(e)=>{
  if(!document.getElementById("free-drawing").classList.contains("selected")){

  originalState(e.target);
  undo();
  setTimeout(()=>{originalState(transTool)},100); 
  }
})
// Redo Action //
document.getElementById("redo").addEventListener("click",(e)=>{
  if(!document.getElementById("free-drawing").classList.contains("selected")){

  originalState(e.target);
  redo();
  setTimeout(()=>{originalState(transTool)},100); 
  }
})
// Add Text Action //
document.getElementById("add-text").addEventListener("click",(e)=>{
  if(!document.getElementById("free-drawing").classList.contains("selected")){

  originalState(e.target);
  createText();
  setTimeout(()=>{originalState(transTool)},100); 
  }
})
document.getElementById("free-drawing").addEventListener("click",(e)=>{
  originalState(e.target);
  freeDraw();

})
document.getElementById("transform").addEventListener("click",(e)=>{
  originalState(e.target);

})
document.getElementById('save-img').addEventListener(
  'click',
  function () {
    var dataURL = stage.toDataURL({ pixelRatio: 3 });
    downloadURI(dataURL, 'stage.png');
  },
  false
);
document.getElementById("delete-project").addEventListener("click",()=>{
  stage.clear();
  statesAll=[];
  indexC= -1;
})
// Main Color Change //
document.getElementById("color-picker").addEventListener("change",(e)=>{
  mainColor=e.target.value;
})
// Main Size Change //
document.getElementById("size-picker").addEventListener("change",(e)=>{
  mainSize=e.target.value;
})
document.getElementById("font-size").addEventListener("change",(e)=>{
  fontSize=e.target.value;
})
document.getElementById("search-box").addEventListener("change",(e)=>{
  let valueSearch=e.target.value;
  let allImgs=document.querySelectorAll(".imgxmd");
  for(let ele of allImgs){
    if(ele.getAttribute("alt").toLowerCase().search(valueSearch)== -1){
      ele.style.display="none";
    }
  }
  if(valueSearch=="" || valueSearch==" "){
    for(let ele of allImgs){
      ele.style.display="block";
    }
  }
})
//////////////////////////////
stage.on("click",(e)=>{
  console.log(e.target)
})
