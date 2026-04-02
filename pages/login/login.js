const app = getApp();

Page({
  data: {
    isLoggingIn: false,
    errorMsg: "",
    agreed: false
  },

  onShow() {
    const auth = wx.getStorageSync("auth");
    if (auth && auth.loggedIn) {
      wx.reLaunch({
        url: "/pages/home/home"
      });
    }
  },

  handleWechatLogin() {
    if (this.data.isLoggingIn) return;
    if (!this.data.agreed) {
      wx.showToast({
        title: "请先勾选并同意协议",
        icon: "none"
      });
      return;
    }

    this.setData({
      isLoggingIn: true,
      errorMsg: ""
    });

    wx.getUserProfile({
      desc: "用于完善会员资料",
      success: (profileRes) => {
        wx.login({
          success: (loginRes) => {
            // 仅做登录流程校验，code 后续用于服务端换取会话信息。
            if (!loginRes.code) {
              this.setData({
                errorMsg: "微信登录服务异常，请检查网络后重试。"
              });
              return;
            }

            const authData = {
              loggedIn: true,
              userInfo: profileRes.userInfo,
              phoneBound: false
            };

            wx.setStorageSync("auth", authData);
            app.globalData.userInfo = profileRes.userInfo;

            wx.showToast({
              title: "登录成功",
              icon: "success"
            });

            wx.reLaunch({
              url: "/pages/home/home"
            });
          },
          fail: () => {
            this.setData({
              errorMsg: "微信登录服务异常，请检查网络后重试。"
            });
          },
          complete: () => {
            this.setData({
              isLoggingIn: false
            });
          }
        });
      },
      fail: () => {
        this.setData({
          isLoggingIn: false,
          errorMsg: "未授权微信信息，暂时无法登录，请重试。"
        });
      }
    });
  },

  handlePhoneBind(e) {
    if (e.detail.errMsg !== "getPhoneNumber:ok") {
      wx.showToast({
        title: "你已取消手机号绑定",
        icon: "none"
      });
      return;
    }

    // 这里只做前端流程占位，真实手机号解密需服务端参与。
    const auth = wx.getStorageSync("auth") || {};
    auth.phoneBound = true;
    wx.setStorageSync("auth", auth);

    wx.showToast({
      title: "手机号绑定成功",
      icon: "success"
    });
  },

  goPrivacy() {
    wx.navigateTo({
      url: "/pages/protocol/privacy"
    });
  },

  goAgreement() {
    wx.navigateTo({
      url: "/pages/protocol/agreement"
    });
  },

  toggleAgreement() {
    this.setData({
      agreed: !this.data.agreed
    });
  }
});
