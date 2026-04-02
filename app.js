App({
  globalData: {
    userInfo: null
  },

  onLaunch() {
    const auth = wx.getStorageSync("auth");
    if (auth && auth.loggedIn) {
      this.globalData.userInfo = auth.userInfo || null;
    }
  }
});
