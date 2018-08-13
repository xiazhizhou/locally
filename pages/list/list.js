const fetch = require('../../utils/fetch')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 当前加载的分类
    category: {},
    // 此分类下的全部店铺
    shops: [],
    pageIndex: 0,
    pageSize: 20,
    hasMore: true
  },

  // 加载下一页数据
  loadMore() {
    if (!this.data.hasMore) return

    let { pageIndex, pageSize } = this.data
    const params = { _page: ++pageIndex, _limit: pageSize }
    return fetch(`categories/${this.data.category.id}/shops`, params)
      .then(res => {
        const totalCount = parseInt(res.header['X-Total-Count'])
        const hasMore = pageIndex * pageSize < totalCount
        const shops = this.data.shops.concat(res.data)
        this.setData({ shops, pageIndex, hasMore })
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    fetch(`categories/${options.cat}`).then(res => {
      // // 这里不能确定一定是在 onReady 过后执行
      // wx.setNavigationBarTitle({
      //   title: res.data.name
      // })

      this.setData({ category: res.data })
      wx.setNavigationBarTitle({
        title: res.data.name
      })

      // 加载完分类信息过后再去加载商铺信息
      this.loadMore()
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (this.data.category.name) {
      wx.setNavigationBarTitle({
        title: this.data.category.name
      })
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 重新加载数据
    this.setData({ shops: [], pageIndex: 0, hasMore: true })
    this.loadMore().then(() => wx.stopPullDownRefresh())
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // console.log('到底了，别拉了')
    // 在这里加载下一页的数据
    // 需要判断是否正在加载，否则会有多次触发问题
    this.loadMore()
  }
})
