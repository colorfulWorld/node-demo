<template>
  <div class="task-list">
    <div class="header">
      <h2>任务列表</h2>
      <a-button type="primary" @click="handleAddTask">添加任务</a-button>
    </div>

    <div class="table">
      <a-table
        :columns="columns"
        :data-source="data"
        rowKey="id"
        @change="handleTableChange"
        :pagination="pagination"
        :loading="loading"
      >
        <span slot="gmt_expire" slot-scope="text">
          {{ moment(text).format("YYYY-MM-DD") }}
        </span>
        <span slot="status" slot-scope="text">
          <a-tag :color="text ? 'geekblue' : 'green'">
            {{ ["代办", "完成"][text] }}
          </a-tag>
        </span>
        <span slot="action" slot-scope="text, record">
          <a @click="operate('edit', record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="operate('delete', record)">删除</a>
          <a-divider type="vertical" />
          <a @click="operate('changeStatus', record)">
            {{ record.status ? "代办" : "完成" }}
          </a>
        </span>
      </a-table>
    </div>

    <a-modal
      :title="modalTitle"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-model ref="form" :model="form" :rules="rules">
        <a-form-model-item label="任务名称" prop="title">
          <a-input v-model="form.title" placeholder="请输入任务名称" />
        </a-form-model-item>
        <a-form-model-item label="截止时间" prop="date">
          <a-date-picker
            v-model="form.date"
            type="date"
            placeholder="请选择截止日期"
            style="width: 100%;"
          />
        </a-form-model-item>
        <a-form-model-item label="任务描述" prop="description">
          <a-input
            v-model="form.description"
            type="textarea"
            placeholder="请输入任务描述"
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { getTaskList, addTask, deleteTask, updateTask } from "@/api/task";
import moment from "moment";
const columns = [
  {
    title: "任务名称",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "任务描述",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "任务状态",
    dataIndex: "status",
    key: "status",
    scopedSlots: { customRender: "status" },
  },
  {
    title: "截止时间",
    key: "gmt_expire",
    dataIndex: "gmt_expire",
    scopedSlots: { customRender: "gmt_expire" },
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" },
  },
];

export default {
  data() {
    return {
      moment,
      loading: false,
      pagination: {
        total: 0,
        showTotal: (total) => `共 ${total} 条`,
      },
      params: {
        pageNum: 1,
        pageSize: 10,
      },
      data: [],
      columns,
      form: {
        id: "", //任务id
        title: "", //任务名称
        description: "", //任务内容
        date: "", //截止时间
      },
      visible: false,
      confirmLoading: false,
      modalTitle: "添加任务",
      type: 1, //1、新增 2、编辑
      rules: {
        title: [
          { required: true, message: "任务名称不能为空", trigger: "blur" },
        ],
        date: [
          { required: true, message: "截止时间不能为空", trigger: "change" },
        ],
        description: [
          { required: true, message: "任务描述不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getTaskList();
  },
  methods: {
    getTaskList() {
      this.loading = true;
      getTaskList(this.params)
        .then((res) => {
          this.data = res.list;
          this.pagination.total = res.total;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    addTask(params) {
      this.confirmLoading = true;
      addTask(params)
        .then(() => {
          this.visible = false;
          this.getTaskList();
        })
        .finally(() => {
          this.confirmLoading = false;
        });
    },
    updateTask(params) {
      this.confirmLoading = true;
      updateTask(params)
        .then(() => {
          this.visible = false;
          this.getTaskList();
        })
        .finally(() => {
          this.confirmLoading = false;
        });
    },
    deleteTask(params) {
      deleteTask(params).then(() => {
        this.getTaskList();
      });
    },
    operate(type, record) {
      switch (type) {
        case "edit":
          this.type = 2;
          this.modalTitle = "编辑任务";
          this.visible = true;
          this.form = {
            ...record,
            date: moment(record.gmt_expire),
          };
          break;
        case "delete":
          this.$confirm({
            title: "确定删除此任务吗?",
            onOk: () => {
              this.deleteTask({ id: record.id, status: 2 });
            },
          });
          break;
        case "changeStatus":
          this.$confirm({
            title: `修改任务状态为${record.status ? "代办" : "完成"}？`,
            onOk: () => {
              this.updateTask({
                ...record,
                status: record.status ? 0 : 1,
              });
            },
          });

          break;
        default:
          break;
      }
    },
    handleTableChange(pagination) {
      this.params.pageNum = pagination.current;
      this.getTaskList();
    },
    handleAddTask() {
      this.modalTitle = "新增任务";
      this.visible = true;
      this.$nextTick(() => {
        this.$refs.form.resetFields();
      });
    },
    handleOk() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let params = {
            ...this.form,
            gmt_expire: moment(this.form.date).valueOf(),
          };
          if (this.type == 1) {
            this.addTask(params);
          } else {
            this.updateTask(params);
          }
        } else {
          return false;
        }
      });
    },
    handleCancel() {
      this.visible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.task-list {
  .header {
    display: flex;
    justify-content: space-between;
  }
}
</style>
