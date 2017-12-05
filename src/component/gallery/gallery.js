//Greeter.js



import React,{Component} from "react";
import ReactDOM from 'react-dom';


import styles from './gallery.scss';

import imageJsonData from "./data/imageData.json";


//获取图片相关数据，将图片名信息转成图片URL路径
var imageData  = (function (arr){
    for(var i=0; i<arr.length;i++ ){
        arr[i].imageUrl = require("./images/" + arr[i].fileName);
       
    }

    return arr;
 
})(imageJsonData);

class ImgFigure extends Component{
    /**
     * imgFigure的点击处理函数
     */
    constructor(props) {
        super(props);
      
        this.handleClick = this.handleClick.bind(this);
    }
    
    handleClick(e) {

        if(this.props.arrange.isCenter){
            this.props.inverse();
        }else{
            this.props.center();
        }
        
 
        e.preventDefault();
        e.stopPropagation();
    }
    
    render(){
        

        let styleObj = {};
        if(this.props.arrange.pos){
            Object.assign(styleObj,this.props.arrange.pos);
            //styleObj = this.props.arrange.pos;
        }

        /*
        * 图片的旋转
        */

        // 如果图片的旋转角度有值并且不为0，添加旋转角度。
        if(this.props.arrange.rotate){
            (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach((value,index)=>{
                styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
               //console.log('rotate(' + this.props.arrange.rotate + 'deg)');
            })
            
        }

        if(this.props.arrange.isCenter){
            styleObj.zIndex = 11;
        }

        var imgFigureClassName = "img-figure";
        imgFigureClassName += this.props.arrange.isInverse ? " is-inverse" : "";

        return (
            <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
                <img src={this.props.data.imageUrl} alt={this.props.data.title}/>
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                    <div className="img-back" onClick={this.handleClick}>
                        <p>{this.props.data.desc}</p>
                    </div>
                </figcaption>
            </figure>
        );
    }
}

class ControllerUnit extends React.Component{
    constructor(props){
        super(props);


    }
    handleClick = (e) => {

        if(this.props.arrange.isCenter){
            this.props.inverse();
        }else{
            this.props.center();
        }

        e.preventDefault();
        e.stopPropagation();
    }

    render(){
        let controllerUnitClassName = "controller-unit";
        if(this.props.arrange.isCenter){
            controllerUnitClassName += " is-center";

            if(this.props.arrange.isInverse){
                controllerUnitClassName += " is-inverse";
            }
        } 
        return (
            <span className={controllerUnitClassName} onClick={this.handleClick}></span>
        );
    }
}

class Gallery extends Component{
    constructor(props){
        super(props);

        this.inverse = this.inverse.bind(this);
        this.center = this.center.bind(this);

        this.state = {
            imgsArrangeArr:[]
        }

        this.Constant = {
            centerPos:{
                left:0,
                right:0
            },
            hPosRange:{//水平方向取值范围
                leftSecX:[0,0],
                rightSecX:[0,0],
                y:[0,0]
            },
            vPosRange:{//垂直方向取值范围
                x:[0,0],
                topY:[0,0]
            }
        };
    }

    //组件加载后,为每张图片计算其位置范围
    componentDidMount(){
        var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
            stageW = stageDOM.scrollWidth,
            stageH = stageDOM.scrollHeight,
            halfStageW = Math.ceil(stageW / 2),
            halfStageH = Math.ceil(stageH / 2);

            //拿到imageFigure的大小
            var imgFigureDDM = ReactDOM.findDOMNode(this.refs.imgFigure0),
                imgW = imgFigureDDM.scrollWidth,
                imgH = imgFigureDDM.scrollHeight,
                halfImgW = Math.ceil(imgW / 2),
                halfImgH = Math.ceil(imgH / 2);
            
            //计算中心图片的位置点
            this.Constant.centerPos = {
                left: halfStageW - halfImgW,
                top: halfStageH - halfImgH
            }

            //计算左侧、右侧区域图片排布位置的取值范围
            this.Constant.hPosRange.leftSecX[0] = -halfImgW;
            this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
            this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
            this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
            this.Constant.hPosRange.y[0] = -halfImgH;
            this.Constant.hPosRange.y[1] = stageH - halfImgH;

            //计算上侧区域图片排布位置的取值范围
            this.Constant.vPosRange.topY[0] = -halfImgH;
            this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
            this.Constant.vPosRange.x[0] = halfStageW - imgW;
            this.Constant.vPosRange.x[1] = halfStageW ;

            this.rearrange(0);


    }
    /*
    *获取区间内的一个随机值
    */
    getRangeRandom(low,high){
        return Math.ceil(Math.random() * (high - low) + low);
    }

