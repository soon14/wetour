<template>
  <div class="mod-config">
    <basic-container>
      <div class="filter-container">
        <el-input
          v-model="searchForm.partnerName"
          placeholder="请输入伙伴名称"
          style="width: 140px"
          class="filter-item"
          maxlength="10"
          @keyup.native.enter="currentChangeHandle(1)"
        />
        <el-input
          v-model="searchForm.mobile"
          placeholder="请输入登录账号"
          style="width: 140px"
          class="filter-item"
          maxlength="20"
          @keyup.native.enter="currentChangeHandle(1)"
        />
        <el-input
          v-model="searchForm.country"
          placeholder="请输入国家"
          style="width: 140px"
          class="filter-item"
          maxlength="10"
          @keyup.native.enter="currentChangeHandle(1)"
        />
        <el-input
          v-model="searchForm.city"
          placeholder="请输入服务城市"
          style="width: 140px"
          class="filter-item"
          maxlength="10"
          @keyup.native.enter="currentChangeHandle(1)"
        />
        <el-select
          v-model="searchForm.partnerStatus"
          style="width: 140px"
          class="filter-item"
          filterable
          clearable
        >
          <el-option :value="''" label="全部" />
          <el-option :value="0" label="禁用" />
          <el-option :value="1" label="启用" />
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
            prop="partnerName"
            header-align="center"
            align="center"
            label="伙伴名称"
          ></el-table-column>
          <el-table-column
            prop="mobile"
            header-align="center"
            align="center"
            label="登录账号"
          ></el-table-column>
          <el-table-column
            prop="country"
            header-align="center"
            align="center"
            label="服务国家"
          ></el-table-column>
          <el-table-column
            prop="cityIdsShow"
            header-align="center"
            align="center"
            label="服务城市"
          ></el-table-column>
          <el-table-column
            prop="partnerStatus"
            header-align="center"
            align="center"
            label="状态"
          >
            <template slot-scope="scope">
              {{ scope.row.partnerStatus | statusFil }}
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            header-align="center"
            align="center"
            label="创建时间"
          ></el-table-column>

          <el-table-column header-align="center" align="center" label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="launchHandle(scope.row)"
                v-if="(scope.row.partnerStatus == 0  && permissions.wetour_partner_enable) || (scope.row.partnerStatus != 0  && permissions.wetour_partner_disable)"
                >{{ scope.row.partnerStatus == 0 ? "启用" : "禁用" }}
              </el-button>

              <el-button
                type="text"
                size="small"
                @click="detailHandle(scope.row)"
                v-if="permissions.wetour_partner_view"
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

      <table-form
        v-if="tableformDialog.detailVisible"
        :dialogData="tableformDialog.dialogData"
        :dialogVisible.sync="tableformDialog.detailVisible"
        @refreshDataList="getDataList"

      ></table-form>
    </basic-container>
    <el-dialog
      title="驳回"
      :visible.sync="dialogData.visible"
      :before-close="onClose"
      append-to-body
      width="600px"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="launchForm"
        label-position="right"
        label-width="100px"
      >
        <el-form-item>
          <div v-if="dialogData.type == 0">
            您正在启用 {{ dialogData.dataForm.partnerName }} 的账号,请确定
          </div>
          <div v-else>
            您正在停用{{ dialogData.dataForm.partnerName }} 的账号,请确定
          </div>
        </el-form-item>
        <el-form-item
          v-if="dialogData.type == 1"
          label="停用原因："
          prop="reason"
        >
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 3 }"
            placeholder="请输入停用原因,最多只能输入20个字"
            v-model="launchForm.reason"
            maxlength="20"
          >
          </el-input>
        </el-form-item>
        <div style="margin-top:20px;font-size:14px;margin-left:100px;">
          <p>注：</p>
          <p>1、停用后伙伴无法报价，无法接单</p>
          <p>2、停用原因会展示在伙伴端请谨慎填写</p>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="onConfirm(dialogData.type)"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import TableForm from "./table-form";
import {
  partnerPageList,
  partnerDisable,
  partnerEnable,
  partnerDetail,
} from "@/api/wetour/partner.js";
import { mapGetters } from "vuex";

export default {
  components: {
    TableForm,
  },
  data() {
    return {
      searchForm: {
        country: "", //国家
        city: "", //服务城市
        mobile: "", //登录账号
        partnerName: "", //伙伴名称
        partnerStatus: "", //状态
      },
      launchForm: {
        id: "",
        reason: "",
      },
      dialogData: {
        type: 0,
        dataForm: "",
        visible: false,
      },
      tableformDialog: {
        dialogData: {},
        detailVisible: false,
      },
      rules: {
        reason: {
          required: true,
          message: "停用原因不能为空",
          trigger: "blur",
        },
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
    };
  },
  filters: {
    statusFil(val) {
      const map = {
        0: "禁用",
        1: "启用",
      };
      return map[val];
    },
  },
  created() {
    this.getDataList();
  },
  computed: {
    ...mapGetters(["permissions"]),
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
    resetForm() {
      this.searchForm = {
        country: "", //国家
        city: "", //服务城市
        mobile: "", //登录账号
        partnerName: "", //伙伴名称
        partnerStatus: "", //状态
      };
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      partnerPageList(
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
    //启动
    launchHandle(row) {
      this.dialogData = {
        visible: true,
        dataForm: row,
        type: row.partnerStatus,
      };
    },
    //详情
    detailHandle(row) {
      partnerDetail(row.id).then(res=>{
        console.log(res,3333)
        this.tableformDialog.dialogData = res.data.data;
        this.$nextTick(()=>{
          this.tableformDialog.detailVisible = true;
        })
      })
      
    },
    ///点击确定
    onConfirm(type) {
      if (type == 0) {
        partnerEnable(this.dialogData.dataForm.id).then((response) => {
          this.$message.success("启用成功");
          this.onClose();
          this.getDataList();
        });
      } else {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.launchForm.id = this.dialogData.dataForm.id;
            partnerDisable(this.launchForm.id, this.launchForm.reason).then(
              (response) => {
                this.$message.success("禁用成功");
                this.onClose();
                this.getDataList();
              }
            );
          } else {
            return false;
          }
        });
      }
    },
    onClose() {
      this.dialogData = {
        type: 0,
        dataForm: "",
        visible: false,
      };
      this.launchForm = {
        id: "",
        reason: "",
      };
    },
  },
};
</script>

<style lang="scss" scoped>
</style>