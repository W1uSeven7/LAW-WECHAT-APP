Page({
  logout() {
    wx.removeStorageSync("auth");
    wx.reLaunch({
      url: "/pages/login/login"
    });
  }
});
