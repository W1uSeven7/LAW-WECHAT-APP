const app = getApp();

Page({
  data: {
    isLoggingIn: false,
    errorMsg: "",
    phone: "+86 ",
    phoneCursor: 4,
    password: "",
    showPassword: false
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

  onPhoneInput(e) {
    const rawValue = e.detail.value || "";
    const phoneDigits = this.extractPhoneDigits(rawValue);
    const nextPhone = `+86 ${phoneDigits}`;

    this.setData({
      phone: nextPhone,
      phoneCursor: nextPhone.length
    });
  },

  onPhoneFocus() {
    const currentPhone = this.data.phone || "+86 ";
    const safePhone = currentPhone.startsWith("+86 ") ? currentPhone : "+86 ";
    this.setData({
      phone: safePhone,
      phoneCursor: safePhone.length
    });
  },

  onPasswordInput(e) {
    this.setData({
      password: e.detail.value
    });
  },

  togglePassword() {
    this.setData({
      showPassword: !this.data.showPassword
    });
  },

  handleAccountLogin() {
    const { phone, password } = this.data;
    const phoneDigits = this.extractPhoneDigits(phone);
    if (!phoneDigits || phoneDigits.length !== 11 || !password) {
      this.setData({
        errorMsg: "请输入正确手机号和密码后再登录。"
      });
      return;
    }

    const authData = {
      loggedIn: true,
      userInfo: {
        nickName: "普通用户"
      },
      phoneBound: true
    };

    wx.setStorageSync("auth", authData);
    app.globalData.userInfo = authData.userInfo;
    wx.reLaunch({
      url: "/pages/home/home"
    });
  },

  handleQQLogin() {
    wx.showToast({
      title: "QQ 登录暂未开放",
      icon: "none"
    });
  },

  handleRegister() {
    wx.showToast({
      title: "注册功能开发中",
      icon: "none"
    });
  },

  handleForgotPassword() {
    wx.showToast({
      title: "找回密码开发中",
      icon: "none"
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

  extractPhoneDigits(value) {
    const digits = (value || "").replace(/[^\d]/g, "");
    const withoutCountryCode = digits.startsWith("86") ? digits.slice(2) : digits;
    return withoutCountryCode.slice(0, 11);
  }
});
