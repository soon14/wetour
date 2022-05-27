<template>
  <div class="mod-config">
    <basic-container>
      <div class="filter-container">
        <el-input
          v-model.trim="searchForm.contact"
          placeholder="请输入姓名/手机号"
          style="width: 140px"
          class="filter-item"
          maxlength="20"
          @keyup.native.enter="currentChangeHandle(1)"
        />

        <!-- <el-date-picker
          type="date"
          placeholder="请选择创建时间"
          v-model="searchForm.cartTime"
          style="margin-bottom: 10px; vertical-align: middle; margin-left: 10px"
        >
        </el-date-picker> -->
         <el-date-picker
          v-model="createTimes"
          value-format="yyyy-MM-dd"
          type="daterange"
          style="margin-bottom: 10px;vertical-align: middle;margin-left: 10px;"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="small"
          :editable="false"
          :picker-options="pickerOptions"
          
        />
        <el-select
          v-model="searchForm.visitStatus"
          style="width: 140px"
          class="filter-item"
          filterable
          clearable
        >
          <el-option :value="''" label="全部状态" />
          <el-option :value="0" label="待回访" />
          <el-option :value="1" label="已回访" />
        </el-select>

        <el-button
          type="primary"
          class="filter-item"
          icon="el-icon-search"
          @click="currentChangeHandle(1)"
          >搜索</el-button
        >
        <el-button class="filter-item" @click="resetForm">重置</el-button>
      </div>
      <div class="avue-crud">
        <el-table :data="dataList" border v-loading="dataListLoading">
          <el-table-column
            prop="id"
            header-align="center"
            align="center"
            label="ID"
          ></el-table-column>
          <el-table-column
            prop="username"
            header-align="center"
            align="center"
            label="称呼"
          ></el-table-column>
          <el-table-column
            prop="mobile"
            header-align="center"
            align="center"
            label="联系号码"
          ></el-table-column>
          <el-table-column
            prop="city"
            header-align="center"
            align="center"
            label="目的地"
          ></el-table-column>
          <el-table-column
            prop="source"
            header-align="center"
            align="center"
            label="来源"
          >
           <template slot-scope="scope">
              {{ scope.row.source|sourceFil }} 
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            header-align="center"
            align="center"
            label="提交时间"
          ></el-table-column>
          <el-table-column
            prop="visitStatus"
            header-align="center"
            align="center"
            label="回访状态"
          >
             <template slot-scope="scope">{{scope.row.visitStatus|statusFil}}</template>
          </el-table-column>
          <el-table-column
            header-align="center"
            width="120"
            align="center"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="onVisit(scope.row)"
                v-if="permissions.wetour_chartered_inquiry_visit"
                >回访</el-button
              >
              <el-button type="text" size="small" @click="onDetail(scope.row)"
              v-if="permissions.wetour_chartered_inquiry_view"
                >详情</el-button
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
    </basic-container>
    <el-dialog
      title="回访"
      width="600px"
      append-to-body
      :visible.sync="visitVisible"
      :before-close="handleVisitClose"
    >
      <el-form
        ref="visitForm"
        label-width="100px"
        :model="visitForm"
        :rules="visitRules"
        label-position="right"
      >
        <el-form-item label="回访备注：" prop="remark">
          <el-input
            placeholder="请输入回访备注"
            v-model="visitForm.remark"
            type="textarea"
            maxlength="200"
            :rows="3"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div class="flex-center" style="margin: 0px 20px">
        <el-button @click="handleVisitClose">取消</el-button>
        <el-button type="primary" @click="handleConfim">确定</el-button>
      </div>
    </el-dialog>
    <detail-drawer
      v-if="detailDialog.visible"
      :dialogData="detailDialog.data"
      :dialogVisible.sync="detailDialog.visible"
        @refreshDataList="getDataList"

    ></detail-drawer>
  </div>
