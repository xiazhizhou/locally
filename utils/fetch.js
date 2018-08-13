module.exports = (url, data) => {
    wx.showLoading({ title: 'Loading...' })
    return new Promise((resolve, reject) => {
        wx.request({
            url: `https://locally.uieee.com/${url}`,
            header: {
                'content-type': 'application/json' // 默认值
            },
            data: data,
            success: resolve,
            fail: reject,
            complete: wx.hideLoading
        })
    })
}