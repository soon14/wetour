<template>
  <div class="mod-config">
    <basic-container>
      <div class="filter-container">
        <!-- 车辆类型 -->
        <!-- <el-select
          v-model="searchForm.busType"
          style="width: 140px"
          class="filter-item"
          filterable clearable
        >
          <el-option :value="''" label="全部类型" />
          <el-option
            v-for="item in busTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select> -->
        <el-input
          v-model="searchForm.id"
          placeholder="请输入ID"
          style="width: 140px"
          class="filter-item"
          maxlength="10"
          @keyup.native.enter="currentChangeHandle(1)"
        />
        <el-input
          v-model="searchForm.templateTitle"
          placeholder="请输入名称"
          style="width: 140px"
          class="filter-item"
          maxlength="10"
          @keyup.native.enter="currentChangeHandle(1)"
        />
        
       
        <el-select
          v-model="searchForm.businessTypeList"
          style="width: 180px"
          class="filter-item"
          filterable
          multiple
          collapse-tags
          placeholder="全部"
          clearable
        >
          <el-option :value="1" label="wetour旅游" />
          <el-option :value="2" label="微巴士出行" />
          
        </el-select>

        <el-select
          v-model="searchForm.couponTypeList"
          style="width: 180px"
          class="filter-item"
          filterable
          multiple
          collapse-tags
          placeholder="全部"
          clearable
        >
          <el-option :value="1" label="满减券" />
          <el-option :value="2" label="满折券" />
          
        </el-select>
        <el-select
          v-model="searchForm.templateStatusList"
          style="width: 180px"
          class="filter-item"
          filterable
          multiple
          collapse-tags
          placeholder="全部"
          clearable
        >
          <el-option :value="1" label="待上架" />
          <el-option :value="2" label="已上架" />
          <el-option :value="3" label="已下架" />
          <el-option :value="4" label="已结束" />
          
        </el-select>

        <el-date-picker
          size="small"
          type="daterange"
          v-model="cartTime"
          range-separator="至"
          value-format="yyyy-MM-dd"
          end-placeholder="结束日期"
          start-placeholder="开始日期"
          style="margin-bottom: 10px; vertical-align: middle; margin-left: 10px"
        />
        
        <el-button
          type="primary"
          class="filter-item"
          icon="el-icon-search"
          @click="currentChangeHandle(1)"
          >搜索</el-button
        >
        <el-button
          class="filter-item"
          @click="resetForm"
          >重置</el-button
        >
        <el-button
          v-if="permissions.webus_market_template_add"
          icon="el-icon-plus"
          type="primary"
          class="filter-item"
          @click="addOrUpdateHandle(0,'create')"
          >新增</el-button
        >
        <!-- <el-button
            v-if="permissions.busadmin_driver_export"
            icon="el-icon-download"
            type="primary"
            plain
            class="filter-item"
            @click="exportExcel()"
            >导出</el-button
          > -->
      </div>

      <div class="avue-crud">
        <el-table :data="dataList" border v-loading="dataListLoading">
          <el-table-column
            prop="id"
            header-align="center"
            align="center"
            label="模板ID"
          >
          </el-table-column>
          <el-table-column
            prop="templateTitle"
            header-align="center"
            align="center"
            label="优惠券模板名称"
          >
          </el-table-column>
          <el-table-column
            prop="couponTypeShow"
            header-align="center"
            align="center"
            label="类型"
          >
          </el-table-column>
          <el-table-column
            prop="releaseQuantity"
            header-align="center"
            align="center"
            label="总数量"
          >
          </el-table-column>
          <el-table-column
            prop="surplusQuantity"
            header-align="center"
            align="center"
            label="剩余"
          >
          </el-table-column>
          <!-- <el-table-column
            prop="busType"
            header-align="center"
            align="center"
            label="车型"
          >
            <template slot-scope="scope">
               {{scope.row.busType | busTypeFil}}
            </template>
          </el-table-column> -->
          <el-table-column
            prop="busTypeTitle"
            header-align="center"
            align="center"
            label="优惠额度"
          >
            <template slot-scope="scope">
               {{scope.row.couponType == 1 ? scope.row.reduceRealAmount : (scope.row.discount +'折') }}
            </template>
            <!-- reduce_amount -->
          </el-table-column>

            
          <el-table-column
            prop="businessTypeShow"
            header-align="center"
            align="center"
            label="使用端口"
          >
          </el-table-column>

          <el-table-column
            prop="useTypeShow"
            header-align="center"
            align="center"
            label="发放方式"
          >
          </el-table-column>


          
          <el-table-column
            prop="templateStatusShow"
            header-align="center"
            align="center"
            label="状态"
          >
          </el-table-column>
          <el-table-column
            prop="createTime"
            header-align="center"
            align="center"
            label="创建时间"
          >
          </el-table-column>
         
          <el-table-column header-align="center" align="center" label="操作" width="160">
            <template slot-scope="scope">
              <el-button
                v-if="permissions.webus_market_template_edit"
                type="text"
                size="small"
                :disabled="scope.row.templateStatus != 3 && scope.row.templateStatus != 1"
                @click="
                  addOrUpdateHandle(
                    scope.row.id,
                    scope.row.templateStatus == 3 ? 'smallEdit' : scope.row.templateStatus == 1 ? 'edit' :''
                  )
                "
                >编辑</el-button
              >

              <el-button
                v-if="scope.row.templateStatus == 2  && permissions.webus_market_template_change"
                type="text"
                size="small"
                @click="
                  undercarriage(
                    scope.row,
                  )
                "
                >下架</el-button
              >

              <el-button
                v-if="(scope.row.templateStatus == 3 || scope.row.templateStatus == 1)  && permissions.webus_market_template_change"
                type="text"
                size="small"
                @click="
                  adoptHandle(
                    scope.row,
                  )
                "
                >上架</el-button
              >

              <el-button
                v-if="
                (scope.row.useType == 3 &&  permissions.webus_market_exchangekey_view) ||
                (scope.row.useType == 1 &&  permissions.busadmin_coupon_send) ||
                (scope.row.useType == 2 &&  permissions.webus_market_activity_view)
                "
                :disabled="scope.row.templateStatus != 2 "
                type="text"
                size="small"
                @click="
                  launchHandle(
                    scope.row,
                  )
                "
                >发放</el-button
              >

              <el-button
                v-if="permissions.webus_market_template_view"
                type="text"
                size="small"
                @click="
                  addOrUpdateHandle(
                    scope.row.id,
                    'look'
                  )
                "
                >查看</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="avue-crud__pagination">
        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="totalPage"
          background
          layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
      </div>
      <el-dialog
        title="下架"
        :visible.sync="dialogFormVisible"
        :before-close="handleAppleClose"
        append-to-body
        width="600px"
      >
        <!-- :center="true"   居中 -->
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="temp"
          label-position="right"
          label-width="100px"
        >
          <!-- <el-form-item label="票价设置：" prop="price">
            <el-input
              v-model="temp.price"
              placeholder="请输入票价"
              style="width: 180px"
            >
            </el-input>
          </el-form-item> -->
         
          <el-form-item label="下架原因：" prop="soldOutReason">
            <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 4 }"
              placeholder="请输入下架原因"
              maxlength="50"
              show-word-limit
              v-model="temp.soldOutReason"
            >
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="setUndercarriage">确定</el-button>
        </div>
      </el-dialog>
      <!-- 弹窗, 新增 / 修改 -->
      <!-- <table-form
        v-if="addOrUpdateVisible"
        ref="addOrUpdate"
        @refreshDataList="getDataList"
      ></table-form> -->
      <table-form
        v-if="addOrUpdateVisible"
        :dialogVisible.sync="addOrUpdateVisible"
        :dialogData="dialogData"
        :dialogType="dialogType"
        @refreshDataList="getDataList"
        @close="addOrUpdateVisible = false"
      ></table-form>

      <LaunchForm
        v-if="launchVisible"
        :dialogVisible.sync="launchVisible"
        :dialogData="dialogData"
        @refreshDataList="getDataList"
        @close="launchVisible = false"
      ></LaunchForm>

      <ActivityForm
        v-if="activityVisible"
        :dialogVisible.sync="activityVisible"
        :dialogData="dialogData"
        @refreshDataList="getDataList"
        @close="activityVisible = false"
      ></ActivityForm>
      <ExchangeForm
        v-if="exchangeVisible"
        :dialogVisible.sync="exchangeVisible"
        :dialogData="dialogData"
        @refreshDataList="getDataList"
        @close="exchangeVisible = false"
      ></ExchangeForm>
      
    </basic-container>
  </div>
