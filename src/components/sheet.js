import React from 'react';
import {Link} from 'react-router-dom';
import Styles from '../styles';
import pen from '../helpers/pen';

class Sheet extends React.Component {
  constructor() {
    super();
    this.args = {actions:[],
                 dragging: false,
                 latestActionNum: 0,
                 thickns: 10,
                 natWidth:0,
                 natHeight:0,
                 width:0,
                 height:0,
                 cornerX:0,
                 cornerY:0,
                 context:null,
                 canvas:null,
                 image:null,
                }
  }

  componentDidMount(){
    this.args.canvas = document.getElementById('myCanvas');
    this.args.context = this.args.canvas.getContext('2d');
    this.args.image = new Image();
    this.args.image.src = this.props.imageURL;
    this.args.image.onload = () => {
      this.args.width = 500;
      this.args.height = 500;
      this.args.cornerX=0;
      this.args.cornerY=0;
      this.args.natWidth = this.args.image.naturalWidth;
      this.args.natHeight = this.args.image.naturalHeight;
      const aspRat = this.args.natWidth/this.args.natHeight;
      if(aspRat>1){
        this.args.width = 500;
        this.args.height = 500*(1/aspRat);  
        this.args.cornerY = (500-this.args.height)/2;
      }else{
        this.args.width = 500*(aspRat);
        this.args.height = 500;
        this.args.cornerX  = (500-this.args.width)/2;
      }
      this.drawBase(this.args.context);
    }
    console.log("mounted");
  }

  shouldComponenetUpdate(){
    return false;
  }
  //returns mouse position relative to canvas
  getMousePos(canvas, ev){
    const rect = canvas.getBoundingClientRect();
      return {
        x: ev.clientX - rect.left,
        y: ev.clientY - rect.top
      };
  }

  //when mouse held down starts line
  handleMouseDown(ev){
      pen.penMouseDown(this, ev);  
    console.log("handle mouse down");
  }

  handleMouseMove(ev){
     pen.penMouseMove(this, ev);
  }

  handleMouseUp(){
    this.args.dragging = false;
  }

  dot(x, y, context, color){
    console.log("dot");
    console.log("color   " + color);
    context.beginPath();
    context.arc(x, y, this.args.thickns/2, 0, 2 * Math.PI);
    context.fillStyle = color;
    context.fill();
  }

  drawBase(context){
     context.drawImage(
        this.args.image,
        0,0,this.args.natWidth,this.args.natHeight,
        this.args.cornerX, this.args.cornerY,this.args.width,this.args.height
    );
  }

  //draws the image with lines
  draw(context, actions){
    console.log("main draw function");
    this.drawBase(context);
    let actionNum = 0;
    for(actionNum; actionNum<actions.length; actionNum++){
      if(actions[actionNum].type == 'line'){
        pen.drawSingleLine(actions[actionNum].points, actions[actionNum].color, context, this);
      }
    }
  }

  render() {
    return (
      <div style={{
        width: '100%',
        textAlign:'center',
        height: '500',
        border: '1px solid #000000',
        background: Styles.white,
        display: 'block',
        justifyContent: 'center',
      }}>
        <canvas 
          id="myCanvas" 
          height={500} 
          width={500} 
          onMouseDown={this.handleMouseDown.bind(this)}
          onMouseMove={this.handleMouseMove.bind(this)}
          onMouseUp={this.handleMouseUp.bind(this)}
          style={{
            display : 'block',
            margin: 'auto',
          }}/>
      </div>
    );
  }
}

export default Sheet;