</template>
<script>
import detailDrawer from "./detail-drawer.vue";
import { fetchList, visit, getObj, siteList,siteDetail,siteVisit } from "@/api/wetour/order";
import { mapGetters } from "vuex";
export default {
  components: {
    detailDrawer,
  },
  data() {
    return {
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      searchForm: {
        contact: "",
        cartTime: "",
        visitStatus: 0,
        startTime:'',
        endTime:'',
      },

      detailDialog: {
        data: {},
        visible: false,
      },

      visitForm: {
        remark: "",
      },
      visitRules: {
        remark: [
          {
            required: true,
            message: "回访备注不能为空",
            trigger: "blur",
          },
        ],
      },
      dialogData:{},
      visitVisible: false,
      createTimes:[],
      pickerOptions: {
        disabledDate(time) {

        },
        onPick: ({ maxDate, minDate }) => {
	         if (minDate && this.pickerMinDate) {
	           this.pickerMinDate = null;
	         } else if (minDate) {
	           this.pickerMinDate = minDate.getTime();
	         }
	       },
	       disabledDate: (time) => {
	         if (this.pickerMinDate) {
	           return (time.getTime() > (this.pickerMinDate + this.day30)) || (time.getTime() < (this.pickerMinDate - this.day30)) || time.getTime() < new Date('2019-01-01').getTime()  || time.getTime() > Date.now();
	         }
          return time.getTime() < new Date('2019-01-01').getTime()  || time.getTime() > Date.now()

	         return false;
	       }
      },
      pickerMinDate: null,
      pickerMaxDate: null,
      day30: 30 * 24 * 3600 * 1000,
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  filters: {
    statusFil(val) {
      const map = {
        0: "待回访",
        1: "已回访",
      };
      return map[val];
    },
    sourceFil(val) {
      const map = {
        1: "PC",
        2: "移动",
      };
      return map[val];
    },
  },
  created() {
    this.getDataList();

    // this.createTimes = 
  },
  methods: {
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
    //重置
    resetForm() {
      this.searchForm = {
        contact: "",
        cartTime: "",
        visitStatus: 0,
        startTime:'',
        endTime:'',
      };
      this.createTimes = []
      
    },

    onVisit(row) {
      this.dialogData = row
      this.visitVisible = true;

      this.$nextTick(()=>{
        this.$refs.visitForm.resetFields()
        if(row.visitRemark){
          this.visitForm.remark = row.visitRemark
        }
      })
    },
    onDetail(row) {
      siteDetail(row.id).then(response=>{
        // // return  false
        // let data = Object.assign({},response.data.data)
        // this.dialogData = data
        // this.$nextTick(() => {
        //   this.addOrUpdateVisible = true;
        // });
        this.detailDialog = {
          data: Object.assign({},response.data.data),
          visible: true,
        };
      })
      
    },
    handleVisitClose() {
      this.visitVisible = false;
    },
    handleConfim() {
      this.$refs.visitForm.validate((valid) => {
        if (valid) {
          let data = {
            "id": this.dialogData.id,
            "visitRemark": this.visitForm.remark
          }
          siteVisit(data).then(res=>{
            if(res.data.code == 0) {
              this.visitVisible = false
              this.getDataList()
              this.$message.success(`回访成功`);
            }
          })
          // visitForm.remark
          // this.getDataList()
        }
      });
    },
     // 获取数据列表
    getDataList() {
      console.log(this.createTimes,3333)
      this.dataListLoading = true;
      if (this.createTimes && this.createTimes.length) {
        this.searchForm.startTime = this.createTimes[0] + ' 00:00:00';
        this.searchForm.endTime = this.createTimes[1] + ' 23:59:59';
      } else {
        this.searchForm.startTime = "";
        this.searchForm.endTime = "";
      }
      siteList(
        Object.assign({
          current: this.pageIndex,
          size: this.pageSize,
          ...this.searchForm,
        })
      ).then((response) => {
        this.dataList = response.data.data.records;
        this.totalPage = response.data.data.total;
      });
      this.dataListLoading = false;
    },
  },
};
</script>