    /*
    *获取 0-30 之间的任意正负值
    */
    get30DegRandom(){
        return (Math.random() > 0.5 ? '' : '-' ) + Math.ceil(Math.random() * 30)
    }

    /*
    * 重新布局所有图片
    */
    rearrange(centerIndex){
        var imgsArrangeArr = this.state.imgsArrangeArr,
            Constant = this.Constant,
            
            // 中间图片的位置
            centerPos = Constant.centerPos,
            
            // 左右两边图片的取值范围
            hPosRange = Constant.hPosRange,
            hPosRangeLeftSecX = hPosRange.leftSecX,
            hPosRangeRightSecX = hPosRange.rightSecX,
            hPosRangeY = hPosRange.y,

             // 上边图片的取值范围
            vPosRange = Constant.vPosRange,
            vPosRangeTopY = vPosRange.topY,
            vPosRangeX = vPosRange.x;

           

            // 取出要布局中央的图片的位置信息,拿到中间图片后把中间图片的状态信息从数组里删除
            let imgsArrangeCenterArr = [];
            imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

            //首先居中centerIndex的图片,不需要旋转
            imgsArrangeCenterArr[0] = {
                pos:centerPos,
                rotate:0,
                isCenter:true
            };
                
            
            /* 
            * 上边图片的布局
            */

            let imgsArrangeTopArr = [];// 存储放在上边区域的图片状态信息
            let topImgNum = Math.floor(Math.random() * 2);//取0张或一张

            // 取出要布局上侧图片的位置信息
            let topImgSpliceIndex = 0;//从哪个index开始取图片


            //取出要布局上侧的图片的状态信息
            topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
            imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

            //布局位于上侧的图片
            imgsArrangeTopArr.forEach((value,index) => {
                imgsArrangeTopArr[index] = {
                    pos:{
                        left:this.getRangeRandom(vPosRangeX[0], vPosRangeX[1]),
                        top:this.getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1])
                        
                    },
                    rotate:this.get30DegRandom(),
                    isCenter: false
                }
            });

            /**
             * 布局左右两侧的图片
             */
            // 上面已经剔除了中间、上面图片的位置信息，所以这里不用做剔除了
            for(var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++){
                // 前半部分布局左边，右半部分布局右边
                var hPostRangeLOrX = null;
                if(i < k){
                    hPostRangeLOrX = hPosRangeLeftSecX;
                }else{
                     hPostRangeLOrX = hPosRangeRightSecX;
                }

                imgsArrangeArr[i] = {
                    pos:{
                        left:this.getRangeRandom(hPostRangeLOrX[0],hPostRangeLOrX[1]),
                        top: this.getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
                        
                    },
                    rotate:this.get30DegRandom(),
                    isCenter:false
                }
            }

            // // 把取出来的上边的图片位置信息放回去
            if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
                imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0])
            }

            // 把取出来的中央的图片位置信息放回去
            imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

            // 触发component的重新渲染
            this.setState({
                imgsArrangeArr:imgsArrangeArr
            });

        
    }

    /**
     * 翻转图片
     * @param index 
     */
    inverse(index){
        return () =>{
            
            let imgsArrangeArr = this.state.imgsArrangeArr;
            imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
           
            this.setState({
                imgsArrangeArr:imgsArrangeArr
            });
        }
    }

    center(index){
        return ()=>{
            this.rearrange(index);
        }
    }
    
    render(){
        var controllerUnits = [],
            imgFigures = [];
 
        imageData.forEach((value,index) => {

            if(!this.state.imgsArrangeArr[index]){
                this.state.imgsArrangeArr[index] = {
                    pos:{
                        left:0,
                        top:0
                    },
                    rotate:0,
                    isInverse:false,
                    isCenter:false
                }
            }

            imgFigures.push(<ImgFigure key={index} data={value}  ref={"imgFigure" + index} 
                                    arrange={this.state.imgsArrangeArr[index]} 
                                    inverse={this.inverse(index)}
                                    center={this.center(index)} />);

            controllerUnits.push(<ControllerUnit  key={index} 
                                    arrange={this.state.imgsArrangeArr[index]}
                                    inverse={this.inverse(index)}
                                    center={this.center(index)} />);


        });


        return (
             <section className="stage" ref="stage">
                    <section className="img-sec">
                        {imgFigures}
                    </section>
                    <section className="controller-nav">
                        {controllerUnits}
                    </section>
            </section>

            
        );
    }
}
 
export default Gallery;