<template>
  <el-drawer
    size="70%"
    ref="drawer"
    title="支付"
    direction="ltr"
    @close="handleClose"
    :visible.sync="visible"
     :wrapperClosable="false"
  >
    <div class="content-from">
      <div class="flext-row">
        <div class="txt">支付二维码</div>
        <qrcode
          id="qrcode"
          ref="qrcode"
          :value="msg"
          :options="options"
          tag="img"
          style="position: absolute; left:-9999px;top:-99999px;"
        />
        <div v-if="makePic">
          <img :src="makePic"  style="max-width:300px;" alt="">
        </div>
        <el-button @click="getDownload" class="btn" type="primary"
          >下载图片</el-button
        >
      </div>
    </div>
    <span class="txt-warn">注意事项*1、仅支持微信支付</span>
    <div class="flex-center" style="margin: 60px 0px">
      <el-button @click="visible = false">返回</el-button>
    </div>
    <canvas class="canvasShow"  id="canvasName" ref="canvasImg" width="750" height="1334" style="position: absolute; left:-9999px;top:-99999px;"></canvas>

  </el-drawer>
</template>
<script>
import { configCode } from "@/config/env";
import VueQrcode from "@chenfengyuan/vue-qrcode";
  import BgImg1 from "@/assets/images/bg1.jpg"
  import BgImg2 from "@/assets/images/bg2.jpg"
  import BgImg3 from "@/assets/images/bg3.jpg"

  import NewBgImg1 from "@/assets/images/newbg1.jpg"
  import NewBgImg2 from "@/assets/images/newbg2.jpg"
  import NewBgImg3 from "@/assets/images/newbg3.jpg"

  import {
		parseTime
	} from "@/util/common"
