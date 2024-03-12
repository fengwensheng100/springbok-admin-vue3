import request from "@/utils/request";

export function uploadImg(file, type) {
  let formData = new FormData();
  formData.append("file", file);
  return request({
    url: "/common/uploadImg?type=" + type,
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
}
export function login(data) {
  return request({
    url: "/user/login",
    method: "POST",
    data: data,
  });
}
export function logout() {
  return request({
    url: "/user/logout",
    method: "POST",
  });
}
export function verifyCode() {
  return "http://localhost:9988/user/captcha";
}
