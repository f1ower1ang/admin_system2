import dic from '@/assets/js/dic'
export default {
  data() {
    return {
      dialogTableVisible: false,
      selection: [],
      tableData: null,
      page: 1,
      limit: 8,
      total: 0,
      loading: false,
      fullscreen: false,
      editIndex: -1,
      dic
    }
  },
  methods: {
    getTableData() {
      this.loading = true
      const data = {
        page: this.page,
        limit: this.limit, pid: 0
      }
      Object.assign(data, this.formData)
      setTimeout(async() => {
        try {
          const res = await this.getItems(data)
          this.tableData = res.data
          this.total = res.count
          this.loading = false
        } catch (e) {
          this.loading = false
        }
      }, 200)
    },
    changePage(page) {
      this.page = page
      this.getTableData()
    },
    changeSize(size) {
      this.limit = size
      this.getTableData()
    },
    search() {
      this.loading = true
      this.page = 1
      this.getTableData()
    },
    addOrEditItem(itemKey, form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.editIndex === -1) {
            this.addItem(this[itemKey]).then((res) => {
              this.tableData.unshift(res.data)
              if (this.tableData.length > this.limit) {
                this.tableData.pop()
              }
              this.total += 1
              this.$message.success('添加成功')
            })
          } else {
            this.editItem(this[itemKey]).then((res) => {
              Object.assign(this.tableData[this.editIndex], res.data)
              this.$message.success('修改成功')
            })
          }
          this.cancel(itemKey)
        }
      })
    },
    cancel(itemKey) {
      this.dialogTableVisible = false
      const origin = this.$options.data()
      this[itemKey] = origin[itemKey]
    },
    deleteOneItem(item, index) {
      this.delItem(item.id).then((res) => {
        this.getTableData()
        // this.tableData.splice(index, 1)
      })
    },
    deleteMoreItem() {
      if (!this.selection || this.selection.length === 0) return
      this.delItems(this.selection).then((res) => {
        this.getTableData()
        // this.tableData = this.tableData.filter(item => this.selection.indexOf(item.id) === -1)
      })
    },
    handleSelectionChange(val) {
      this.selection = val.map(item => item.id)
    },
    showDialog(addTitle, editTitle, itemKey = '', item = null, index = -1) {
      this.editIndex = index
      console.log(item)
      if (item) {
        Object.assign(this[itemKey], item)
      }
      this.dialogTitle = index === -1 ? addTitle : editTitle
      this.dialogTableVisible = true
    }
  }
}
