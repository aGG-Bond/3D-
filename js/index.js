let project = {
    num: 125,   // li 的个数
    lastXDeg: 0,    // 设置初始旋转角度
    lastYDeg: 0,
    xDeg: 0,
    yDeg: 0,
    lastX: 0,   //存放上一次鼠标的位置
    lastY: 0,
    moveX: 0,
    moveY: 0,
    moveZ: 0,
    isMoved: false,
    squareInfo: {   // 矩阵场景
        x: 200,
        y: 200,
        z: 200,
    },
    helixInfo: {    // 螺旋体
        n: 3,
        moveZ: 800,
        y: 20,
    },
    tableInfo: {
        x: 150,
        y: 200,
    },
    circleInfo: {
        r: 800,
    },
    $(select) {
        return document.querySelector(select);
    },
    init() {
        // 创建 num 个 li
        this.createItems();
        // 随机方位
        this.setItems();
        this.ul.addEventListener('mousedown',this.handleMousedown.bind(this));
        // 滚轮事件
        document.addEventListener('mousewheel',this.handleMouseWheel.bind(this));
        this.$('.list').addEventListener('click',this.handleClick.bind(this));
    },
    setItems() {
        for(let i=0;i<this.num;i++) {
            let x = Math.random()*4000 - 2000;  // [2000,-2000]
            let y = Math.random()*4000 - 2000;
            let z = Math.random()*4000 - 2000;
            this.ul.children[i].style.transform = `translate3D(${x}px,${y}px,${z}px)`;
        }
        // 开场执行矩阵
        setTimeout(()=>this.square(),1000);
    },
    handleClick(e) {
        let id = e.target.id;
        if(id) this[id]();
    },
    square() {
        for(let i=0;i<this.num;i++) {
            /*
            *   li 的索引和参考水平方向的关系
            *
            *   i   x       i   x
            *   0   -2      5   -2
            *   1   -1      6   -1
            *   2   0       7   0
            *   3   1       8   1
            *   4   2       9   2
            *
            *   li的索引和参考物竖直方向的关系
            *   i       y       i       y
            *   0-4     -2      25-29   -2
            *   5-9     -1
            *   10-14   0
            *   15-19   1
            *   20-24   2
            *
            *   li的索引和参考物垂直方向的关系
            *   i           z
            *   0-24        -2
            *   25-49       -1
            *   50-74       0
            *   75-99       1
            *   100-124     2
            *
            * */
            let disx = i%5-2;
            let disy = parseInt(i%25/5)-2;
            let disz = parseInt(i/25)-2;
            let {x,y,z} = this.squareInfo;
            this.ul.children[i].style.transform =
                `translate3D(${x * disx}px,${y * disy}px,${z * disz}px)`;
        }
    },
    circle() {
        let arr = [1, 3, 7, 9, 11, 14, 21, 20, 12, 10, 9, 7, 1];
        let n = 0;
        let {r} = this.circleInfo;
        /*
        *   第一层 li x轴旋转 90deg
        *
        *   中间的 li x轴旋转 0deg
        *
        *   底部 li x轴旋转 -90deg / 90+180deg
        * */
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr[i]; j++) {
                let yDeg = j * 360 / arr[i];
                let xDeg = 90 + 180 * i / (arr.length - 1);
                this.ul.children[n++].style.transform =
                    `rotateY(${yDeg}deg) rotateX(${xDeg}deg) translateZ(${r}px)`;
            }
        }
    },
    helix() {
        let {n,moveZ,y} = this.helixInfo;
        for(let i=0;i<this.num;i++) {
            let yDeg = i*n*360/this.num;
            let moveY = parseInt(this.num/2)-i;
            this.ul.children[i].style.transform =
                `rotateY(${yDeg}deg) translateZ(${moveZ}px) translateY(${moveY*y}px)`;
        }
    },
    random() {
        let arr = [];
        for(let i=0;i<this.num;i++) arr.push(i);
        arr.sort((a,b) => Math.random()-0.5 );
        for(let j=0;j<this.num;j++) {
            this.ul.children[ arr[j] ].style.transform =
                getComputedStyle(this.ul.children[j]).transform;
        }
    },
    table() {
        let arr = [
            {x:-8,y:-3},
            {x: 9,y:-3},
            {x:-8,y:-2},
            {x:-7,y:-2},
            {x: 4,y:-2},
            {x: 5,y:-2},
            {x: 6,y:-2},
            {x: 7,y:-2},
            {x: 8,y:-2},
            {x: 9,y:-2},
            {x:-8,y:-1},
            {x:-7,y:-1},
            {x: 4,y:-1},
            {x: 5,y:-1},
            {x: 6,y:-1},
            {x: 7,y:-1},
            {x: 8,y:-1},
            {x: 9,y:-1},
        ];
        for(let i=0;i<this.num;i++) {
            arr.push( {
                x: i%18-8,
                y: parseInt(i/18)-1,
            })
        }
        let {x,y} = this.tableInfo;
        for(let j=0;j<this.num;j++) {
            this.ul.children[j].style.transform = `translate3D(${arr[j].x*x}px,${arr[j].y*y}px,0)`;
        }
    },
    handleMouseWheel(e) {
        let wheelDelta = e.wheelDelta;
        if(wheelDelta>0) {
            this.moveZ += 100;
            this.moveZ = this.moveZ>1000?1000:this.moveZ;
        } else {
            this.moveZ -=100;
            this.moveZ = this.moveZ<-6000?-6000:this.moveZ;
        }
        this.$('#box').style.transform = `translateZ(${this.moveZ}px)`;
    },
    handleMousedown(e) {
        this.isMoved = false;
        clearInterval(this.timer);
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.handleMousemove = this.handleMousemove.bind(this);
        this.handleMouseup = this.handleMouseup.bind(this);
        document.addEventListener('mousemove',this.handleMousemove);
        document.addEventListener('mouseup',this.handleMouseup);
    },
    handleMousemove(e) {
        if(this.startX === e.clientX && this.startY === e.clientY) return;
        this.isMoved = true;
        this.yDeg = (e.clientX - this.startX) * 0.15 + this.lastYDeg;
        this.xDeg = (e.clientY - this.startY) * 0.15 + this.lastXDeg;
        this.ul.style.transform = `rotateY(${this.yDeg}deg) rotateX(${-this.xDeg}deg)`;
        // 缓冲
        this.moveX = (e.clientX - this.lastX) * 0.1;
        this.moveY = (e.clientY - this.lastY) * 0.1;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
    },
    handleMouseup() {
        // 鼠标抬起时，记录旋转角度
        this.lastYDeg = this.yDeg;
        this.lastXDeg = this.xDeg;
        this.timer = setInterval(this.buffer.bind(this),20);
        document.removeEventListener('mousemove',this.handleMousemove);
        document.removeEventListener('mouseup',this.handleMouseup);
    },
    buffer() {
        if(!this.isMoved) return;
        // 图片减速
        this.moveX *= 0.9;
        this.moveY *= 0.9;
        // this.lastXDeg += this.moveY;
        // this.lastYDeg += this.moveX;
        this.lastXDeg = this.lastXDeg + this.moveY;
        this.lastYDeg = this.lastYDeg + this.moveX;
        this.ul.style.transform =
            `rotateY(${this.lastYDeg}deg) rotateX(${-this.lastXDeg}deg)`;
        if (Math.abs(this.moveX) <= 0.5 && Math.abs(this.moveY) <= 0.5) {
            clearInterval(this.timer);
        }
    },
    createItems() {
        this.ul = document.createElement('ul');
        for(let i=0;i<this.num;i++) {
            let li = document.createElement('li');
            li.innerText = i;
            this.ul.appendChild(li);
        }
        this.$('#box').appendChild(this.ul);
    }

}
project.init();