</template>

<script>
import { fetchList, getObj, updateStatusById } from "@/api/market/template";
import TableForm from "./bus-form";
import LaunchForm from "./launch-form";
import ActivityForm from "./activity-form";
import ExchangeForm from "./exchange-form";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      temp: {
        soldOutReason: "",
      },
      rules: {
        soldOutReason: [
          {
            required: true,
            message: "驳回原因不能为空",
            trigger: "blur",
          },
        ],
      },
      cartTime: [],
      searchForm: {
        id:'',
        templateTitle:'',
        businessType:[],
        couponTypeList:[],
        templateStatusList:[1,2],
        createStartTime:'',
        createEndTime:"",
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateVisible: false,
      launchVisible:false,
      activityVisible:false,
      // launchVisible:false,
      exchangeVisible:false,
      dialogType:'',
      dialogData:{},
      dialogFormVisible:false,
    };
  },
  filters:{
    busTypeFil(val){
      const map = {
        1:'5座',
        2:'7座',
        3:'12座',
        4:'17座',
        5:'37座',
      }
      return map[val]
    },
    insuranceExpiredStatusFil(val){
      const map = {
        1:'已过期',
        0:'未过期',
      }
      return map[val]
    },
  },
  components: {
    TableForm,
    LaunchForm,
    ActivityForm,
    ExchangeForm,
  },
  created() {
    this.getDataList();
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  methods: {
    undercarriage(row) {
      this.dialogData = row
      this.dialogFormVisible = true;
    },
    setUndercarriage(){
      // 下架
      this.$refs["dataForm"].validate((valid) => {
        if(valid){
          let data = {
            id:this.dialogData.id,
            soldOutReason:this.temp.soldOutReason,
            templateStatus:3,
          }
          updateStatusById(data).then(res=>{
            this.$message.success(`下架成功`);
            this.getDataList();
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleAppleClose() {
      this.dialogFormVisible = false;
    },
    launchHandle(row){
      this.dialogData = row
      if(row.useType == 1){
        this.launchVisible = true
      }else if(row.useType == 3) {
        this.exchangeVisible = true
      }else if(row.useType == 2) {
        getObj(row.id).then(response=>{
          let data = Object.assign({},response.data.data)
          this.dialogData = data
          this.activityVisible = true

        })
      }
    },
    adoptHandle(row) {
      let id = row.id;
      this.$confirm(
        `上架后，优惠券开放各渠道的领取。用户可以开始领取优惠券`,
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return updateStatusById({ id, templateStatus: 2 });
        })
        .then((data) => {
          this.$message.success("上架成功");
          // this.$emit("refreshDataList");
          // this.visible = false;
          this.getDataList();
        });
    },
    resetForm(){
      this.searchForm = {
        id:'',
        templateTitle:'',
        businessType:[],
        couponTypeList:[],
        templateStatusList:[1,2],
        createStartTime:'',
        createEndTime:"",
      }
      this.cartTime = []
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      if (this.cartTime && this.cartTime.length) {
        this.searchForm.createStartTime = this.cartTime[0] + " 00:00:00";
        this.searchForm.createEndTime = this.cartTime[1] + " 23:59:59";
      } else {
        this.searchForm.createStartTime = undefined;
        this.searchForm.createEndTime = undefined;
      }

      let searchForm  = Object.assign({},this.searchForm)
      searchForm.businessType = searchForm.businessType.join(',')
      searchForm.couponTypeList = searchForm.couponTypeList.join(',')
      searchForm.templateStatusList = searchForm.templateStatusList.join(',')
      
      fetchList(
        Object.assign({
          current: this.pageIndex,
          size: this.pageSize,
          ...searchForm,
        })
      ).then((response) => {
        this.dataList = response.data.data.records;
        this.totalPage = response.data.data.total;
      });
      this.dataListLoading = false;
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    // 新增 / 修改
    addOrUpdateHandle(id,type) {
      // this.addOrUpdateVisible = true;
      // this.$nextTick(() => {
      //   this.$refs.addOrUpdate.init(id,type);
      // });

      // this.dialogType = 'create'
      this.dialogType = type
      if(id != 0){
        getObj(id).then(response=>{
          let data = Object.assign({},response.data.data)
          // this.dialogData = data


          if(data.useType != 1){
            data.time = [data.startTime.split(' ')[0],data.endTime.split(' ')[0]]
          }else{
            data.endTime = data.endTime.split(' ')[0]
          }

          if(data.deadlineType == 1){
            data.couponTime = [data.couponStartTime.split(' ')[0],data.couponEndTime.split(' ')[0]]
          }
          data.cityConfig = data.cityConfig?data.cityConfig.split(","):[]
          data.busTypeConfig = data.busTypeConfig?data.busTypeConfig.split(","):[]
          data.charteredTypeConfig = data.charteredTypeConfig?data.charteredTypeConfig.split(","):[]
          data.weekConfig = data.weekConfig?data.weekConfig.split(","):[]

          // if(data.businessType == 2){
            data.lineConfig = data.lineConfig?data.lineConfig.split(","):[]
          // }




        console.log(5555555,data)
          this.dialogData = data
          this.$nextTick(() => {
            this.addOrUpdateVisible = true;
          });

        })
      }else{
        this.addOrUpdateVisible = true;
      }
      // this.addOrUpdateVisible = true;
      

      
    },
    // 删除
    deleteHandle(id) {
      this.$confirm("是否确认删除ID为" + id, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delObj(id);
        })
        .then((data) => {
          this.$message.success("删除成功");
          this.getDataList();
        });
    },
    //  导出excel
    exportExcel() {
      this.downBlobFile("/busadmin/bus/export", this.searchForm, "bus.xlsx");
    },
  },
};
</script>

<style lang="scss" scoped>
  .imgs{
    max-width: 200px;
  }
  .imgBox{
    text-align: center;
    margin-right: 10px;
  }
  .wrap{
    flex-wrap: wrap;
  }
</style>