import moment from "moment"
export default {
  components: {
    qrcode: VueQrcode,
  },
  props: {
    dialogData: {
      type: Object,
      default: () => ({}),
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    visible: {
      get() {
        
        return this.dialogVisible;
      },
      set(val) {
        if(!val){
            this.$emit("refreshDataList");
          }
        this.$emit("update:dialogVisible", val);
      },
    },
  },
  data() {
    return {
      msg: "undefined",
      options: {
        height: 150,
        width: 150,
        margin:0,

      },
      makePic:'',
      bol:false,
      busList: {
        5: {
          name: '舒适5座',
          prople: '4',
          trunk: '2',
          consult: '丰田卡罗拉、本田雅阁等同级别车型',
        },
        7: {
          name: '舒适7座',
          prople: '6',
          trunk: '2',
          consult: '丰田塞纳、本田奥德赛等同级别车型',
        },
        12: {
          name: '商务12座',
          prople: '11',
          trunk: '2',
          consult: '丰田海狮、高顶奔驰等同级别车型',
        },
        19: {
          name: '中巴19座',
          prople: '18',
          // trunk:'2',
          consult: '宇通、金龙、新青年或同级用车',
        },
        17: {
          name: '中巴17座',
          prople: '16',
          // trunk:'2',
          consult: '宇通、金龙、新青年或同级用车',
        },
        37: {
          name: '大巴37座',
          prople: '36',
          // trunk:'2',
          consult: '宇通、金龙、新青年或同级用车',
        },
        39: {
          name: '大巴39座',
          prople: '38',
          // trunk:'2',
          consult: '宇通、金龙、新青年或同级用车',
        },
        49: {
          name: '大巴49座',
          prople: '48',
          // trunk:'2',
          consult: '宇通、金龙、新青年或同级用车',
        }
      },
    };
  },
  mounted(){
    if (this.dialogVisible) {
      let _this =this
      this.msg =
        configCode + "?orderNo=" + this.dialogData.orderNo + "&type=1";
        console.log(this.msg,'this.msg-----')



        this.$nextTick(()=>{
          // this.$refs.canvasImg
          let canvas = document.createElement("canvas")
          canvas.width = "750"
          canvas.height = "1334"
          let ctx = canvas.getContext("2d")
          console.log(ctx,'=----',ctx.width)

          let img1 = new Image()

          console.log(this.dialogData,333333)
          if(this.dialogData.charteredCarType == 1){
            // img1.src = BgImg1
            img1.src = NewBgImg1
          }else if(this.dialogData.charteredCarType == 2 || this.dialogData.charteredCarType == 3){
            // img1.src = BgImg2
            img1.src = NewBgImg2
          }else{
            // img1.src = BgImg3
            img1.src = NewBgImg3
          }
          
          img1.width = 750
          img1.height = 1334
          img1.setAttribute('crossOrigin', 'anonymous')

          let img2 = new Image()
          let flag = true
          img1.onload = () => {
            ctx.drawImage(img1, 0, 0, 750, 1334)
            // 说明文字
            ctx.fillStyle = '#222222'
            let { busList } = this

            if(this.dialogData.charteredCarType == 1){

              ctx.font = 'bold 36px  sans-serif '
              ctx.textAlign = "center"
              let allDay = 1
              if(this.dialogData.departureEndTime){
                let startTime = moment(this.dialogData.departureStartTime,'YYYY/MM/DD').valueOf()
                let endTime = moment(this.dialogData.departureEndTime,'YYYY/MM/DD').valueOf()
                allDay = (endTime - startTime) / 24 / 3600 / 1000
              }
              ctx.fillText(`${this.dialogData.departureCity}-${allDay}日包车`,375,311+36);
              
              ctx.fillStyle = '#666666'
              ctx.font = '26px  sans-serif '
              if(this.dialogData.departureEndTime){
                ctx.fillText(`${parseTime(moment(this.dialogData.departureStartTime,'YYYY/MM/DD HH:mm:ss').valueOf(),'{y}年{m}月{d}日')}-${parseTime(moment(this.dialogData.departureEndTime,'YYYY/MM/DD HH:mm:ss').valueOf(),'{m}月{d}日')}（当地时间）`,375,383+26);
              }else{
                ctx.fillText(`${parseTime(moment(this.dialogData.departureStartTime,'YYYY/MM/DD HH:mm:ss').valueOf(),'{y}年{m}月{d}日  {h}:{i}')}（当地时间）`,375,383+26);
              }

              ctx.font = '28px  sans-serif '
              ctx.textAlign = "left"
              
              ctx.fillText(this.dialogData.departureAddress.length>15 ? (this.dialogData.departureAddress.slice(0,15) + '...') : this.dialogData.departureAddress,197,521+28);

              let busType = JSON.parse(this.dialogData.busType)

              let arr = []
              busType.forEach(element => {
                arr.push(busList[element.busType].name)
              });

              console.log(arr)
              if(arr.length<=2){
                ctx.fillText(arr.join('/'),169,600+28);
              }else{
                ctx.fillText(arr.splice(0,2).join('/')+'...',169,600+28);
              }

              ctx.fillText(this.dialogData.kilometers+'km',537,600+28);


              if(this.dialogData.childNumber){
                ctx.fillText(this.dialogData.passengerNumber+'成人 '+this.dialogData.childNumber+'儿童',169,679+28);
              }else{
                ctx.fillText(this.dialogData.passengerNumber+'成人',169,679+28);
              }

              ctx.fillText(this.dialogData.payAmount+'元',537,679+28);


              ctx.fillStyle = '#222222'
              ctx.fillText('出发地：',85,521+28);
              ctx.fillText('车型：',85,600+28);
              ctx.fillText('公里：',453,600+28);
              ctx.fillText('乘客：',85,679+28);
              ctx.fillText('金额：',453,679+28);


            }else if(this.dialogData.charteredCarType == 2 || this.dialogData.charteredCarType == 3){
              ctx.font = 'bold 36px  sans-serif '
              ctx.textAlign = "center"
              ctx.fillText('接送机',375,311+36);

            }else{
              ctx.font = 'bold 36px  sans-serif '
              ctx.textAlign = "center"
              ctx.fillText('单程包车',375,311+36);
            }

            if(this.dialogData.charteredCarType != 1){
              ctx.fillStyle = '#666666'
              ctx.font = '26px  sans-serif '
              ctx.fillText(`${parseTime(moment(this.dialogData.departureStartTime,'YYYY/MM/DD HH:mm:ss').valueOf(),'{y}年{m}月{d}日  {h}:{i}')}（当地时间）`,375,383+26);



              ctx.font = '28px  sans-serif '
              ctx.textAlign = "left"
              
              ctx.fillText(this.dialogData.departureAddress.length>15 ? (this.dialogData.departureAddress.slice(0,15) + '...') : this.dialogData.departureAddress,197,521+28);



              ctx.fillText(this.dialogData.destinationAddress.length>15 ? (this.dialogData.destinationAddress.slice(0,15) + '...') : this.dialogData.destinationAddress,197,596+28);



              console.log(this.dialogData,'----this.dialogData.busType')
              let busType = JSON.parse(this.dialogData.busType)

              let arr = []
              busType.forEach(element => {
                arr.push(busList[element.busType].name)
              });

              console.log(arr)
              if(arr.length<=2){
                ctx.fillText(arr.join('/'),169,671+28);
              }else{
                ctx.fillText(arr.splice(0,2).join('/')+'...',169,671+28);
              }

              ctx.fillText(this.dialogData.kilometers+'km',537,671+28);


              if(this.dialogData.childNumber){
                ctx.fillText(this.dialogData.passengerNumber+'成人 '+this.dialogData.childNumber+'儿童',169,746+28);
              }else{
                ctx.fillText(this.dialogData.passengerNumber+'成人',169,746+28);
              }

              ctx.fillText(this.dialogData.payAmount+'元',537,746+28);



              ctx.fillStyle = '#222222'
              ctx.fillText('出发地：',85,521+28);
              ctx.fillText('目的地：',85,596+28);

              ctx.fillText('车型：',85,671+28);
              ctx.fillText('公里：',453,671+28);
              ctx.fillText('乘客：',85,746+28);
              ctx.fillText('金额：',453,746+28);

            }

            
            // 绘制
            // ctx.draw()
            img2.src = this.$refs.qrcode.$el.src
            img2.setAttribute('crossOrigin', 'anonymous')
            img2.width = 160
            img2.height = 160
            img2.style.borderRadius = '16px'
            if (flag) {
              flag = false
            } else {
              let src = canvas.toDataURL('image/jpeg',0.5)
              _this.makePic = src

            }

            

            // this.makePic = this.$refs.qrcode.$el.src
          }

          img2.onload = () => {
            if(this.dialogData.charteredCarType == 1){
              ctx.drawImage(img2, 295, 847 , 160, 160)
            }else{
              ctx.drawImage(img2, 295, 907 , 160, 160)
            }
            if (flag) {
              flag = false
            } else {
              let src = canvas.toDataURL('image/jpeg',0.5)
              _this.makePic = src
              _this.$nextTick(()=>{
                _this.bol = true
              })
            }
          }
        })
      
    }
  },
  methods: {
    handleClose() {
      setTimeout(() => {
        this.$emit("close");
      }, 300);
    },
    // 下载二维码
    getDownload() {
      // 先找到canvas节点下的二维码图片
      // let imgURL = this.$refs.qrcode.$el.src;
      let imgURL = this.makePic
      // 创建一个a节点
      let a = document.createElement("a");
      let ua = navigator.userAgent;
      if (ua.indexOf("Trident") != -1 && ua.indexOf("Windows") != -1) {
        // IE内核 并且  windows系统 情况下 才执行;
        var bstr = atob(imgURL.split(",")[1]);
        var n = bstr.length;
        var u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        var blob = new Blob([u8arr]);
        window.navigator.msSaveOrOpenBlob(blob, "下载" + "." + "png");
      } else if (ua.indexOf("Firefox") > -1) {
        //火狐兼容下载
        let blob = this.base64ToBlob(imgURL); //new Blob([content]);
        let evt = document.createEvent("HTMLEvents");
        evt.initEvent("click", true, true); //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
        a.download = " "; //下载图片名称，如果填内容识别不到，下载为未知文件，所以我这里就不填为空
        a.href = URL.createObjectURL(blob);
        a.dispatchEvent(
          new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window,
          })
        ); //兼容火狐
      } else {
        //谷歌兼容下载
        a.href = imgURL;
        //设置下载文件的名字
        a.download = "下载";
        //点击
        a.click();
      }
    },
  },
};
</script>

<style scoped lang="scss">
.content-from {
  margin: 0 30px;
  max-height: 90vh;
  overflow-y: scroll;
}
.flext-row {
  display: flex;
  flex-direction: row;
  margin-bottom: 30px;
}

.txt {
  font-size: 20px;
  font-weight: bold;
  margin-right: 30px;
}

.code {
  background-color: aqua;
}

.btn {
  width: 160px;
  height: 35px;
  margin-left: 30px;
  margin-top: 265px;
}

.txt-warn {
  margin: 30px;
  color: red;
  font-size: 20px;
  font-weight: bold;
}
</style>