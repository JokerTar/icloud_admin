var vueObj
vueObj = new Vue({
  el: '#vueObj',
  data: {
    pageInfo: {
      searchValue: null,
      compName: null,
      pageNum: 1,
      pageSize: 20,
      total: 0,
      starteDate: null,
      endDate: null,
      compStatus: [],
      corpTypes: [],
      collect: [],
      compRoles: [],
      orderBy: null
    },
    compStatusChecked: [],
    corpTypesChecked: [],
    collectChecked: [],
    roleChecked: [],
    checkFlag: false,
    dict: {
      corpTypes: [],
      compStatus: [],
      status: [],
      enableStatus: [],
      isRegs: [],
      yesOrNo: [],
      userRoles: [],
      custLevels: [],
      idTypes: [],
      nations: [],
      entpTypes: [],
      entpNatures: [],
      areaTypes: [],
      collect: []
    },
    compRoles: [
      { code: 20, mark: '核心企业', detail: '授信' },
      { code: 30, mark: '成员单位', detail: '额度、开具' },
      { code: 40, mark: '供应商', detail: '签收、信单、转让、融资' },
      { code: 50, mark: '增信机构', detail: '担保' },
      { code: 60, mark: '资金方', detail: '融资、资产管理' },
      { code: 70, mark: '机构投资人', detail: '资产管理' },
      { code: 80, mark: '第三方服务机构', detail: '结算体系' },
      { code: 90, mark: '律师事务所', detail: '资产审查' },
      { code: 100, mark: '中介服务机构', detail: '资产审查' }
    ],
    accountList: [],
    selectedTr: {},
    compRev: {},
    relateDict: {},
    relateList: [],
    tabIndex: 1,
    param: null,
    compInfo: {},
    legalCorporationList: [],
    checkAll: false,
    checkedCities: [],
    products: [],
    isIndeterminate: true

  },
  created: function () {
    var self = this
    if ($.getUrlParam('param') != '' && $.getUrlParam('param') != undefined) {
      self.param = $.getUrlParam('param')
      self.selection({ code: $.getUrlParam('param'), mark: '待审批 ', checked: true })
      history.pushState({ param: $.getUrlParam('param') }, null, '/crm/corporation/corporation')
    }
    self.search()
    $.post('/crm/ajax/cust/product/all').then(function (data) {
      for (var i = 0; i < data.body.length; i++) {
        var body = data.body[i]
        self.products[i] = body.productName
      }
    })
  },
  mounted: function () {
    var self = this
    $.post('/crm/ajax/comp/list/dict').then(function (data) {
      self.dict = data
    })
    $('#starteDate').change(function () {
      Vue.set(self.pageInfo, 'starteDate', $(this).val())
    })
    $('#endDate').change(function () {
      Vue.set(self.pageInfo, 'endDate', $(this).val())
    })
  },
  methods: {
    selection: function (item) {
      var self = this
      if (self.param != item.code && !self.checkFlag) {
        Vue.set(item, 'checked', !item.checked)
      }

      if (item.checked) {
        self.compStatusChecked.push(item.code)
      } else if (!item.checked || (item.checked == undefined && self.param == item.code)) {
        var index = self.compStatusChecked.indexOf(item.code)
        if (index > -1) {
          self.compStatusChecked.splice(index, 1)
        }
      }
      if (item.checked == undefined && self.param != item.code) {
        Vue.set(item, 'checked', true)
        self.compStatusChecked.push(item)
      }
    },

    initSearch: function () {
      this.pageInfo = { pageNum: 1, pageSize: 20 }
      this.searchValue = null
    },
    showDict: function (code, enumStr) {
      if (this.dict != null) { var list = this.dict[enumStr] }
      if (list != null) {
        for (i = 0; i < list.length; i++) {
          if (list[i].code == code) {
            return list[i].mark
          }
        }
      }
    },
    search: function () {
      var self = this
      Vue.set(self.pageInfo, 'flag', 0)
      self.pageInfo.searchValue = ''
      self.pageInfo.compStatus = []
      if (self.compStatusChecked != undefined) {
        self.compStatusChecked.forEach(function (item) {
          self.pageInfo.compStatus.push(item)
        })
      }

      self.pageInfo.corpTypes = []
      if (self.corpTypesChecked != undefined) {
        self.corpTypesChecked.forEach(function (item) {
          self.pageInfo.corpTypes.push(item.code)
        })
      }

      self.pageInfo.collect = []
      if (self.collectChecked != undefined) {
        self.collectChecked.forEach(function (item) {
          self.pageInfo.collect.push(item.code)
        })
      }

      self.pageInfo.compRoles = []
      if (self.roleChecked != undefined) {
        self.roleChecked.forEach(function (item) {
          self.pageInfo.compRoles.push(item.code)
        })
      }

      $.http.$post('/crm/ajax/comp/list', self.pageInfo)
        .then(function (data) {
          data.searchValue = self.pageInfo.searchValue
          data.starteDate = self.pageInfo.starteDate
          data.compName = self.pageInfo.compName
          data.endDate = self.pageInfo.endDate
          data.orderBy = self.pageInfo.orderBy
          self.pageInfo = data
          if (self.pageInfo == null) {
            self.pageInfo = {}
          }
        })
    },
    dosearch: function () {
      var self = this
      self.clearMoreSearchItem()
      Vue.set(self.pageInfo, 'flag', 1)
      $.http.$post('/crm/ajax/comp/list', self.pageInfo)
        .then(function (data) {
          data.searchValue = self.pageInfo.searchValue
          data.starteDate = self.pageInfo.starteDate
          data.endDate = self.pageInfo.endDate
          data.orderBy = self.pageInfo.orderBy
          self.pageInfo = data
          if (self.pageInfo == null) {
            self.pageInfo = {}
          }
        })
    },
    selected: function (model) {
      Vue.set(model, 'checked', !model.checked)
      if (model.checked) {
        Vue.set(this, 'selectedTr', model)
      } else {
        Vue.set(this, 'selectedTr', {})
      }
    },
    reset: function () {
      var self = this
      Vue.set(self, 'checkFlag', true)
      self.clearMoreSearchItem()
      self.dosearch()
    },
    showMoreSearchClick: function () {
      // 清空高级搜索的条件
      this.clearMoreSearchItem()
    },
    clearMoreSearchItem: function () {
      var self = this
      // 搜索：复选框 状态
      self.compStatusChecked = []
      self.collectChecked = []
      self.roleChecked = []
      self.corpTypesChecked = []
      self.pageInfo.starteDate = ''
      self.pageInfo.endDate = ''
      self.pageInfo.compName = ''
      $('input[type=checkbox]').attr('checked', false)
    },
    addAction: function () {
      // 此处请求后台程序，下方是成功后的前台处理……
      var index = layer.load(1, {
        shade: [0.1, '#fff'] // 0.1透明度的白色背景
      })
      // 调用layout form提交 在组件上定义 ref="listLayoutA"
      this.$refs.listLayoutA.submit('/crm/corporation/corporation/info/edit')
      layer.close(index)
    },
    updateAction: function () {
      var self = this
      var custComp = self.selectedTr
      var id = custComp.id
      var enableStatus = custComp.enableStatus
      if (id == null || id == undefined || id.length == 0) {
        layer.msg('请选择有效记录！', { icon: 7 })
        return false
      }
      if (custComp.compStatus != 10) {
        layer.msg('当前客户状态不允许该操作！', { icon: 7 })
        return false
      }
      // 此处请求后台程序，下方是成功后的前台处理……
      var index = layer.load(1, {
        shade: [0.1, '#fff'] // 0.1透明度的白色背景
      })

      layer.closeAll('loading')
      // 调用layout form提交 在组件上定义 ref="listLayoutA"
      self.$refs.listLayoutA.submit('/crm/corporation/corporation/info/edit', { compCode: custComp.compCode })
      layer.close(index)
    },
    viewAction: function () {
      var self = this
      var custComp = self.selectedTr
      if (custComp == null || custComp.id == null) {
        layer.msg('请选择有效记录！', { icon: 7 })
        return false
      }
      self.selectedTr = {}
      layer.load(1, {
        shade: [0.1, '#fff'] // 0.1透明度的白色背景
      })
      // 调用layout form提交 在组件上定义 ref="listLayoutA"
      self.$refs.listLayoutA.submit('/crm/corporation/corporation/info/view', { compCode: custComp.compCode })
      layer.closeAll('loading')
    },
    deleteAction: function () {
      var self = this
      var custComp = self.selectedTr
      if (custComp == null || custComp.id == null) {
        layer.msg('请选择有效记录！', { icon: 7 })
        return false
      }
      if (custComp.compStatus != 10) {
        layer.msg('当前客户状态不允许删除！', { icon: 7 })
        return false
      }
      layer.confirm('确定删除此数据吗？', {
        btn: ['确定', '取消']// 按钮
      }, function (index) {
        layer.close(index)
        // 此处请求后台程序，下方是成功后的前台处理……
        layer.load(1, {
          shade: [0.1, '#fff'] // 0.1透明度的白色背景
        })
        $.post('/crm/ajax/comp/info/del', { compCode: custComp.compCode }).then(function (data) {
          layer.closeAll('loading')
          if (data.code == 200) {
            self.dosearch()
            layer.msg('操作成功！', { icon: 1 })
          } else {
            layer.msg('操作失败！', { icon: 1 })
          }
          Vue.set(self, 'selectedTr', {})
        })
      })
    },
    enableAction: function () {
      var self = this
      var compCode
      var enableStatus
      self.pageInfo.list.forEach(function (item, index) {
        if (item.checked) {
          compCode = item.compCode
          enableStatus = item.enableStatus
          compStatus = item.compStatus
        }
      })
      if (compCode == null || compCode == undefined || compCode.length == 0) {
        layer.msg('请选择有效记录！', { icon: 7 })
        return false
      }
      if (enableStatus != 0 || compStatus != 40) {
        layer.msg('该状态不允许启用！', { icon: 7 })
        return false
      }

      if (compCode != null && compCode != '') {
        layer.confirm('确定启用此数据吗？', {
          btn: ['确定', '取消']// 按钮
        }, function (index) {
          layer.close(index)
          // 此处请求后台程序，下方是成功后的前台处理……
          var index = layer.load(1, {
            shade: [0.1, '#fff'] // 0.1透明度的白色背景
          })
          $.post('/crm/ajax/comp/info/enable', { compCode: compCode }).then(function (data) {
            layer.closeAll('loading')
            if (data.code == 200) {
              layer.msg('操作成功！', { icon: 1 })
            } else {
              layer.msg(data.message, { icon: 2 })
            }
            Vue.set(self, 'selectedTr', {})
            self.dosearch()
          })
        })
      }
    },
    disableAction: function () {
      var self = this
      var compCode
      var enableStatus
      self.pageInfo.list.forEach(function (item, index) {
        if (item.checked) {
          compCode = item.compCode
          enableStatus = item.enableStatus
          compStatus = item.compStatus
        }
      })
      if (compCode == null || compCode == undefined || compCode.length == 0) {
        layer.msg('请选择有效记录！', { icon: 7 })
        return false
      }
      if (enableStatus != 1 || compStatus != 40) {
        layer.msg('该状态不允许禁用！', { icon: 7 })
        return false
      }
      if (compCode != null && compCode != '') {
        layer.confirm('确定禁用此数据吗？', {
          btn: ['确定', '取消']// 按钮
        }, function (index) {
          layer.close(index)
          // 此处请求后台程序，下方是成功后的前台处理……
          var index = layer.load(1, {
            shade: [0.1, '#fff'] // 0.1透明度的白色背景
          })
          $.post('/crm/ajax/comp/info/disable', { compCode: compCode }).then(function (data) {
            layer.closeAll('loading')
            if (data.code == 200) {
              layer.msg('操作成功！', { icon: 1 })
            } else {
              layer.msg(data.message, { icon: 2 })
            }
            Vue.set(self, 'selectedTr', {})
            self.dosearch()
          })
        })
      }
    },
    managerChange: function () {
      var self = this
      var id = self.selectedTr.id
      if (id == null || id == undefined || id.length == 0) {
        layer.msg('请选择有效记录！', { icon: 7 })
        return false
      }
      if (self.selectedTr.enableStatus != 1) {
        layer.msg('该状态不允许变更！', { icon: 7 })
        return false
      }
      if (self.selectedTr.compStatus != 40) {
        layer.msg('该状态不允许变更！', { icon: 7 })
        return false
      }

      if (id != null && id != '') {
        layer.confirm('确定变更选中数据吗？', {
          btn: ['确定', '取消']// 按钮
        }, function (index) {
          layer.close(index)
          // 此处请求后台程序，下方是成功后的前台处理……
          var index = layer.load(1, {
            shade: [0.1, '#fff'] // 0.1透明度的白色背景
          })
          $.post('/crm/ajax/comp/manageChange/check', { compCode: self.selectedTr.compCode }).then(function (data) {
            if (data.code == 200) {
              // 调用layout form提交 在组件上定义 ref="listLayoutA"
              self.$refs.listLayoutA.submit('/crm/corporation/managerchange/info/edit', { compCode: self.selectedTr.compCode })
            } else {
              layer.msg(data.message, { icon: 2 })
            }
            layer.closeAll('loading')
            self.dosearch()
          })
        })
      }
    },
    roleChange: function () {
      var self = this
      var id = self.selectedTr.id
      if (id == null || id == undefined || id.length == 0) {
        layer.msg('请选择有效记录！', { icon: 7 })
        return false
      }
      if (self.selectedTr.enableStatus != 1) {
        layer.msg('该状态不允许变更！', { icon: 7 })
        return false
      }
      if (self.selectedTr.compStatus != 40) {
        layer.msg('该状态不允许变更！', { icon: 7 })
        return false
      }

      if (id != null && id != '') {
        layer.confirm('确定变更选中数据吗？', {
          btn: ['确定', '取消']// 按钮
        }, function (index) {
          layer.close(index)
          // 此处请求后台程序，下方是成功后的前台处理……
          var index = layer.load(1, {
            shade: [0.1, '#fff'] // 0.1透明度的白色背景
          })
          $.post('/crm/ajax/roleChange/check', { compCode: self.selectedTr.compCode }).then(function (data) {
            if (data.code == 200) {
              // 调用layout form提交 在组件上定义 ref="listLayoutA"
              self.$refs.listLayoutA.submit('/crm/corporation/rolechange/info/edit', { compCode: self.selectedTr.compCode })
            } else {
              layer.msg(data.message, { icon: 2 })
            }
            layer.closeAll('loading')
            self.dosearch()
          })
        })
      }
    },
    submit: function () {
      var self = this
      var compCode = self.selectedTr.compCode
      var compStatus = self.selectedTr.compStatus
      self.compRev = {}
      if (compCode == null || compCode == undefined || compCode.length == 0) {
        layer.msg('请选择有效记录！', { icon: 7 })
        return false
      } else {
        if (compStatus != 10) {
          layer.msg('当前客户状态不允许操作！', { icon: 7 })
          return false
        }
      }
      // 此处请求后台程序，下方是成功后的前台处理……
      var index = layer.load(1, {
        shade: [0.1, '#fff'] // 0.1透明度的白色背景
      })
      $.post('/crm/ajax/comp/info/submit', { compCode: compCode }).then(function (data) {
        layer.closeAll('loading')
        if (data.code == 200) {
          layer.msg('操作成功！', { icon: 1 })
        } else {
          layer.msg(data.message, { icon: 2 })
        }
        Vue.set(self, 'selectedTr', {})
        self.dosearch()
      })
    },
    pass: function () {
      var self = this
      var codes = []
      self.pageInfo.list.forEach(function (item, index) {
        if (item.checked) {
          codes.push(item.compCode)
        }
      })
      if (codes == null || codes == '' || codes.length == 0) {
        layer.msg('请勾选客户！', { icon: 7 })
        return false
      } else {
        layer.confirm('确定审批通过吗？', {
          btn: ['确定', '取消']// 按钮
        }, function (index) {
          layer.close(index)
          // 此处请求后台程序，下方是成功后的前台处理……
          var index = layer.load(1, {
            shade: [0.1, '#fff'] // 0.1透明度的白色背景
          })
          $.http.$post('/crm/ajax/comp/info/pass', codes).then(function (data) {
            layer.closeAll('loading')
            if (data.code == 200) {
              layer.msg(data.message, { icon: 1 })
            } else {
              layer.msg('审批失败【' + data.message + '】', { icon: 2 })
            }
            Vue.set(self, 'selectedTr', {})
            self.dosearch()
          })
        })
      }
    },
    unPass: function () {
      var self = this
      var compCode = self.selectedTr.compCode
      var compStatus = self.selectedTr.compStatus
      self.compRev = {}
      if (compCode == null || compCode == undefined || compCode.length == 0) {
        layer.msg('请选择有效记录！', { icon: 7 })
        return false
      } else {
        if (compStatus != 30) {
          layer.msg('当前客户状态不允许操作！', { icon: 7 })
          return false
        }
      }
      var index = layer.load(1, {
        shade: [0.1, '#fff'] // 0.1透明度的白色背景
      })
      $('#auditOpinion').reveal("{data-animation:'none'}")
      layer.closeAll('loading')
    },

    fileCollect: function () {
      var self = this
      var compCode = self.selectedTr.compCode
      var selectList = []
      self.pageInfo.list.forEach(function (item, index) {
        if (item.checked) {
          selectList.push(item.compCode)
        }
      })
      if (selectList == null || selectList == '' || selectList.length == 0) {
        layer.msg('请勾选客户！', { icon: 7 })
        return false
      }
      // 此处请求后台程序，下方是成功后的前台处理……
      var index = layer.load(1, {
        shade: [0.1, '#fff'] // 0.1透明度的白色背景
      })
      $.http.$post('/crm/ajax/comp/file/collect', selectList).then(function (data) {
        layer.close(index)
        if (data.code == 200) {
          layer.msg(data.message, { icon: 1 })
        } else {
          layer.msg('确认失败【' + data.message + '】！', { icon: 2 })
        }
        Vue.set(self, 'selectedTr', {})
        self.dosearch()
      })
    },

    ok: function () {
      var self = this
      var compCode = self.selectedTr.compCode
      if (self.compRev.reviewMemo == '' || self.compRev.reviewMemo == null || self.compRev.reviewMemo.length > 150) {
        layer.msg('请输入审批意见或者审批意见不能超过150个汉字！', { icon: 7 })
        return false
      }
      // 此处请求后台程序，下方是成功后的前台处理……
      var index = layer.load(1, {
        shade: [0.1, '#fff'] // 0.1透明度的白色背景
      })
      self.compRev.compCode = compCode
      $.http.$post('/crm/ajax/comp/info/unPass', self.compRev).then(function (data) {
        layer.closeAll('loading')
        if (data.code == 200) {
          layer.msg('操作成功！', { icon: 1 })
          $('#auditOpinion').trigger('reveal:close')
        } else {
          layer.msg(data.message, { icon: 2 })
          $('#auditOpinion').trigger('reveal:close')
        }
        Vue.set(self, 'selectedTr', {})
        self.dosearch()
      })
    },
    cancel: function () {
      $('#auditOpinion').trigger('reveal:close')
    },
    relate: function () {
      var self = this
      if (self.selectedTr.compCode == null || self.selectedTr.compCode == '') {
        layer.msg('请选择有效记录！', { icon: 7 })
        return false
      }
      if (self.selectedTr.compStatus != 40) {
        layer.msg('该状态不允许查看！', { icon: 7 })
        return false
      }
      $.post('/crm/ajax/relate/list/dict', { compCode: self.selectedTr.compCode }).then(function (data) {
        Vue.set(vueObj, 'relateDict', data)
      })
      $.post('/crm/ajax/relate/buyerList', { compCode: self.selectedTr.compCode }).then(function (data) {
        Vue.set(vueObj, 'relateList', data)
      })
      $('#relation').reveal()
    },
    buyerList: function () {
      var self = this
      Vue.set(self, 'tabIndex', 1)

      $.post('/crm/ajax/relate/buyerList', { compCode: self.selectedTr.compCode }).then(function (data) {
        Vue.set(vueObj, 'relateList', data)
      })
    },
    sellerList: function () {
      var self = this
      Vue.set(self, 'tabIndex', 2)
      $.post('/crm/ajax/relate/sellerList', { compCode: self.selectedTr.compCode }).then(function (data) {
        Vue.set(vueObj, 'relateList', data)
      })
    },
    relateClose: function () {
      $('#relation').trigger('reveal:close')
    },
    showRelateDict: function (code, enumStr) {
      if (this.relateDict != null) { var list = this.relateDict[enumStr] }
      if (list != null) {
        for (i = 0; i < list.length; i++) {
          if (list[i].code == code) {
            return list[i].mark
          }
        }
      }
    },
    adjustSuperComp: function () {
      var self = this
      var flag = false
      if (self.selectedTr.compStatus != 40) {
        layer.msg('当前客户状态不允许操作！', { icon: 7 })
        return false
      }
      $.post('/ec/ajax/creditFn/creditInfo/info/checkLimitByCompCode', { compCode: self.selectedTr.compCode })
        .then(function (data) {
          if (data.code != 200) {
            layer.msg(data.message, { icon: 7 })
          } else {
            var compName = self.selectedTr.compName
            if (compName == undefined) {
              compName = null
            }
            // 此处请求后台程序，下方是成功后的前台处理……
            var index = layer.load(1, {
              shade: [0.1, '#fff'] // 0.1透明度的白色背景
            })
            $.post('/crm/ajax/supComp/find', { compName: compName })
              .then(function (data) {
                layer.close(index)
                Vue.set(self, 'legalCorporationList', data)
                $('#adjustComp').reveal()
              })
            Vue.set(self, 'compInfo', self.selectedTr)
          }
        })
    },
    adjustOk: function () {
      var self = this
      if (self.compInfo.parentCode == undefined || self.compInfo.parentCode == null || self.compInfo.parentCode == '') {
        layer.msg('请选择上级单位！', { icon: 7 })
        return false
      }
      $.http.$post('/crm/ajax/superComp/adjust', self.compInfo).then(function (data) {
        if (data.code == 200) {
          layer.msg('操作成功！', { icon: 1 })
          $('#adjustComp').trigger('reveal:close')
        } else {
          layer.msg(data.message, { icon: 2 })
          $('#adjustComp').trigger('reveal:close')
        }
        Vue.set(self, 'selectedTr', {})
        self.dosearch()
      })
    },
    adjustCancel: function () {
      $('#adjustComp').trigger('reveal:close')
    },

    compNameQuery: function (nameLike) {
      var self = this
      self.legalCorporationList = []
      $.post('/crm/ajax/comp/findByNameLike', {
        compName: self.compInfo.compName,
        nameLike: nameLike
      }).then(function (data) {
        self.legalCorporationList = data
      })
    },
    openProdAction: function () {
      var self = this
      var compCode = self.selectedTr.compCode
      var compStatus = self.selectedTr.compStatus
      self.compRev = {}
      if (compCode == null || compCode == undefined || compCode.length == 0) {
        layer.msg('请选择有效记录！', { icon: 7 })
        return false
      } else {
        if (compStatus != 40) {
          layer.msg('当前客户状态不允许操作！', { icon: 7 })
          return false
        }
        if (self.selectedTr.compRole == undefined || self.selectedTr.compRole == null) {
          layer.msg('该企业无企业角色！', { icon: 7 })
          return false
        }
        var compRole = self.selectedTr.compRole.split(',')
        for (var i = 0; i < compRole.length; i++) {
          var role = compRole[i]
          if (role != '机构投资人' && role != '律师事务所' && role != '中介服务机构') {
            layer.msg('当前客户不允许在后台开通产品操作！', { icon: 7 })
            return false
          }
        }
      }
      var index = layer.load(1, {
        shade: [0.1, '#fff'] // 0.1透明度的白色背景
      })
      $('#openProduct').reveal("{data-animation:'none'}")
      layer.closeAll('loading')
    },
    cancelProduct: function () {
      var self = this
      self.checkAll = false
      self.checkedCities = []
      $('#openProduct').trigger('reveal:close')
    },
    handleCheckAllChange: function (value) {
      var self = this
      self.checkedCities = value ? self.products : []
      self.isIndeterminate = false
    },
    handleCheckedCitiesChange: function (value) {
      var self = this
      var checkedCount = value.length
      self.checkAll = checkedCount === self.products.length
      self.isIndeterminate = checkedCount > 0 && checkedCount < self.products.length
    },
    open: function () {
      var self = this
      var compCode = self.selectedTr
      compCode.productCode = self.checkedCities
      if (compCode.productCode.length <= 0) {
        layer.msg('请选择要开通的产品', { icon: 7 })
        return false
      }
      var compRole = compCode.compRole
      for (var i = 0; i < compCode.productCode.length; i++) {
        var prod = compCode.productCode[i]
        if (prod == '智管信单') {
          if (!compRole.includes('机构投资人')) {
            layer.msg('当前企业不允许开通智管信单', { icon: 7 })
            return false
          }
        }
        if (prod == '反向保理') {
          if (!compRole.includes('律师事务所') && !compRole.includes('中介服务机构')) {
            layer.msg('当前企业不允许开通反向保理产品', { icon: 7 })
            return false
          }
        }
      }

      var index = layer.load(1, {
        shade: [0.1, '#fff'] // 0.1透明度的白色背景
      })
      $.http.$post('/crm/ajax/comp/info/openProductAction', compCode).then(function (data) {
        if (data.status == 200) {
          layer.msg('操作成功！', { icon: 1 })
          layer.close(index)
          $('#openProduct').trigger('reveal:close')
        } else {
          layer.msg(data.msg, { icon: 2, time: 3500 })
          layer.close(index)
          $('#openProduct').trigger('reveal:close')
        }
        self.checkAll = false
        self.checkedCities = []
        Vue.set(self, 'selectedTr', {})
        self.dosearch()
      })
    }

  }
})
export {
  vueObj
}
