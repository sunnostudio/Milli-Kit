// Cloudinary 設定 — 画像ギャラリー用
// Firebase Storage が使えないため Cloudinary の unsigned upload を使用
// 手順:
// 1. https://cloudinary.com でアカウント作成
// 2. Settings > Upload > Upload presets > Add upload preset で unsigned を作成
//    - Folder: milli-linker/gallery など
//    - Allowed formats: jpg,png,webp
//    - Max file size: 5MB, Max image width/height: 2048 推奨
// 3. 下記 2つを置き換える
var CLOUDINARY_CLOUD_NAME = "lxp4pg4z"; // DashboardのCloud name
var CLOUDINARY_UPLOAD_PRESET = "milli_linker_unsigned"; // unsigned preset 名
// 任意: フォルダを指定したい場合
var CLOUDINARY_FOLDER = "milli-linker/gallery";
window.CLOUDINARY_CLOUD_NAME = CLOUDINARY_CLOUD_NAME;
window.CLOUDINARY_UPLOAD_PRESET = CLOUDINARY_UPLOAD_PRESET;

function isCloudinaryConfigured(){
  return typeof CLOUDINARY_CLOUD_NAME !== "undefined" && CLOUDINARY_CLOUD_NAME && CLOUDINARY_CLOUD_NAME !== "YOUR_CLOUD_NAME"
      && typeof CLOUDINARY_UPLOAD_PRESET !== "undefined" && CLOUDINARY_UPLOAD_PRESET && CLOUDINARY_UPLOAD_PRESET !== "YOUR_PRESET" && CLOUDINARY_UPLOAD_PRESET !== "";
}

// 1枚を Cloudinary にアップロード（unsigned）
// file: File オブジェクト
// onProgress: (percent) => void 任意
async function uploadToCloudinary(file, onProgress){
  if(!isCloudinaryConfigured()){
    throw new Error("Cloudinary未設定: cloudinary-config.js の CLOUDINARY_CLOUD_NAME / CLOUDINARY_UPLOAD_PRESET を設定してください");
  }
  if(!file || !file.type.startsWith("image/")){
    throw new Error("画像ファイルを選択してください");
  }
  if(file.size > 5 * 1024 * 1024){
    throw new Error("画像は5MBまでにしてください");
  }
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  if(CLOUDINARY_FOLDER) fd.append("folder", CLOUDINARY_FOLDER);
  // 軽量化: 自動で 1200px にリサイズ（Cloudinaryの transformation でも可能だが念のため）
  return new Promise((resolve, reject)=>{
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.upload.onprogress = (e)=>{
      if(e.lengthComputable && typeof onProgress==="function"){
        onProgress(Math.round(e.loaded / e.total * 100));
      }
    };
    xhr.onload = ()=>{
      try{
        const res = JSON.parse(xhr.responseText);
        if(xhr.status >= 200 && xhr.status < 300 && res.secure_url){
          resolve({ url: res.secure_url, public_id: res.public_id, width: res.width, height: res.height });
        } else {
          reject(new Error(res.error?.message || `Cloudinaryアップロード失敗 (${xhr.status})`));
        }
      }catch(e){ reject(e); }
    };
    xhr.onerror = ()=> reject(new Error("通信エラー: Cloudinaryへのアップロードに失敗しました"));
    xhr.send(fd);
  });
}

// Cloudinary URL に変換パラメータを付与（サムネ等）
// 例: t = "c_fill,w_400,h_400" や "f_auto,q_auto"
function cloudinaryTransform(url, transform){
  if(!url || !url.includes("res.cloudinary.com")) return url;
  // https://res.cloudinary.com/<cloud>/image/upload/v123/... => /image/upload/<transform>/v123/...
  return url.replace("/image/upload/", `/image/upload/${transform}/`);
}
