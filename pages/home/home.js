Page({
  data: {
    banners: [
      {
        tag: "爆款作品",
        title: "人气漫画连载更新",
        desc: "点击查看最新章节与周边",
        type: "comics"
      },
      {
        tag: "新品发布",
        title: "原创游戏 Demo 上线",
        desc: "立即体验玩法与设定",
        type: "games"
      },
      {
        tag: "限时活动",
        title: "定制服务限时优惠",
        desc: "了解套餐与优惠信息",
        type: "custom"
      },
      {
        tag: "商城福利",
        title: "周边与数字内容促销",
        desc: "一键进入商城选购",
        type: "mall"
      }
    ],
    entries: [
      { icon: "漫", name: "漫画作品", intro: "原创漫画与章节", type: "comics" },
      { icon: "游", name: "游戏作品", intro: "玩法展示与体验", type: "games" },
      { icon: "视", name: "视频作品", intro: "短片与花絮合集", type: "videos" },
      { icon: "定", name: "定制服务", intro: "创意定制与套餐", type: "custom" },
      { icon: "介", name: "工作室介绍", intro: "团队与创作理念", type: "studio" },
      { icon: "AI", name: "AI 助手", intro: "随时智能咨询", type: "ai" }
    ]
  },

  onShow() {
    const auth = wx.getStorageSync("auth");
    if (!auth || !auth.loggedIn) {
      wx.reLaunch({
        url: "/pages/login/login"
      });
    }
  },

  handleSearch() {
    wx.showToast({
      title: "搜索功能开发中",
      icon: "none"
    });
  },

  handleBannerTap(e) {
    const { type } = e.currentTarget.dataset;
    this.routeByType(type);
  },

  handleEntryTap(e) {
    const { type } = e.currentTarget.dataset;
    this.routeByType(type);
  },

  routeByType(type) {
    if (type === "mall") {
      this.goMall();
      return;
    }

    if (type === "ai") {
      this.openAI();
      return;
    }

    wx.showToast({
      title: "功能页开发中",
      icon: "none"
    });
  },

  goMall() {
    wx.switchTab({
      url: "/pages/mall/mall"
    });
  },

  openAI() {
    wx.showToast({
      title: "AI 助手开发中",
      icon: "none"
    });
  },

  logout() {
    wx.removeStorageSync("auth");
    wx.reLaunch({
      url: "/pages/login/login"
    });
  }
});
