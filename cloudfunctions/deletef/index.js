// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
const db = cloud.database();
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { ENV, OPENID, APPID } = cloud.getWXContext()
  const folder = event.folder;
  const fileIDs = [];
   await db.collection('file').where({
      folderId: folder
    }).get().then(res=>{
        res.data.forEach(element => {
          fileIDs.push(element.file_id);
        });
    });
    await cloud.deleteFile({
      fileList: fileIDs
    });
    await db.collection('file').where({
      folderId: folder
    }).remove();
    return fileIDs;


}