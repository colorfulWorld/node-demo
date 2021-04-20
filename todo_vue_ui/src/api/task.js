import request from "@/utils/request";

const taskApi = {
  addTask: "/task/add",
  updateTask: "/task/update",
  deleteTask: "/task/delete",
  getTaskList: "/task/list",
};

export function addTask(parameter) {
  return request({
    url: taskApi.addTask,
    method: "post",
    data: parameter,
  });
}
export function updateTask(parameter) {
  return request({
    url: taskApi.updateTask,
    method: "post",
    data: parameter,
  });
}

export function deleteTask(parameter) {
  return request({
    url: taskApi.deleteTask,
    method: "get",
    params: parameter,
  });
}

export function getTaskList(parameter) {
  return request({
    url: taskApi.getTaskList,
    method: "post",
    data: parameter,
  });
}
